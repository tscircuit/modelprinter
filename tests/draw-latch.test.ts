import { expect, test } from "bun:test"
import {
  drawLatchModelPropsSchema,
  getDrawLatchDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("drawlatch resolves closed over-center lever, keeper and mounting hole grid", () => {
  const parsed = parseModelString(
    "drawlatch_w20mm_l60mm_h15mm_t2mm_loopwire2mm_catchw18mm_hole4mm_hp(12mm,35mm)_overcenter",
  )
  expect(parsed).toEqual({
    fn: "drawlatch",
    width: 20,
    length: 60,
    height: 15,
    sheetThickness: 2,
    loopWireDiameter: 2,
    catchWidth: 18,
    holeDiameter: 4,
    holePitchX: 12,
    holePitchY: 35,
    overCenter: true,
  })

  const dims = getDrawLatchDimensions()
  expect(dims.leftHoleX).toBe(-6)
  expect(dims.rightHoleX).toBe(6)
  expect(dims.bottomZ).toBe(0)
  expect(dims.topZ).toBe(15)
})

test("drawlatch supports split hpx/hpy tokens and schema roundtrip", () => {
  const parsed = parseModelString("drawlatch_w25mm_l7cm_hpx15mm_hpy45mm")
  expect(parsed.fn).toBe("drawlatch")
  if (parsed.fn !== "drawlatch") return
  expect(parsed.length).toBeCloseTo(70)
  expect(parsed.holePitchX).toBe(15)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(drawLatchModelPropsSchema.parse({}).overCenter).toBe(true)
})

test("drawlatch rejects legacy type selectors, wide catches and out-of-bounds holes", () => {
  expect(() =>
    parseModelString("drawlatch_w20mm_l60mm_hp(12mm,35mm)_type(overcenter)"),
  ).toThrow()
  expect(() => parseModelString("drawlatch_w20mm_catchw22mm")).toThrow()
  expect(() =>
    parseModelString("drawlatch_w20mm_hole4mm_hp(18mm,35mm)"),
  ).toThrow()
})
