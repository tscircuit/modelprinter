import {
  type PanelMeterCaseModelPropsInput,
  panelMeterCaseModelPropsSchema,
} from "./schema"

export function getPanelMeterCaseDimensions(
  input: PanelMeterCaseModelPropsInput = {},
) {
  const p = panelMeterCaseModelPropsSchema.parse(input)
  const rearInsertionDepth = p.depth - p.bezelThickness
  const bezelOverhangX = (p.width - p.cutoutWidth) / 2
  const bezelOverhangY = (p.height - p.cutoutHeight) / 2
  return {
    ...p,
    rearInsertionDepth,
    bezelOverhangX,
    bezelOverhangY,
    bottomZ: -rearInsertionDepth,
    topZ: p.bezelThickness,
  }
}
