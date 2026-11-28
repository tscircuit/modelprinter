import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseLagScrewModelString } from "./parse-model-string"
import { lagScrewModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "lagscrew",
  schema: lagScrewModelDefinitionSchema,
  parse: parseLagScrewModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
