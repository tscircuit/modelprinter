import { expect, test } from "bun:test"
import {
  getSexBoltDimensions,
  modelDefinitionSchema,
  parseModelString,
  sexBoltModelPropsSchema,
} from "../src"

test("sexbolt resolves M4x10mm flanged binding barrel and screw", () => {
  const parsed = parseModelString(
    "sexbolt_custom_m4_barrelod6mm_barrell10mm_flangeod10mm_flangeh1.5mm_screwl8mm_slotted_slotw1mm_slotdepth0.8mm",
  )
  expect(parsed).toEqual({
    fn: "sexbolt",
    custom: true,
    thread: "m4",
    barrelOuterDiameter: 6,
    barrelLength: 10,
    flangeOuterDiameter: 10,
    flangeHeight: 1.5,
    screwLength: 8,
    slotted: true,
    slotWidth: 1,
    slotDepth: 0.8,
  })

  const dims = getSexBoltDimensions()
  expect(dims.gripLength).toBe(10)
  expect(dims.assembledOverallHeight).toBe(13)
})

test("sexbolt supports M5x16mm variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "sexbolt_M5_barrelod8mm_barrell16mm_flangeod13mm_screwl12mm",
  )
  expect(parsed.fn).toBe("sexbolt")
  if (parsed.fn !== "sexbolt") return
  expect(parsed.thread).toBe("m5")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(sexBoltModelPropsSchema.parse({}).slotted).toBe(true)
})

test("sexbolt rejects legacy selectors and bottoming-out screws", () => {
  expect(() =>
    parseModelString("sexbolt_spec(custom)_drive(slotted)"),
  ).toThrow()
  expect(() => parseModelString("sexbolt_barrell10mm_screwl12mm")).toThrow()
})
