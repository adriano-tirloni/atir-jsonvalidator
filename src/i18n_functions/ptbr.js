
export function ptbr(error){
  if (typeof error === 'string') return {message: error}
  
  let out
  switch (error.keyword) {
    case "additionalItems":
    case "items":
      out = "não são permitidos itens adicionais (mais do que " + n + ")"
      break
    case "additionalProperties":
      out = "não são permitidas propriedades adicionais"
      break
    case "anyOf":
      out = 'a informação não corresponde a nenhuma estrutura permitida"'
      break
    case "const":
      out = "não é igual ao calor esperado"
      break
    case "contains":
      out = "não contém um item válido"
      break
    case "dependencies":
    case "dependentRequired":
      out = ""
      var n = error.params.depsCount
      out += " deve ter propriedade"
      if (n != 1) {
        out += "s"
      }
      out +=
        " " +
        error.params.deps +
        " quando a propriedade " +
        error.params.property +
        " estiver presente"
      break
    case "discriminator":
      switch (error.params.error) {
        case "tag":
          out = 'a tag "' + error.params.tag + '" deve ser uma string'
          break
        case "mapping":
          out = 'o valor da tag "' + error.params.tag + '" deve estar no oneOf'
          break
        default:
          out = 'deve passar a validação da keyword "' + error.keyword + '"'
      }
      break
    case "enum":
      out = "deve ser igual a um dos valores permitidos"
      break
    case "false schema":
      out = 'o schema booleano é "false"'
      break
    case "format":
      out = 'deve corresponder ao formato "' + error.params.format + '"'
      break
    case "formatMaximum":
    case "formatExclusiveMaximum":
      out = ""
      var cond = error.params.comparison + " " + error.params.limit
      out += "deve ser " + cond
      break
    case "formatMinimum":
    case "formatExclusiveMinimum":
      out = ""
      var cond = error.params.comparison + " " + error.params.limit
      out += "deve ser " + cond
      break
    case "if":
      out = 'deve corresponder ao schema "' + error.params.failingKeyword + '"'
      break
    case "maximum":
    case "exclusiveMaximum":
      out = ""
      var cond = error.params.comparison + " " + error.params.limit
      out += "deve ser " + cond
      break
    case "maxItems":
      out = ""
      var n = error.params.limit
      out += "não deve ter mais que " + n + " elemento"
      if (n != 1) {
        out += "s"
      }
      break
    case "maxLength":
      out = ""
      var n = error.params.limit
      out += "não deve ser maior que " + n + " caracter"
      if (n != 1) {
        out += "es"
      }
      break
    case "maxProperties":
      out = ""
      var n = error.params.limit
      out += "não deve ter mais que " + n + " propriedade"
      if (n != 1) {
        out += "s"
      }
      break
    case "minimum":
    case "exclusiveMinimum":
      out = ""
      var cond = error.params.comparison + " " + error.params.limit
      out += "deve ser " + cond
      break
    case "minItems":
      out = ""
      var n = error.params.limit
      out += "não deve ter menos que " + n + " elemento"
      if (n != 1) {
        out += "s"
      }
      break
    case "minLength":
      out = ""
      var n = error.params.limit
      out += "não deve ser mais curta que " + n + " caracter"
      if (n != 1) {
        out += "es"
      }
      break
    case "minProperties":
      out = ""
      var n = error.params.limit
      out += "não deve ter menos que " + n + " propriedade"
      if (n != 1) {
        out += "s"
      }
      break
    case "multipleOf":
      out = "deve ser múltiplo de " + error.params.multipleOf
      break
    case "not":
      out = 'não deve ser valido segundo o schema em "not"'
      break
    case "oneOf":
      out = 'deve corresponder exatamente com um schema em "oneOf"'
      break
    case "pattern":
      out = 'deve corresponder ao padrão "' + error.params.pattern + '"'
      break
    case "patternRequired":
      out =
        'deve ter a propriedade correspondente ao padrão "' +
        error.params.missingPattern +
        '"'
      break
    case "propertyNames":
      out = "o nome da propriedade é inválido"
      break
    case "required":
      out = "deve ter a propriedade obrigatória " + error.params.missingProperty
      break
    case "type":
      out = ""
      var t = error.params.type
      out += "deve ser "
      if (t == "number") {
        out += "um número"
      } else if (t == "integer") {
        out += "um número inteiro"
      } else if (t == "string") {
        out += "um texto"
      } else if (t == "boolean") {
        out += "um booleano"
      } else {
        out += t
      }
      break
    case "unevaluatedItems":
      out = ""
      var n = error.params.len
      out += "não pode possuir mais que " + n + " "
      if (n == 1) {
        out += "item"
      } else {
        out += "itens"
      }
      break
    case "unevaluatedProperties":
      out = "não pode possuir propridades não avaliadas"
      break
    case "uniqueItems":
      out =
        "não deve ter itens duplicados (os itens ## " +
        error.params.j +
        " e " +
        error.params.i +
        " são idênticos)"
      break
    default:
      out = 'deve passar a validação da keyword "' + error.keyword + '"'
  }

  error.message = out
}
