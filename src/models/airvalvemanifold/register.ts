import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseAirValveManifoldModelParams } from "./parse-model-string"
import { airValveManifoldModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "airvalvemanifold",
  schema: airValveManifoldModelDefinitionSchema,
  parse: parseAirValveManifoldModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
