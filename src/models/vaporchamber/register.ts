import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseVaporChamberModelString } from "./parse-model-string"
import { vaporChamberModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "vaporchamber",
  schema: vaporChamberModelDefinitionSchema,
  parse: parseVaporChamberModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
