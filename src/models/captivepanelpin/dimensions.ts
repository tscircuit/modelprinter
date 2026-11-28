import {
  type CaptivePanelPinModelPropsInput,
  captivePanelPinModelPropsSchema,
} from "./schema"

export function getCaptivePanelPinDimensions(
  input: CaptivePanelPinModelPropsInput = {},
) {
  const p = captivePanelPinModelPropsSchema.parse(input)
  return {
    ...p,
    overallLength: p.length + p.knobHeight,
    tipZ: -p.length,
    knobTopZ: p.knobHeight,
  }
}
