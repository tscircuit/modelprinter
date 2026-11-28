import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseThreadRollingScrewModelString } from "./parse-model-string"
import { threadRollingScrewModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "threadrollingscrew",
  schema: threadRollingScrewModelDefinitionSchema,
  parse: parseThreadRollingScrewModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
