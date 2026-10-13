import { defineModel, type ModelRegistry } from "../../model-registry"
import { photoelectricSensorModelDefinitionSchema } from "./schema"
import { parsePhotoelectricSensorModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "photoelectricsensor",
  schema: photoelectricSensorModelDefinitionSchema,
  parse: parsePhotoelectricSensorModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
