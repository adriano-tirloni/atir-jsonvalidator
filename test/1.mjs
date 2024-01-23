import { i18n, compileSchema, createValidator } from "../dist/esm/index.mjs";
console.log(i18n)

let validator = compileSchema({
  $id: "teste4",
  type: "object",
  required: ["foo"]
})

createValidator({
  $id: "teste2",
  type: "object",
  required: ["foo"]
})

let validator2 = createValidator({
  $id: "teste",
  type: "object",
  required: ["foo"]
})
console.log(validator2)

let result = validator({fooa: 1})

console.log(result.errorsStructured)