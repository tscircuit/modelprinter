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
test("hollowshaft value-free flags reject repeated and conflicting selectors", () => {
  expect(
    mp
      .string("hollowshaft_od20mm_id12mm_l200mm_endchamfer1mm_roundtube")
      .json(),
  ).toEqual({ fn: "hollowshaft", ...props })
  expect(() =>
    mp
      .string(
        "hollowshaft_od20mm_id12mm_l200mm_endchamfer1mm_roundtube_roundtube",
      )
      .json(),
  ).toThrow()
  expect(() =>
    mp
      .string("hollowshaft_od20mm_id12mm_l200mm_endchamfer1mm_roundtube(true)")
      .json(),
  ).toThrow()
  expect(() => mp.string(`${source}_roundtube`).json()).toThrow()
})
