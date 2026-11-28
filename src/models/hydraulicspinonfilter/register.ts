import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseHydraulicSpinOnFilterModelString } from "./parse-model-string"
import { hydraulicSpinOnFilterModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "hydraulicspinonfilter",
  schema: hydraulicSpinOnFilterModelDefinitionSchema,
  parse: parseHydraulicSpinOnFilterModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
