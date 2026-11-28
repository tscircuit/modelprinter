import { type IBeamModelPropsInput, iBeamModelPropsSchema } from "./schema"

export function getIBeamDimensions(input: IBeamModelPropsInput = {}) {
  const p = iBeamModelPropsSchema.parse(input)
  return {
    ...p,
    straightWebHeight: p.height - 2 * p.flangeThickness - 2 * p.rootRadius,
    startZ: 0,
    endZ: p.length,
  }
}
