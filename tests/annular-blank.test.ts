import { expect, test } from "bun:test"
import {
  annularBlankModelPropsSchema,
  getAnnularBlankDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("annularblank resolves 80x40x10mm sharp-edged ring blank", () => {
  const parsed = parseModelString("annularblank_od80mm_id40mm_t10mm_rimr0mm")
  expect(parsed).toEqual({
    fn: "annularblank",
    outerDiameter: 80,
    innerDiameter: 40,
    thickness: 10,
    rimRadius: 0,
  })
  expect(getAnnularBlankDimensions().radialWall).toBe(20)
})

test("annularblank supports 1mm rim-rounded blank and roundtrips", () => {
  const parsed = parseModelString("annularblank_od100mm_id50mm_rimr1mm")
  expect(parsed.fn).toBe("annularblank")
  if (parsed.fn !== "annularblank") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(annularBlankModelPropsSchema.parse({}).innerDiameter).toBe(40)
})

test("annularblank rejects inverted diameters and parenthesized tokens", () => {
  expect(() => parseModelString("annularblank_grade(6061)")).toThrow()
  expect(() => parseModelString("annularblank_od80mm_id78mm")).toThrow()
})
