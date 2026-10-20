import { defineModel, type ModelRegistry } from "../../model-registry"
import { cylinderMountModelDefinitionSchema } from "./schema"
import { parseCylinderMountModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "cylindermount",
  schema: cylinderMountModelDefinitionSchema,
  parse: parseCylinderMountModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
