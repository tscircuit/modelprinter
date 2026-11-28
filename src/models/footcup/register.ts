import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseFootCupModelString } from "./parse-model-string"
import { footCupModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "footcup",
  schema: footCupModelDefinitionSchema,
  parse: parseFootCupModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
