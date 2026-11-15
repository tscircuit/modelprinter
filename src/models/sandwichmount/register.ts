import { defineModel, type ModelRegistry } from "../../model-registry"
import { sandwichMountModelDefinitionSchema } from "./schema"
import { parseSandwichMountModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "sandwichmount",
  schema: sandwichMountModelDefinitionSchema,
  parse: parseSandwichMountModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
