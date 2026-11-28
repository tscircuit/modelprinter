import {
  type CableConduitModelPropsInput,
  cableConduitModelPropsSchema,
} from "./schema"

export function getCableConduitDimensions(
  input: CableConduitModelPropsInput = {},
) {
  const p = cableConduitModelPropsSchema.parse(input)
  const corrugationCount = Math.floor(p.length / p.pitch)
  const wallThickness = (p.outerDiameter - p.innerDiameter) / 2 - p.ribDepth
  return {
    ...p,
    corrugationCount,
    wallThickness,
    bottomZ: 0,
    topZ: p.length,
  }
}
