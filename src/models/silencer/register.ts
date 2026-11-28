import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseSilencerModelString } from "./parse-model-string"
import { silencerModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "silencer",
  schema: silencerModelDefinitionSchema,
  parse: parseSilencerModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
