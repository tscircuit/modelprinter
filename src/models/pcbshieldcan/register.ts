import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseShieldCanModelString } from "./parse-model-string"
import { shieldCanModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "pcbshieldcan",
  schema: shieldCanModelDefinitionSchema,
  parse: parseShieldCanModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
