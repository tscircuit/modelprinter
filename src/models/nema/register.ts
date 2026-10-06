import { defineModel, type ModelRegistry } from "../../model-registry"
import { nemaMotorModelDefinitionSchema } from "../../nema-motor-schema"
import { parseNemaMotorModelParams } from "../../parse-nema-motor-model-string"

export const model = defineModel({
  name: "nema",
  schema: nemaMotorModelDefinitionSchema,
  parse: parseNemaMotorModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
