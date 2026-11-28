import { expect, test } from "bun:test"
import {
  getRockerSwitchDimensions,
  modelDefinitionSchema,
  parseModelString,
  rockerSwitchModelPropsSchema,
} from "../src"

test("rockerswitch resolves 21x15mm 3-contact snap-in rocker switch", () => {
  const parsed = parseModelString(
    "rockerswitch_cutout(21mm,15mm)_bodyd25mm_flange2mm_curvedrocker_clips2_contacts3_tabs(4.8mm,0.8mm)",
  )
  expect(parsed).toEqual({
    fn: "rockerswitch",
    cutoutLength: 21,
    cutoutWidth: 15,
    bodyDepth: 25,
    flangeBorder: 2,
    curvedRocker: true,
    clips: 2,
    contacts: 3,
    tabWidth: 4.8,
    tabThickness: 0.8,
  })

  const dims = getRockerSwitchDimensions()
  expect(dims.bezelLength).toBe(25)
  expect(dims.bezelWidth).toBe(19)
  expect(dims.bottomZ).toBe(-25)
})

test("rockerswitch supports 2-contact 6.3mm tab variant and roundtrips", () => {
  const parsed = parseModelString(
    "rockerswitch_cutout(28mm,12mm)_contacts2_tabs(6.3mm,0.8mm)",
  )
  expect(parsed.fn).toBe("rockerswitch")
  if (parsed.fn !== "rockerswitch") return
  expect(parsed.contacts).toBe(2)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(rockerSwitchModelPropsSchema.parse({}).curvedRocker).toBe(true)
})

test("rockerswitch rejects legacy actuator selectors and oversized blades", () => {
  expect(() =>
    parseModelString("rockerswitch_actuator(curvedrocker)"),
  ).toThrow()
  expect(() =>
    parseModelString("rockerswitch_cutout(21mm,10mm)_tabs(9mm,0.8mm)"),
  ).toThrow()
})
