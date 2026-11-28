import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseBoltOnLiftingLugModelString } from "./parse-model-string"
import { boltOnLiftingLugModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "boltonliftinglug",
  schema: boltOnLiftingLugModelDefinitionSchema,
  parse: parseBoltOnLiftingLugModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
