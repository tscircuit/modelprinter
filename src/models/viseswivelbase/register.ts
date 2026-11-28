import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseViseSwivelBaseModelString } from "./parse-model-string"
import { viseSwivelBaseModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "viseswivelbase",
  schema: viseSwivelBaseModelDefinitionSchema,
  parse: parseViseSwivelBaseModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
