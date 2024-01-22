// atir-jsonvalidator v1.0.0 Copyright (c) 2024 Adriano Tirloni
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('module')) :
  typeof define === 'function' && define.amd ? define(['exports', 'module'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["atir-jsonvalidator"] = {}, global.module));
})(this, (function (exports, module) { 'use strict';

  const require$1 = module.createRequire((typeof document === 'undefined' && typeof location === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : typeof document === 'undefined' ? location.href : (document.currentScript && document.currentScript.src || new URL('index.js', document.baseURI).href)));
  const Ajv = require$1("ajv");

  const ajv = new Ajv({
    code: {esm: true}, 
    useDefaults: "empty", 
    messages: true, 
    removeAdditional: true, 
    coerceTypes: true, 
    allErrors: true, 
    verbose: true 
  });

  function parseErrors(errors, localizeErrorFn) {
    if (!(errors && errors.length)) return {}
    
    let errorsHumanized = {};
    let errorsStructured = {};

    for (const error of errors) {
      //Path resolution
      let path = error.instancePath.split("/");
      path.shift();
      if (error.keyword == 'required') path.push(error.params.missingProperty);
      const key = path.join(".");

      //Structure Errors
      const structuredError = {keyword: error.keyword, params: error.params};
      if (!errorsStructured[key]) { 
        errorsStructured[key] = [structuredError]; 
      } else {
        errorsStructured[key].push(structuredError);
      } 

      //Humanize and i18n errors
      if (localizeErrorFn){
        localizeErrorFn(error);
        if (!errorsHumanized[key]) { 
          errorsHumanized[key] = [error.message]; 
        } else {
          errorsHumanized[key].push(error.message);
        }
      }
    }

    return {errorsStructured, errorsHumanized}
  }

  function compileSchema(schema){
    const originalAjvValidator = ajv.compile(schema);
    return validatorFactory(originalAjvValidator)
  }

  function getValidator(id){
    const originalAjvValidator = ajv.getSchema(id);
    return validatorFactory(originalAjvValidator)
  }

  function createValidator(schema){
    if (schema.$id === undefined) throw new Error("Schema must have $id")

    ajv.addSchema(schema);
    return getValidator(schema.$id)
  }

  function validatorFactory(originalAjvValidator){
    return function validator(data, {dataContext, i18nFunction } = {}){
      let isValid = originalAjvValidator(data, dataContext);
      
      let parsedErrors = parseErrors(originalAjvValidator.errors, i18nFunction);
    
      return {
        isValid,
        errors: originalAjvValidator.errors,
        errorsStructured: parsedErrors.errorsStructured,
        errorsHumanized: parsedErrors.errorsHumanized,
        ...originalAjvValidator
      }
    }
  }

  exports.compileSchema = compileSchema;
  exports.createValidator = createValidator;
  exports.getValidator = getValidator;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
