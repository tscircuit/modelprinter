import { expect, test } from "bun:test"
import {
  circularBlankModelPropsSchema,
  getCircularBlankDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("circularblank resolves 80x10mm sharp-edged disc blank", () => {
  const parsed = parseModelString("circularblank_d80mm_t10mm_rimr0mm")
  expect(parsed).toEqual({
    fn: "circularblank",
    diameter: 80,
    thickness: 10,
    rimRadius: 0,
  })
  expect(getCircularBlankDimensions().flatFaceDiameter).toBe(80)
})

test("circularblank supports 1.5mm rim-rounded blank and roundtrips", () => {
  const parsed = parseModelString("circularblank_d100mm_t12mm_rimr1.5mm")
  expect(parsed.fn).toBe("circularblank")
  if (parsed.fn !== "circularblank") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(circularBlankModelPropsSchema.parse({}).rimRadius).toBe(0)
})

test("circularblank rejects excessive rim radii and parenthesized tokens", () => {
  expect(() => parseModelString("circularblank_material(steel)")).toThrow()
  expect(() => parseModelString("circularblank_t10mm_rimr6mm")).toThrow()
})
