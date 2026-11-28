import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseExternalGearPumpModelString } from "./parse-model-string"
import { externalGearPumpModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "externalgearpump",
  schema: externalGearPumpModelDefinitionSchema,
  parse: parseExternalGearPumpModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
