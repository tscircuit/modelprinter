import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseBallTransferUnitModelParams } from "./parse-model-string"
import { ballTransferUnitModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "balltransferunit",
  schema: ballTransferUnitModelDefinitionSchema,
  parse: parseBallTransferUnitModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
