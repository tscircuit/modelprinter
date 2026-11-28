import { defineModel, type ModelRegistry } from "../../model-registry"
import { parsePipeBlindFlangeModelString } from "./parse-model-string"
import { pipeBlindFlangeModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "pipeblindflange",
  schema: pipeBlindFlangeModelDefinitionSchema,
  parse: parsePipeBlindFlangeModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
