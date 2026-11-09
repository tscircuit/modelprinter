import { defineModel, type ModelRegistry } from "../../model-registry"
import { vGrooveWheelModelDefinitionSchema } from "./schema"
import { parseVGrooveWheelModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "vgroovewheel",
  schema: vGrooveWheelModelDefinitionSchema,
  parse: parseVGrooveWheelModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
