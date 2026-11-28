import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseDShaftModelString } from "./parse-model-string"
import { dShaftModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "dshaft",
  schema: dShaftModelDefinitionSchema,
  parse: parseDShaftModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
