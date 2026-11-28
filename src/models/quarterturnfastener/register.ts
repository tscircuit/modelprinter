import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseQuarterTurnFastenerModelString } from "./parse-model-string"
import { quarterTurnFastenerModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "quarterturnfastener",
  schema: quarterTurnFastenerModelDefinitionSchema,
  parse: parseQuarterTurnFastenerModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
