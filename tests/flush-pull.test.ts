import { expect, test } from "bun:test"
import {
  flushPullModelPropsSchema,
  getFlushPullDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("flushpull resolves 80x35x15mm 2-hole inset finger pull", () => {
  const parsed = parseModelString(
    "flushpull_w80mm_h35mm_d15mm_wall2mm_flange4mm_corner3mm_holes2_hole3mm_hp72mm",
  )
  expect(parsed).toEqual({
    fn: "flushpull",
    width: 80,
    height: 35,
    depth: 15,
    wallThickness: 2,
    flangeWidth: 4,
    cornerRadius: 3,
    holes: 2,
    holeDiameter: 3,
    holePitch: 72,
  })
  expect(getFlushPullDimensions().cutoutWidth).toBe(72)
})

test("flushpull supports 110x50mm cabinet pull and roundtrips", () => {
  const parsed = parseModelString("flushpull_w110mm_h50mm_hp98mm")
  expect(parsed.fn).toBe("flushpull")
  if (parsed.fn !== "flushpull") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(flushPullModelPropsSchema.parse({}).holes).toBe(2)
})

test("flushpull rejects overflowing hole pitches and parenthesized tokens", () => {
  expect(() => parseModelString("flushpull_mount(screw)")).toThrow()
  expect(() => parseModelString("flushpull_w80mm_hp79mm")).toThrow()
})
