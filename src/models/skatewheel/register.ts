import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseSkateWheelModelString } from "./parse-model-string"
import { skateWheelModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "skatewheel",
  schema: skateWheelModelDefinitionSchema,
  parse: parseSkateWheelModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
