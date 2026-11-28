import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseDinRailModelString } from "./parse-model-string"
import { dinRailModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "dinrail",
  schema: dinRailModelDefinitionSchema,
  parse: parseDinRailModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
