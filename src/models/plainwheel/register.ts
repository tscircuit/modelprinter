import { defineModel, type ModelRegistry } from "../../model-registry"
import { parsePlainWheelModelString } from "./parse-model-string"
import { plainWheelModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "plainwheel",
  schema: plainWheelModelDefinitionSchema,
  parse: parsePlainWheelModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
