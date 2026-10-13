import { defineModel, type ModelRegistry } from "../../model-registry"
import { handwheelModelDefinitionSchema } from "./schema"
import { parseHandwheelModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "handwheel",
  schema: handwheelModelDefinitionSchema,
  parse: parseHandwheelModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
