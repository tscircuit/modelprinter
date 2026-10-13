import { defineModel, type ModelRegistry } from "../../model-registry"
import { pilotLightModelDefinitionSchema } from "./schema"
import { parsePilotLightModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "pilotlight",
  schema: pilotLightModelDefinitionSchema,
  parse: parsePilotLightModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
