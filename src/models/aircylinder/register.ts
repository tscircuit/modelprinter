import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseAirCylinderModelParams } from "./parse-model-string"
import { airCylinderModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "aircylinder",
  schema: airCylinderModelDefinitionSchema,
  parse: parseAirCylinderModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
