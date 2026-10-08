import { defineModel, type ModelRegistry } from "../../model-registry"
import { adhesiveMountElectricalHeatsinkModelDefinitionSchema } from "./schema"
import { parseAdhesiveMountElectricalHeatsinkModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "adhesivemountelectricalheatsink",
  schema: adhesiveMountElectricalHeatsinkModelDefinitionSchema,
  parse: parseAdhesiveMountElectricalHeatsinkModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
