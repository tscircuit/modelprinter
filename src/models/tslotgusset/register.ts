import { normalizeModelStringFlags } from "../../utils/model-string-flags"
import { stringFlags, omittedStringFlags } from "./string-flags"
import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseTSlotGussetModelParams } from "./parse-model-string"
import { tSlotGussetModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "tslotgusset",
  schema: tSlotGussetModelDefinitionSchema,
  parse: parseTSlotGussetModelParams,
  normalizeString: (value) =>
    normalizeModelStringFlags(
      value,
      stringFlags,
      parseTSlotGussetModelParams,
      omittedStringFlags,
    ),
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
