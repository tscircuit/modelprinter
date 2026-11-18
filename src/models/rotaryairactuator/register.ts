import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseRotaryAirActuatorModelParams } from "./parse-model-string"
import { rotaryAirActuatorModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "rotaryairactuator",
  schema: rotaryAirActuatorModelDefinitionSchema,
  parse: parseRotaryAirActuatorModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
