// atir-jsonvalidator v1.0.3 Copyright (c) 2024 Adriano Tirloni
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const Ajv = require("ajv");

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

function ptbr(error){
  let out;
  switch (error.keyword) {
    case "additionalItems":
    case "items":
      out = "não são permitidos itens adicionais (mais do que " + n + ")";
      break
    case "additionalProperties":
      out = "não são permitidas propriedades adicionais";
      break
    case "anyOf":
      out = 'a informação não corresponde a nenhuma estrutura permitida"';
      break
    case "const":
      out = "não é igual ao calor esperado";
      break
    case "contains":
      out = "não contém um item válido";
      break
    case "dependencies":
    case "dependentRequired":
      out = "";
      var n = error.params.depsCount;
      out += " deve ter propriedade";
      if (n != 1) {
        out += "s";
      }
      out +=
        " " +
        error.params.deps +
        " quando a propriedade " +
        error.params.property +
        " estiver presente";
      break
    case "discriminator":
      switch (error.params.error) {
        case "tag":
          out = 'a tag "' + error.params.tag + '" deve ser uma string';
          break
        case "mapping":
          out = 'o valor da tag "' + error.params.tag + '" deve estar no oneOf';
          break
        default:
          out = 'deve passar a validação da keyword "' + error.keyword + '"';
      }
      break
    case "enum":
      out = "deve ser igual a um dos valores permitidos";
      break
    case "false schema":
      out = 'o schema booleano é "false"';
      break
    case "format":
      out = 'deve corresponder ao formato "' + error.params.format + '"';
      break
    case "formatMaximum":
    case "formatExclusiveMaximum":
      out = "";
      var cond = error.params.comparison + " " + error.params.limit;
      out += "deve ser " + cond;
      break
    case "formatMinimum":
    case "formatExclusiveMinimum":
      out = "";
      var cond = error.params.comparison + " " + error.params.limit;
      out += "deve ser " + cond;
      break
    case "if":
      out = 'deve corresponder ao schema "' + error.params.failingKeyword + '"';
      break
    case "maximum":
    case "exclusiveMaximum":
      out = "";
      var cond = error.params.comparison + " " + error.params.limit;
      out += "deve ser " + cond;
      break
    case "maxItems":
      out = "";
      var n = error.params.limit;
      out += "não deve ter mais que " + n + " elemento";
      if (n != 1) {
        out += "s";
      }
      break
    case "maxLength":
      out = "";
      var n = error.params.limit;
      out += "não deve ser maior que " + n + " caracter";
      if (n != 1) {
        out += "es";
      }
      break
    case "maxProperties":
      out = "";
      var n = error.params.limit;
      out += "não deve ter mais que " + n + " propriedade";
      if (n != 1) {
        out += "s";
      }
      break
    case "minimum":
    case "exclusiveMinimum":
      out = "";
      var cond = error.params.comparison + " " + error.params.limit;
      out += "deve ser " + cond;
      break
    case "minItems":
      out = "";
      var n = error.params.limit;
      out += "não deve ter menos que " + n + " elemento";
      if (n != 1) {
        out += "s";
      }
      break
    case "minLength":
      out = "";
      var n = error.params.limit;
      out += "não deve ser mais curta que " + n + " caracter";
      if (n != 1) {
        out += "es";
      }
      break
    case "minProperties":
      out = "";
      var n = error.params.limit;
      out += "não deve ter menos que " + n + " propriedade";
      if (n != 1) {
        out += "s";
      }
      break
    case "multipleOf":
      out = "deve ser múltiplo de " + error.params.multipleOf;
      break
    case "not":
      out = 'não deve ser valido segundo o schema em "not"';
      break
    case "oneOf":
      out = 'deve corresponder exatamente com um schema em "oneOf"';
      break
    case "pattern":
      out = 'deve corresponder ao padrão "' + error.params.pattern + '"';
      break
    case "patternRequired":
      out =
        'deve ter a propriedade correspondente ao padrão "' +
        error.params.missingPattern +
        '"';
      break
    case "propertyNames":
      out = "o nome da propriedade é inválido";
      break
    case "required":
      out = "deve ter a propriedade obrigatória " + error.params.missingProperty;
      break
    case "type":
      out = "";
      var t = error.params.type;
      out += "deve ser ";
      if (t == "number") {
        out += "um número";
      } else if (t == "integer") {
        out += "um número inteiro";
      } else if (t == "string") {
        out += "um texto";
      } else if (t == "boolean") {
        out += "um booleano";
      } else {
        out += t;
      }
      break
    case "unevaluatedItems":
      out = "";
      var n = error.params.len;
      out += "não pode possuir mais que " + n + " ";
      if (n == 1) {
        out += "item";
      } else {
        out += "itens";
      }
      break
    case "unevaluatedProperties":
      out = "não pode possuir propridades não avaliadas";
      break
    case "uniqueItems":
      out =
        "não deve ter itens duplicados (os itens ## " +
        error.params.j +
        " e " +
        error.params.i +
        " são idênticos)";
      break
    default:
      out = 'deve passar a validação da keyword "' + error.keyword + '"';
  }

  error.message = out;
}

const index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ptbr: ptbr
});

export { compileSchema, createValidator, getValidator, index as i18n };
