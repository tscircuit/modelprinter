import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseTensionerPulleyModelString } from "./parse-model-string"
import { tensionerPulleyModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "tensionerpulley",
  schema: tensionerPulleyModelDefinitionSchema,
  parse: parseTensionerPulleyModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
