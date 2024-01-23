// const Ajv = require("ajv")

import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({
  code: {esm: true}, 
  useDefaults: "empty", 
  messages: true, 
  removeAdditional: true, 
  coerceTypes: true, 
  allErrors: true, 
  verbose: true 
})
addFormats(ajv)


function parseErrors(errors, localizeErrorFn) {
  if (!(errors && errors.length)) return {}
  
  let errorsHumanized = {}
  let errorsStructured = {}

  for (const error of errors) {
    //Path resolution
    let path = error.instancePath.split("/")
    path.shift()
    if (error.keyword == 'required') path.push(error.params.missingProperty)
    const key = path.join(".")

    //Structure Errors
    const structuredError = {keyword: error.keyword, params: error.params}
    if (!errorsStructured[key]) { 
      errorsStructured[key] = [structuredError] 
    } else {
      errorsStructured[key].push(structuredError)
    } 

    //Humanize and i18n errors
    if (localizeErrorFn){
      localizeErrorFn(error)
      if (!errorsHumanized[key]) { 
        errorsHumanized[key] = [error.message] 
      } else {
        errorsHumanized[key].push(error.message)
      }
    }
  }

  return {errorsStructured, errorsHumanized}
}

export function compileSchema(schema){
  const originalAjvValidator = ajv.compile(schema)
  return validatorFactory(originalAjvValidator)
}

export function getValidator(id){
  const originalAjvValidator = ajv.getSchema(id)
  return validatorFactory(originalAjvValidator)
}

export function createValidator(schema){
  if (schema.$id === undefined) throw new Error("Schema must have $id")

  ajv.addSchema(schema)
  return getValidator(schema.$id)
}

function validatorFactory(originalAjvValidator){
  return function validator(data, {dataContext, i18nFunction } = {}){
    let isValid = originalAjvValidator(data, dataContext)
    
    let parsedErrors = parseErrors(originalAjvValidator.errors, i18nFunction)
  
    return {
      isValid,
      errors: originalAjvValidator.errors,
      errorsStructured: parsedErrors.errorsStructured,
      errorsHumanized: parsedErrors.errorsHumanized,
      ...originalAjvValidator
    }
  }
}