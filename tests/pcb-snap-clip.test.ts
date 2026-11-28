import { expect, test } from "bun:test"
import {
  getSnapClipDimensions,
  modelDefinitionSchema,
  parseModelString,
  snapClipModelPropsSchema,
} from "../src"

test("pcbsnapclip resolves standoff seat, board capture window and split-arrow latch", () => {
  const parsed = parseModelString(
    "pcbsnapclip_h10mm_base8mm_stem3mm_board1.6mm_barb4mm_splitarrow_screwfoot_screw3mm",
  )
  expect(parsed).toEqual({
    fn: "pcbsnapclip",
    standoffHeight: 10,
    baseOuterDiameter: 8,
    stemDiameter: 3,
    boardThickness: 1.6,
    barbOuterDiameter: 4,
    splitArrow: true,
    screwFoot: true,
    screwDiameter: 3,
  })

  const dims = getSnapClipDimensions()
  expect(dims.boardSeatZ).toBe(10)
  expect(dims.boardTopZ).toBeCloseTo(11.6)
  expect(dims.barbRetentionShoulder).toBeCloseTo(0.5)
  expect(dims.topZ).toBeGreaterThan(14)
})

test("pcbsnapclip normalizes units, defaults and schema roundtrips", () => {
  const parsed = parseModelString("pcbsnapclip_h1.2cm_board2mm")
  expect(parsed.fn).toBe("pcbsnapclip")
  if (parsed.fn !== "pcbsnapclip") return
  expect(parsed.standoffHeight).toBeCloseTo(12)
  expect(parsed.boardThickness).toBeCloseTo(2)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(snapClipModelPropsSchema.parse({}).splitArrow).toBe(true)
})

test("pcbsnapclip rejects legacy selectors, undersized barbs and oversized screw bores", () => {
  expect(() =>
    parseModelString(
      "pcbsnapclip_h10mm_base8mm_stem3mm_board1.6mm_barb4mm_latch(splitarrow)_foot(screw3mm)",
    ),
  ).toThrow()
  expect(() => parseModelString("pcbsnapclip_stem4mm_barb3.5mm")).toThrow()
  expect(() => parseModelString("pcbsnapclip_base8mm_screw7mm")).toThrow()
})
