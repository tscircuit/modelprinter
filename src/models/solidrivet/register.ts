import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseSolidRivetModelParams } from "./parse-model-string"
import { solidRivetModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "solidrivet",
  schema: solidRivetModelDefinitionSchema,
  parse: parseSolidRivetModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
