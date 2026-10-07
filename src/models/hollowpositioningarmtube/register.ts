import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseHollowPositioningArmTubeModelParams } from "./parse-model-string"
import { hollowPositioningArmTubeModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "hollowpositioningarmtube",
  schema: hollowPositioningArmTubeModelDefinitionSchema,
  parse: parseHollowPositioningArmTubeModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
