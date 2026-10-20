import { defineModel, type ModelRegistry } from "../../model-registry"
import { vacuumCupModelDefinitionSchema } from "./schema"
import { parseVacuumCupModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "vacuumcup",
  schema: vacuumCupModelDefinitionSchema,
  parse: parseVacuumCupModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
