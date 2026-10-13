import { defineModel, type ModelRegistry } from "../../model-registry"
import { detentPinModelDefinitionSchema } from "./schema"
import { parseDetentPinModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "detentpin",
  schema: detentPinModelDefinitionSchema,
  parse: parseDetentPinModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
