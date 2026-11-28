import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseDShackleModelString } from "./parse-model-string"
import { dShackleModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "dshackle",
  schema: dShackleModelDefinitionSchema,
  parse: parseDShackleModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
