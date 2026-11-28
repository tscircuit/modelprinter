import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseCamLatchModelString } from "./parse-model-string"
import { camLatchModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "camlatch",
  schema: camLatchModelDefinitionSchema,
  parse: parseCamLatchModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
