import { defineModel, type ModelRegistry } from "../../model-registry"
import { rollerChainModelDefinitionSchema } from "./schema"
import { parseRollerChainModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "rollerchain",
  schema: rollerChainModelDefinitionSchema,
  parse: parseRollerChainModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
