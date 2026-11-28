import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseThreadCuttingScrewModelString } from "./parse-model-string"
import { threadCuttingScrewModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "threadcuttingscrew",
  schema: threadCuttingScrewModelDefinitionSchema,
  parse: parseThreadCuttingScrewModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
