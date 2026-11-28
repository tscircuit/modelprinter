import { expect, test } from "bun:test"
import {
  getHangerBoltDimensions,
  hangerBoltModelPropsSchema,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("hangerbolt resolves M6x50mm dual-thread hanger bolt", () => {
  const parsed = parseModelString(
    "hangerbolt_custom_m6_l50mm_machinethreadl25mm_woodd6mm_woodthreadpitch2.6mm_woodthreadl25mm_centerflats_flats2_af5mm_flatl4mm_conetip",
  )
  expect(parsed).toEqual({
    fn: "hangerbolt",
    custom: true,
    thread: "m6",
    length: 50,
    machineThreadLength: 25,
    woodDiameter: 6,
    woodThreadPitch: 2.6,
    woodThreadLength: 25,
    centerFlats: true,
    flats: 2,
    acrossFlats: 5,
    flatLength: 4,
    coneTip: true,
  })

  const dims = getHangerBoltDimensions()
  expect(dims.machineMajorDiameter).toBe(6)
  expect(dims.bottomZ).toBe(-25)
  expect(dims.topZ).toBe(25)
})

test("hangerbolt supports M8x60mm variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "hangerbolt_M8_l6cm_machinethreadl25mm_woodd8mm_woodthreadl30mm_af6.5mm",
  )
  expect(parsed.fn).toBe("hangerbolt")
  if (parsed.fn !== "hangerbolt") return
  expect(parsed.thread).toBe("m8")
  expect(parsed.length).toBeCloseTo(60)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(hangerBoltModelPropsSchema.parse({}).centerFlats).toBe(true)
})

test("hangerbolt rejects legacy selectors and oversized center flats", () => {
  expect(() =>
    parseModelString("hangerbolt_spec(custom)_drive(centerflats)_tip(cone)"),
  ).toThrow()
  expect(() => parseModelString("hangerbolt_m6_af7mm")).toThrow()
})
