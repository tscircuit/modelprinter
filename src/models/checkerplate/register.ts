import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseCheckerPlateModelString } from "./parse-model-string"
import { checkerPlateModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "checkerplate",
  schema: checkerPlateModelDefinitionSchema,
  parse: parseCheckerPlateModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
