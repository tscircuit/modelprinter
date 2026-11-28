import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseCableSheaveModelString } from "./parse-model-string"
import { cableSheaveModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "cablesheave",
  schema: cableSheaveModelDefinitionSchema,
  parse: parseCableSheaveModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
