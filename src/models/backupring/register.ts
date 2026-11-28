import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseBackupRingModelString } from "./parse-model-string"
import { backupRingModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "backupring",
  schema: backupRingModelDefinitionSchema,
  parse: parseBackupRingModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
