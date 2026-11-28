import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseRackStepBeamModelString } from "./parse-model-string"
import { rackStepBeamModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "rackstepbeam",
  schema: rackStepBeamModelDefinitionSchema,
  parse: parseRackStepBeamModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
