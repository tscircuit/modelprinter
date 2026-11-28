import {
  type PanelClipModelPropsInput,
  panelClipModelPropsSchema,
} from "./schema"

export function getPanelClipDimensions(input: PanelClipModelPropsInput = {}) {
  const p = panelClipModelPropsSchema.parse(input)
  return {
    ...p,
    barbTipSpan: p.panelGap + 2 * p.stripThickness + 2 * p.barbHeight,
    noseZ: -p.length,
    openEndZ: 0,
  }
}
