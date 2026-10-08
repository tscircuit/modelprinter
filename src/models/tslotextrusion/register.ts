import { normalizeModelStringFlags } from "../../utils/model-string-flags"
import { stringFlags, omittedStringFlags } from "./string-flags"
import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseTSlotExtrusionModelParams } from "./parse-model-string"
import { tSlotExtrusionModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "tslotextrusion",
  schema: tSlotExtrusionModelDefinitionSchema,
  parse: parseTSlotExtrusionModelParams,
  normalizeString: (value) =>
    normalizeModelStringFlags(
      value,
      stringFlags,
      parseTSlotExtrusionModelParams,
      omittedStringFlags,
    ),
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
