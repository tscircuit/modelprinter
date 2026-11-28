import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseAntiBacklashNutModelString } from "./parse-model-string"
import { antiBacklashNutModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "antibacklashnut",
  schema: antiBacklashNutModelDefinitionSchema,
  parse: parseAntiBacklashNutModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
