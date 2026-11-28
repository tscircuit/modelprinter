import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseReedCapsuleModelString } from "./parse-model-string"
import { reedCapsuleModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "reedcapsule",
  schema: reedCapsuleModelDefinitionSchema,
  parse: parseReedCapsuleModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
