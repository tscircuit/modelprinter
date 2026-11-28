import {
  type VentPanelModelPropsInput,
  ventPanelModelPropsSchema,
} from "./schema"

export function getVentPanelDimensions(input: VentPanelModelPropsInput = {}) {
  const p = ventPanelModelPropsSchema.parse(input)
  const louverArraySpanY = (p.louvers - 1) * p.louverPitch
  const overallProjection = p.thickness + p.louverDepth
  return {
    ...p,
    louverArraySpanY,
    overallProjection,
    bottomZ: 0,
    topZ: overallProjection,
  }
}
