import { defineModel, type ModelRegistry } from "../../model-registry"
import { vBeltSheaveModelDefinitionSchema } from "./schema"
import { parseVBeltSheaveModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "vbeltsheave",
  schema: vBeltSheaveModelDefinitionSchema,
  parse: parseVBeltSheaveModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
