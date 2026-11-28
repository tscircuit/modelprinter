import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseDrawnCupBearingModelString } from "./parse-model-string"
import { drawnCupBearingModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "drawncupbearing",
  schema: drawnCupBearingModelDefinitionSchema,
  parse: parseDrawnCupBearingModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
