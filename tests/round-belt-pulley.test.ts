import { expect, test } from "bun:test"
import {
  getRoundBeltPulleyDimensions,
  modelDefinitionSchema,
  parseModelString,
  roundBeltPulleyModelPropsSchema,
} from "../src"

test("roundbeltpulley resolves 50x12mm R3mm semicircular-groove pulley", () => {
  const parsed = parseModelString(
    "roundbeltpulley_od50mm_bore8mm_w12mm_groover3mm_semicirculargroove_setscrew_m4",
  )
  expect(parsed).toEqual({
    fn: "roundbeltpulley",
    outerDiameter: 50,
    boreDiameter: 8,
    width: 12,
    grooveRadius: 3,
    semicircularGroove: true,
    setScrew: true,
    setScrewThread: "m4",
  })
  expect(getRoundBeltPulleyDimensions().grooveRootDiameter).toBe(44)
})

test("roundbeltpulley supports 75mm M5 variant and schema roundtrip", () => {
  const parsed = parseModelString("roundbeltpulley_od75mm_bore12mm_M5")
  expect(parsed.fn).toBe("roundbeltpulley")
  if (parsed.fn !== "roundbeltpulley") return
  expect(parsed.setScrewThread).toBe("m5")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(roundBeltPulleyModelPropsSchema.parse({}).semicircularGroove).toBe(
    true,
  )
})

test("roundbeltpulley rejects legacy selectors and oversized grooves", () => {
  expect(() =>
    parseModelString("roundbeltpulley_profile(semicirculargroove)"),
  ).toThrow()
  expect(() => parseModelString("roundbeltpulley_w12mm_groover6mm")).toThrow()
})
