import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseGrooveRollerBearingModelString } from "./parse-model-string"
import { grooveRollerBearingModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "grooverollerbearing",
  schema: grooveRollerBearingModelDefinitionSchema,
  parse: parseGrooveRollerBearingModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
