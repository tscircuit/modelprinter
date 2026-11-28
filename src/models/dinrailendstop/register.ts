import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseDinRailEndStopModelString } from "./parse-model-string"
import { dinRailEndStopModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "dinrailendstop",
  schema: dinRailEndStopModelDefinitionSchema,
  parse: parseDinRailEndStopModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
