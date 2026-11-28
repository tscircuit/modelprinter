import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseSubmersiblePumpModelString } from "./parse-model-string"
import { submersiblePumpModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "submersiblepump",
  schema: submersiblePumpModelDefinitionSchema,
  parse: parseSubmersiblePumpModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
