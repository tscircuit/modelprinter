import { defineModel, type ModelRegistry } from "../../model-registry"
import { dinRailModelDefinitionSchema } from "./schema"
import { parseDinRailModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "dinrail",
  schema: dinRailModelDefinitionSchema,
  parse: parseDinRailModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
