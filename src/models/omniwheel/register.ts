import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseOmniWheelModelString } from "./parse-model-string"
import { omniWheelModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "omniwheel",
  schema: omniWheelModelDefinitionSchema,
  parse: parseOmniWheelModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
