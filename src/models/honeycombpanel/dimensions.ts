import {
  type HoneycombPanelModelPropsInput,
  honeycombPanelModelPropsSchema,
} from "./schema"

export function getHoneycombPanelDimensions(
  input: HoneycombPanelModelPropsInput = {},
) {
  const p = honeycombPanelModelPropsSchema.parse(input)
  const coreHeight = p.thickness - 2 * p.skinThickness
  const hexCircumdiameter = (2 * p.hexAcrossFlats) / Math.sqrt(3)
  return {
    ...p,
    coreHeight,
    hexCircumdiameter,
    bottomZ: 0,
    topZ: p.thickness,
  }
}
