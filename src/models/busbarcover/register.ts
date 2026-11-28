import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseBusbarCoverModelString } from "./parse-model-string"
import { busbarCoverModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "busbarcover",
  schema: busbarCoverModelDefinitionSchema,
  parse: parseBusbarCoverModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
