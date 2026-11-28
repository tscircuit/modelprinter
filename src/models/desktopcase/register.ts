import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseDesktopCaseModelString } from "./parse-model-string"
import { desktopCaseModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "desktopcase",
  schema: desktopCaseModelDefinitionSchema,
  parse: parseDesktopCaseModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
