import { expect, test } from "bun:test"
import {
  mp,
  modelDefinitionSchema,
  hollowShaftModelPropsSchema,
  getHollowShaftDimensions,
} from "../src"
const source = "hollowshaft_od20mm_id12mm_l200mm_style(roundtube)_endchamfer1mm"
const props = {
  outerDiameter: 20,
  innerDiameter: 12,
  length: 200,
  endChamfer: 1,
  roundTube: true,
} as const
test("hollowshaft rejects missing, duplicate, unknown and partially parsed tokens", () => {
  for (const suffix of [
    "",
    "typo1mm",
    "constructor1",
    "od1mm",
    "outerdiameter1mm",
    "od(1mm)",
    "od1mmjunk",
  ])
    expect(() => mp.string(`${source}_${suffix}`).json()).toThrow()
  expect(() => mp.string("hollowshaft").json()).toThrow()
  for (const value of [0, -1, Infinity, NaN, 1e308, "1e2", "2mmjunk", "(2mm)"])
    expect(() =>
      hollowShaftModelPropsSchema.parse({ ...props, outerDiameter: value }),
    ).toThrow()
  expect(() =>
    hollowShaftModelPropsSchema.parse({ ...props, unknown: true }),
  ).toThrow()
})
