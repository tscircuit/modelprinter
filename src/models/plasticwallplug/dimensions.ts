import {
  type PlasticWallPlugModelPropsInput,
  plasticWallPlugModelPropsSchema,
} from "./schema"

export function getPlasticWallPlugDimensions(
  input: PlasticWallPlugModelPropsInput = {},
) {
  const p = plasticWallPlugModelPropsSchema.parse(input)
  return {
    ...p,
    ribCrestDiameter: p.outerDiameter + 2 * p.ribHeight,
    tipZ: -p.length,
    collarFaceZ: 0,
  }
}
