import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseDuctFlangeModelParams } from "./parse-model-string"
import { ductFlangeModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "ductflange",
  schema: ductFlangeModelDefinitionSchema,
  parse: parseDuctFlangeModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
