import { defineModel, type ModelRegistry } from "../../model-registry"
import { parsePcbMountingTrayModelString } from "./parse-model-string"
import { pcbMountingTrayModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "pcbmountingtray",
  schema: pcbMountingTrayModelDefinitionSchema,
  parse: parsePcbMountingTrayModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
