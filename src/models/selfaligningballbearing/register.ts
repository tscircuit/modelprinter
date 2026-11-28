import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseSelfAligningBallBearingModelString } from "./parse-model-string"
import { selfAligningBallBearingModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "selfaligningballbearing",
  schema: selfAligningBallBearingModelDefinitionSchema,
  parse: parseSelfAligningBallBearingModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
