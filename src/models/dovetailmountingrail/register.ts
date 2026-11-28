import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseDovetailMountingRailModelString } from "./parse-model-string"
import { dovetailMountingRailModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "dovetailmountingrail",
  schema: dovetailMountingRailModelDefinitionSchema,
  parse: parseDovetailMountingRailModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
