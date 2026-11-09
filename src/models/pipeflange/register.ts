import { defineModel, type ModelRegistry } from "../../model-registry"
import { parsePipeFlangeModelParams } from "./parse-model-string"
import { pipeFlangeModelDefinitionSchema } from "./schema"
export const model = defineModel({
  name: "pipeflange",
  schema: pipeFlangeModelDefinitionSchema,
  parse: parsePipeFlangeModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
