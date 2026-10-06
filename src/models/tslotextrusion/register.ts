import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseTSlotExtrusionModelParams } from "./parse-model-string"
import { tSlotExtrusionModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "tslotextrusion",
  schema: tSlotExtrusionModelDefinitionSchema,
  parse: parseTSlotExtrusionModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
