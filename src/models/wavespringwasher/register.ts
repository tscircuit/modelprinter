import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseWaveSpringWasherModelString } from "./parse-model-string"
import { waveSpringWasherModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "wavespringwasher",
  schema: waveSpringWasherModelDefinitionSchema,
  parse: parseWaveSpringWasherModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
