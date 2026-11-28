import { expect, test } from "bun:test"
import {
  fanMountFrameModelPropsSchema,
  getFanMountFrameDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("fanmountframe resolves 60x60x15mm 40mm-aperture fan adapter frame", () => {
  const parsed = parseModelString(
    "fanmountframe_w60mm_h60mm_d15mm_wall3mm_opening40mm_bossh5mm_fanhole3.5mm_hp(32mm,32mm)_ears2_mounthole4mm_earhp70mm_earw10mm_earl10mm",
  )
  expect(parsed).toEqual({
    fn: "fanmountframe",
    width: 60,
    height: 60,
    depth: 15,
    wallThickness: 3,
    openingDiameter: 40,
    bossHeight: 5,
    fanHoleDiameter: 3.5,
    holePitchX: 32,
    holePitchY: 32,
    ears: 2,
    mountHoleDiameter: 4,
    earHolePitch: 70,
    earWidth: 10,
    earLength: 10,
  })

  const dims = getFanMountFrameDimensions()
  expect(dims.overallWidthWithEars).toBe(80)
  expect(dims.topZ).toBe(15)
})

test("fanmountframe supports 80mm shroud variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "fanmountframe_w80mm_h80mm_opening60mm_hp(50mm,50mm)_earhp92mm_earl12mm",
  )
  expect(parsed.fn).toBe("fanmountframe")
  if (parsed.fn !== "fanmountframe") return
  expect(parsed.width).toBe(80)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(fanMountFrameModelPropsSchema.parse({}).ears).toBe(2)
})

test("fanmountframe rejects oversized apertures and unsupported selectors", () => {
  expect(() => parseModelString("fanmountframe_mount(ears)")).toThrow()
  expect(() =>
    parseModelString("fanmountframe_w60mm_wall3mm_opening56mm"),
  ).toThrow()
})
