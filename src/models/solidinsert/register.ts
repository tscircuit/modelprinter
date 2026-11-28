import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseSolidInsertModelString } from "./parse-model-string"
import { solidInsertModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "solidinsert",
  schema: solidInsertModelDefinitionSchema,
  parse: parseSolidInsertModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
