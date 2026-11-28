import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseWingScrewModelString } from "./parse-model-string"
import { wingScrewModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "wingscrew",
  schema: wingScrewModelDefinitionSchema,
  parse: parseWingScrewModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
