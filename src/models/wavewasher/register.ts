import { defineModel, type ModelRegistry } from "../../model-registry"
import { waveWasherModelDefinitionSchema } from "./schema"
import { parseWaveWasherModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "wavewasher",
  schema: waveWasherModelDefinitionSchema,
  parse: parseWaveWasherModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
