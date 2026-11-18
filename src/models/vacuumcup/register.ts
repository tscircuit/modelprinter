import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseVacuumCupModelParams } from "./parse-model-string"
import { vacuumCupModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "vacuumcup",
  schema: vacuumCupModelDefinitionSchema,
  parse: parseVacuumCupModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
