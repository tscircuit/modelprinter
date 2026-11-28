import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseTSlotCornerCubeModelString } from "./parse-model-string"
import { tSlotCornerCubeModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "tslotcornercube",
  schema: tSlotCornerCubeModelDefinitionSchema,
  parse: parseTSlotCornerCubeModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
