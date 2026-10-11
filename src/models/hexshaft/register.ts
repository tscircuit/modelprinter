import { defineModel, type ModelRegistry } from "../../model-registry"
import { hexShaftModelDefinitionSchema } from "./schema"
import { parseHexShaftModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "hexshaft",
  schema: hexShaftModelDefinitionSchema,
  parse: parseHexShaftModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
