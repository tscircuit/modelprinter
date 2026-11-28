import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseCompoundGearModelString } from "./parse-model-string"
import { compoundGearModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "compoundgear",
  schema: compoundGearModelDefinitionSchema,
  parse: parseCompoundGearModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
