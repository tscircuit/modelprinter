import { defineModel, type ModelRegistry } from "../../model-registry"
import { parseUsbConnectorModelString } from "./parse-model-string"
import { usbConnectorModelDefinitionSchema } from "./schema"

export const model = defineModel({
  name: "usbconnector",
  schema: usbConnectorModelDefinitionSchema,
  parse: parseUsbConnectorModelString,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
