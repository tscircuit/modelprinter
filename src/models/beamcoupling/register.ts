import { defineModel, type ModelRegistry } from "../../model-registry"
import { beamCouplingModelDefinitionSchema } from "./schema"
import { parseBeamCouplingModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "beamcoupling",
  schema: beamCouplingModelDefinitionSchema,
  parse: parseBeamCouplingModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
