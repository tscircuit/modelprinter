import { type VBeltModelPropsInput, vBeltModelPropsSchema } from "./schema"

export function getVBeltDimensions(input: VBeltModelPropsInput = {}) {
  const p = vBeltModelPropsSchema.parse(input)
  const bottomWidth =
    p.topWidth - 2 * p.height * Math.tan((p.sideAngle * Math.PI) / 360)
  const outerLoopDiameter = p.length / Math.PI
  const innerLoopDiameter = outerLoopDiameter - 2 * p.height
  return {
    ...p,
    bottomWidth,
    outerLoopDiameter,
    innerLoopDiameter,
    bottomZ: 0,
    topZ: p.topWidth,
  }
}
