import { defineModel, type ModelRegistry } from "../../model-registry"
import { parsePlanetaryGearmotorModelString } from "./parse-model-string"
import { planetaryGearmotorModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "planetarygearmotor",
  schema: planetaryGearmotorModelDefinitionSchema,
  parse: parsePlanetaryGearmotorModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
