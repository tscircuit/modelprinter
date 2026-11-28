import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseLowHeadSocketModelString } from "./parse-model-string"
import { lowHeadSocketModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "lowheadsocket",
  schema: lowHeadSocketModelDefinitionSchema,
  parse: parseLowHeadSocketModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
