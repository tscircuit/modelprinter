import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseGuardPanelClampModelString } from "./parse-model-string"
import { guardPanelClampModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "guardpanelclamp",
  schema: guardPanelClampModelDefinitionSchema,
  parse: parseGuardPanelClampModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
