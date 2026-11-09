import { defineModel, type ModelRegistry } from "../../model-registry"
import { solidRivetModelDefinitionSchema } from "./schema"
import { parseSolidRivetModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "solidrivet",
  schema: solidRivetModelDefinitionSchema,
  parse: parseSolidRivetModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
