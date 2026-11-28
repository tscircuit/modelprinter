import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseRoundNutModelString } from "./parse-model-string"
import { roundNutModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "roundnut",
  schema: roundNutModelDefinitionSchema,
  parse: parseRoundNutModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
