import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseWallCaseModelString } from "./parse-model-string"
import { wallCaseModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "wallcase",
  schema: wallCaseModelDefinitionSchema,
  parse: parseWallCaseModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
