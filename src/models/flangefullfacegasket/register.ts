import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseFlangeFullFaceGasketModelString } from "./parse-model-string"
import { flangeFullFaceGasketModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "flangefullfacegasket",
  schema: flangeFullFaceGasketModelDefinitionSchema,
  parse: parseFlangeFullFaceGasketModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
