import { expect, test } from "bun:test"
import {
  getPanelMeterCaseDimensions,
  modelDefinitionSchema,
  panelMeterCaseModelPropsSchema,
  parseModelString,
} from "../src"

test("panelmetercase resolves 96x48mm 1/8-DIN instrument shell", () => {
  const parsed = parseModelString(
    "panelmetercase_w96mm_h48mm_d60mm_wall2mm_bezel3mm_cutout(92mm,45mm)_sidespring2clips_frontwindow",
  )
  expect(parsed).toEqual({
    fn: "panelmetercase",
    width: 96,
    height: 48,
    depth: 60,
    wallThickness: 2,
    bezelThickness: 3,
    cutoutWidth: 92,
    cutoutHeight: 45,
    sideSpring2Clips: true,
    frontWindow: true,
  })

  const dims = getPanelMeterCaseDimensions()
  expect(dims.rearInsertionDepth).toBe(57)
  expect(dims.bezelOverhangX).toBe(2)
  expect(dims.bezelOverhangY).toBeCloseTo(1.5)
})

test("panelmetercase supports 48x48mm 1/16-DIN meter and roundtrips", () => {
  const parsed = parseModelString(
    "panelmetercase_w48mm_h48mm_cutout(45mm,45mm)",
  )
  expect(parsed.fn).toBe("panelmetercase")
  if (parsed.fn !== "panelmetercase") return
  expect(parsed.cutoutWidth).toBe(45)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(panelMeterCaseModelPropsSchema.parse({}).frontWindow).toBe(true)
})

test("panelmetercase rejects legacy selectors and cutouts wider than bezel", () => {
  expect(() =>
    parseModelString("panelmetercase_clips(sidespring2)_front(window)"),
  ).toThrow()
  expect(() =>
    parseModelString("panelmetercase_w96mm_cutout(98mm,45mm)"),
  ).toThrow()
})
