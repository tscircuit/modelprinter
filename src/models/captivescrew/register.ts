import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseCaptiveScrewModelString } from "./parse-model-string"
import { captiveScrewModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "captivescrew",
  schema: captiveScrewModelDefinitionSchema,
  parse: parseCaptiveScrewModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
