import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseBrushlessDcMotorModelString } from "./parse-model-string"
import { brushlessDcMotorModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "brushlessdcmotor",
  schema: brushlessDcMotorModelDefinitionSchema,
  parse: parseBrushlessDcMotorModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
