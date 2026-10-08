import { defineModel, type ModelRegistry } from "../../model-registry"
import { adhesiveMountElectricalComponentHeatsinkModelDefinitionSchema } from "./schema"
import { parseAdhesiveMountElectricalComponentHeatsinkModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "adhesivemountelectricalcomponentheatsink",
  schema: adhesiveMountElectricalComponentHeatsinkModelDefinitionSchema,
  parse: parseAdhesiveMountElectricalComponentHeatsinkModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
