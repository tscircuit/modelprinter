import { expect, test } from "bun:test"
import {
  fanFilterModelPropsSchema,
  getFanFilterDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("fanfilter resolves 60x60x8mm square fan filter cassette", () => {
  const parsed = parseModelString(
    "fanfilter_w60mm_h60mm_d8mm_framet2mm_media(46mm,46mm,3mm)_grillep6mm_hole4mm_hp(50mm,50mm)",
  )
  expect(parsed).toEqual({
    fn: "fanfilter",
    width: 60,
    height: 60,
    depth: 8,
    frameThickness: 2,
    mediaWidth: 46,
    mediaHeight: 46,
    mediaThickness: 3,
    grillePitch: 6,
    holeDiameter: 4,
    holePitchX: 50,
    holePitchY: 50,
  })

  const dims = getFanFilterDimensions()
  expect(dims.innerOpeningWidth).toBe(56)
  expect(dims.topZ).toBe(8)
})

test("fanfilter supports 80x80mm cassette variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "fanfilter_w80mm_h80mm_media(68mm,68mm,4mm)_hp(71.5mm,71.5mm)",
  )
  expect(parsed.fn).toBe("fanfilter")
  if (parsed.fn !== "fanfilter") return
  expect(parsed.width).toBe(80)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(fanFilterModelPropsSchema.parse({}).grillePitch).toBe(6)
})

test("fanfilter rejects oversized media pads and unsupported selectors", () => {
  expect(() => parseModelString("fanfilter_style(louvre)")).toThrow()
  expect(() =>
    parseModelString("fanfilter_w60mm_h60mm_framet2mm_media(58mm,58mm,3mm)"),
  ).toThrow()
})
