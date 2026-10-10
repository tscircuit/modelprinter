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
test("hollowshaft complete roadmap contract and public schema roundtrip", () => {
  const expected = { fn: "hollowshaft" as const, ...props }
  expect(mp.string(source).json()).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  expect(hollowShaftModelPropsSchema.parse(props)).toEqual(props)
  expect(
    getHollowShaftDimensions(props).size.every(
      (value) => value > 0 && Number.isFinite(value),
    ),
  ).toBe(true)
})
