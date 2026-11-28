import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseBondedSealingWasherModelString } from "./parse-model-string"
import { bondedSealingWasherModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "bondedsealingwasher",
  schema: bondedSealingWasherModelDefinitionSchema,
  parse: parseBondedSealingWasherModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
