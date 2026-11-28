import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseTSlotTeePlateModelString } from "./parse-model-string"
import { tSlotTeePlateModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "tslotteeplate",
  schema: tSlotTeePlateModelDefinitionSchema,
  parse: parseTSlotTeePlateModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
