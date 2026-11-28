import { expect, test } from "bun:test"
import {
  camLatchModelPropsSchema,
  getCamLatchDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("camlatch resolves M18 quarter-turn barrel latch and rear cam reach", () => {
  const parsed = parseModelString(
    "camlatch_cutout18mm_m18_threadpitch1mm_barrell25mm_headod22mm_cam(30mm,10mm,3mm)_slotdrive_turn90deg",
  )
  expect(parsed).toEqual({
    fn: "camlatch",
    cutoutDiameter: 18,
    thread: "m18",
    threadPitch: 1,
    barrelLength: 25,
    headOuterDiameter: 22,
    camLength: 30,
    camWidth: 10,
    camThickness: 3,
    slotDrive: true,
    turnAngle: 90,
  })

  const dims = getCamLatchDimensions()
  expect(dims.headFlangeRadialOverhang).toBeCloseTo(2)
  expect(dims.camRadialProjection).toBeCloseTo(25)
  expect(dims.rearZ).toBe(-28)
  expect(dims.frontZ).toBe(3)
})

test("camlatch supports split cam tokens, M22 variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "camlatch_cutout22.5mm_M22_headod28mm_caml35mm_camw12mm_camt3mm_slotted",
  )
  expect(parsed.fn).toBe("camlatch")
  if (parsed.fn !== "camlatch") return
  expect(parsed.thread).toBe("m22")
  expect(parsed.camLength).toBe(35)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(camLatchModelPropsSchema.parse({}).turnAngle).toBe(90)
})

test("camlatch rejects legacy drive selectors, mismatched threads and undersized cams", () => {
  expect(() =>
    parseModelString(
      "camlatch_cutout18mm_m18_cam(30mm,10mm,3mm)_drive(slot)_turn90deg",
    ),
  ).toThrow()
  expect(() => parseModelString("camlatch_cutout18mm_m12_headod22mm")).toThrow()
  expect(() =>
    parseModelString("camlatch_cutout18mm_m18_headod22mm_caml8mm"),
  ).toThrow()
})
