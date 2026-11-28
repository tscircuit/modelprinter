import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseOldhamDiskModelString } from "./parse-model-string"
import { oldhamDiskModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "oldhamdisk",
  schema: oldhamDiskModelDefinitionSchema,
  parse: parseOldhamDiskModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
