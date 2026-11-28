import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseFlangedBallBearingModelString } from "./parse-model-string"
import { flangedBallBearingModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "flangedballbearing",
  schema: flangedBallBearingModelDefinitionSchema,
  parse: parseFlangedBallBearingModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
