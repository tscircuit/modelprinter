import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseMecanumWheelModelString } from "./parse-model-string"
import { mecanumWheelModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "mecanumwheel",
  schema: mecanumWheelModelDefinitionSchema,
  parse: parseMecanumWheelModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
