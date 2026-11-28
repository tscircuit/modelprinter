import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseBrushDcMotorModelString } from "./parse-model-string"
import { brushDcMotorModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "brushdcmotor",
  schema: brushDcMotorModelDefinitionSchema,
  parse: parseBrushDcMotorModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
