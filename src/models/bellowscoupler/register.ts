import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseBellowsCouplerModelString } from "./parse-model-string"
import { bellowsCouplerModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "bellowscoupler",
  schema: bellowsCouplerModelDefinitionSchema,
  parse: parseBellowsCouplerModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
