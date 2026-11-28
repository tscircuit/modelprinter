import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseFillisterHeadScrewModelString } from "./parse-model-string"
import { fillisterHeadScrewModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "fillisterheadscrew",
  schema: fillisterHeadScrewModelDefinitionSchema,
  parse: parseFillisterHeadScrewModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
