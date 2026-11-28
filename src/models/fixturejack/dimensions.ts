import {
  type FixtureJackModelPropsInput,
  fixtureJackModelPropsSchema,
} from "./schema"

export function getFixtureJackDimensions(
  input: FixtureJackModelPropsInput = {},
) {
  const p = fixtureJackModelPropsSchema.parse(input)
  return {
    ...p,
    extendedHeight: p.height + p.travel,
    baseZ: 0,
    retractedTopZ: p.height,
  }
}
