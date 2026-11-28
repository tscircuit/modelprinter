import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseAngularContactBearingModelString } from "./parse-model-string"
import { angularContactBearingModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "angularcontactbearing",
  schema: angularContactBearingModelDefinitionSchema,
  parse: parseAngularContactBearingModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
