import { defineModel, type ModelRegistry } from "../../model-registry"
import {
  normalizeThreadedRodModelString,
  parseThreadedRodModelParams,
} from "./parse-model-string"
import { threadedRodModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "threadedrod",
  schema: threadedRodModelDefinitionSchema,
  parse: parseThreadedRodModelParams,
  normalizeString: normalizeThreadedRodModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
