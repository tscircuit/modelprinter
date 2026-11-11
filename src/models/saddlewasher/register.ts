import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseSaddleWasherModelParams } from "./parse-model-string"
import { saddleWasherModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "saddlewasher",
  schema: saddleWasherModelDefinitionSchema,
  parse: parseSaddleWasherModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
