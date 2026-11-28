import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseDoubleBallBearingModelString } from "./parse-model-string"
import { doubleBallBearingModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "doubleballbearing",
  schema: doubleBallBearingModelDefinitionSchema,
  parse: parseDoubleBallBearingModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
