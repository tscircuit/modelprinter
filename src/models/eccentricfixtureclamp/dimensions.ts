import {
  type EccentricFixtureClampModelPropsInput,
  eccentricFixtureClampModelPropsSchema,
} from "./schema"

export function getEccentricFixtureClampDimensions(
  input: EccentricFixtureClampModelPropsInput = {},
) {
  const p = eccentricFixtureClampModelPropsSchema.parse(input)
  const clampingThrow = 2 * p.offset
  return {
    ...p,
    clampingThrow,
    bottomZ: 0,
    topZ: p.height,
  }
}
