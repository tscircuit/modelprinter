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
test("hollowshaft accepts full decimal units and case-insensitive strings", () => {
  expect(mp.string(source.toUpperCase()).json()).toEqual({
    fn: "hollowshaft",
    ...props,
  })
  expect(
    hollowShaftModelPropsSchema.parse({ ...props, outerDiameter: "2.0cm" }),
  ).toEqual(props)
  expect(
    hollowShaftModelPropsSchema.parse({ ...props, outerDiameter: "+20mm" }),
  ).toEqual(props)
})
