import { defineModel, type ModelRegistry } from "../../model-registry"
import { flexScreenModelDefinitionSchema } from "./schema"
import { parseFlexScreenModelParams } from "../../parse-flex-screen-model-string"

export const model = defineModel({
  name: "flexscreen",
  schema: flexScreenModelDefinitionSchema,
  parse: parseFlexScreenModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
