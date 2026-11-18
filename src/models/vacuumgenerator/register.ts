import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseVacuumGeneratorModelParams } from "./parse-model-string"
import { vacuumGeneratorModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "vacuumgenerator",
  schema: vacuumGeneratorModelDefinitionSchema,
  parse: parseVacuumGeneratorModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
