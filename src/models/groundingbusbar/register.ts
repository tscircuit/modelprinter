import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseGroundingBusbarModelString } from "./parse-model-string"
import { groundingBusbarModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "groundingbusbar",
  schema: groundingBusbarModelDefinitionSchema,
  parse: parseGroundingBusbarModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
