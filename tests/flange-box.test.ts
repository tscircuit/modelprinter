import { expect, test } from "bun:test"
import {
  flangeBoxModelPropsSchema,
  getFlangeBoxDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("flangebox resolves 120x80x45 flanged enclosure and overall span", () => {
  const parsed = parseModelString(
    "flangebox_w120mm_d80mm_h45mm_wall2mm_flange12mm_flanget3mm_holes4_hole4mm_hp(136mm,56mm)_screwonlid_screws4",
  )
  expect(parsed).toEqual({
    fn: "flangebox",
    width: 120,
    depth: 80,
    height: 45,
    wallThickness: 2,
    flangeProjection: 12,
    flangeThickness: 3,
    flangeHoles: 4,
    flangeHoleDiameter: 4,
    holePitchX: 136,
    holePitchY: 56,
    screwOnLid: true,
    lidScrews: 4,
  })

  const dims = getFlangeBoxDimensions()
  expect(dims.overallWidth).toBe(144)
  expect(dims.innerWidth).toBe(116)
  expect(dims.innerDepth).toBe(76)
  expect(dims.topZ).toBe(45)
})

test("flangebox supports screwon alias, unit conversions and schema roundtrip", () => {
  const parsed = parseModelString(
    "flangebox_w10cm_d7cm_flange15mm_hpx118mm_hpy50mm_screwon",
  )
  expect(parsed.fn).toBe("flangebox")
  if (parsed.fn !== "flangebox") return
  expect(parsed.width).toBeCloseTo(100)
  expect(parsed.holePitchX).toBe(118)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(flangeBoxModelPropsSchema.parse({}).lidScrews).toBe(4)
})

test("flangebox rejects legacy lid selectors and off-flange hole pitches", () => {
  expect(() =>
    parseModelString("flangebox_w120mm_d80mm_h45mm_lid(screwon)_screws4"),
  ).toThrow()
  expect(() =>
    parseModelString("flangebox_w120mm_flange12mm_hole4mm_hp(110mm,56mm)"),
  ).toThrow()
  expect(() =>
    parseModelString("flangebox_w120mm_flange12mm_hole4mm_hp(142mm,56mm)"),
  ).toThrow()
})
