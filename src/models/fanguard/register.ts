import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseFanGuardModelString } from "./parse-model-string"
import { fanGuardModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "fanguard",
  schema: fanGuardModelDefinitionSchema,
  parse: parseFanGuardModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
