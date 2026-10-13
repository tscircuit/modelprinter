import { defineModel, type ModelRegistry } from "../../model-registry"
import { inductiveProximitySensorModelDefinitionSchema } from "./schema"
import { parseInductiveProximitySensorModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "inductiveproximitysensor",
  schema: inductiveProximitySensorModelDefinitionSchema,
  parse: parseInductiveProximitySensorModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
