import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseSelfDrillingScrewModelString } from "./parse-model-string"
import { selfDrillingScrewModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "selfdrillingscrew",
  schema: selfDrillingScrewModelDefinitionSchema,
  parse: parseSelfDrillingScrewModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
