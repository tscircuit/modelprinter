import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseSplinedShaftModelString } from "./parse-model-string"
import { splinedShaftModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "splinedshaft",
  schema: splinedShaftModelDefinitionSchema,
  parse: parseSplinedShaftModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
