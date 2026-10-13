import { defineModel, type ModelRegistry } from "../../model-registry"
import { woodruffKeyModelDefinitionSchema } from "./schema"
import { parseWoodruffKeyModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "woodruffkey",
  schema: woodruffKeyModelDefinitionSchema,
  parse: parseWoodruffKeyModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
