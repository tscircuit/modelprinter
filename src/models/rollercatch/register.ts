import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseRollerCatchModelString } from "./parse-model-string"
import { rollerCatchModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "rollercatch",
  schema: rollerCatchModelDefinitionSchema,
  parse: parseRollerCatchModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
