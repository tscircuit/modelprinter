import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseDiaphragmPumpModelParams } from "./parse-model-string"
import { diaphragmPumpModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "diaphragmpump",
  schema: diaphragmPumpModelDefinitionSchema,
  parse: parseDiaphragmPumpModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
