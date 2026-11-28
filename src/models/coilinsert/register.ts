import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseCoilInsertModelString } from "./parse-model-string"
import { coilInsertModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "coilinsert",
  schema: coilInsertModelDefinitionSchema,
  parse: parseCoilInsertModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
