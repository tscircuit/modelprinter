import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseSplitTubeModelString } from "./parse-model-string"
import { splitTubeModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "splittube",
  schema: splitTubeModelDefinitionSchema,
  parse: parseSplitTubeModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
