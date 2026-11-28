import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseRockerSwitchModelString } from "./parse-model-string"
import { rockerSwitchModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "rockerswitch",
  schema: rockerSwitchModelDefinitionSchema,
  parse: parseRockerSwitchModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
