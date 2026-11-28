import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseFanShroudModelString } from "./parse-model-string"
import { fanShroudModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "fanshroud",
  schema: fanShroudModelDefinitionSchema,
  parse: parseFanShroudModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
