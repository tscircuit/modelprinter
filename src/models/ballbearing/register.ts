import { defineModel, type ModelRegistry } from "../../model-registry"
import {
  normalizeBallBearingModelString,
  parseBallBearingModelParams,
} from "./parse-model-string"
import { ballBearingModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "ballbearing",
  schema: ballBearingModelDefinitionSchema,
  parse: parseBallBearingModelParams,
  normalizeString: normalizeBallBearingModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
