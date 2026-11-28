import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseDrillPressViseModelString } from "./parse-model-string"
import { drillPressViseModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "drillpressvise",
  schema: drillPressViseModelDefinitionSchema,
  parse: parseDrillPressViseModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
