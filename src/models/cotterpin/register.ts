import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseCotterPinModelString } from "./parse-model-string"
import { cotterPinModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "cotterpin",
  schema: cotterPinModelDefinitionSchema,
  parse: parseCotterPinModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
