import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseAirGripperModelParams } from "./parse-model-string"
import { airGripperModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "airgripper",
  schema: airGripperModelDefinitionSchema,
  parse: parseAirGripperModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
