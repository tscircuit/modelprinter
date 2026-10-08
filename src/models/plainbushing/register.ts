import { normalizeModelStringFlags } from "../../utils/model-string-flags"
import { stringFlags, omittedStringFlags } from "./string-flags"
import { defineModel, type ModelRegistry } from "../../model-registry"
import { parsePlainBushingModelParams } from "./parse-model-string"
import { plainBushingModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "plainbushing",
  schema: plainBushingModelDefinitionSchema,
  parse: parsePlainBushingModelParams,
  normalizeString: (value) =>
    normalizeModelStringFlags(
      value,
      stringFlags,
      parsePlainBushingModelParams,
      omittedStringFlags,
    ),
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
