import { defineModel, type ModelRegistry } from "../../model-registry"
import { conveyorRollerModelDefinitionSchema } from "./schema"
import { parseConveyorRollerModelParams } from "./parse-model-string"
export const model = defineModel({
  name: "conveyorroller",
  schema: conveyorRollerModelDefinitionSchema,
  parse: parseConveyorRollerModelParams,
})
export function register(registry: ModelRegistry): void {
  registry.register(model)
}
