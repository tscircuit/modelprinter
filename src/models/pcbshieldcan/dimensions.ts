import {
  type ShieldCanModelPropsInput,
  shieldCanModelPropsSchema,
} from "./schema"

export function getShieldCanDimensions(input: ShieldCanModelPropsInput = {}) {
  const p = shieldCanModelPropsSchema.parse(input)
  return {
    ...p,
    cavityWidth: p.width - 2 * p.wallThickness,
    cavityDepth: p.depth - 2 * p.wallThickness,
    seatingZ: 0,
    topZ: p.height,
  }
}
