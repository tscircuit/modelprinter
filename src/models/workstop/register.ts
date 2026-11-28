import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseWorkStopModelString } from "./parse-model-string"
import { workStopModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "workstop",
  schema: workStopModelDefinitionSchema,
  parse: parseWorkStopModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
