import {
  type FlangeFullFaceGasketModelPropsInput,
  flangeFullFaceGasketModelPropsSchema,
} from "./schema"

export function getFlangeFullFaceGasketDimensions(
  input: FlangeFullFaceGasketModelPropsInput = {},
) {
  const p = flangeFullFaceGasketModelPropsSchema.parse(input)
  const innerSealingLandWidth =
    (p.boltCircleDiameter - p.holeDiameter - p.innerDiameter) / 2
  return {
    ...p,
    innerSealingLandWidth,
    bottomZ: 0,
    topZ: p.thickness,
  }
}
