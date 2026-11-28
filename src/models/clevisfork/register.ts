import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseClevisForkModelString } from "./parse-model-string"
import { clevisForkModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "clevisfork",
  schema: clevisForkModelDefinitionSchema,
  parse: parseClevisForkModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
