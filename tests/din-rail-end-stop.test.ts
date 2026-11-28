import { expect, test } from "bun:test"
import {
  dinRailEndStopModelPropsSchema,
  getDinRailEndStopDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("dinrailendstop resolves 10x35x30mm M4 TH35x7.5 screw end stop", () => {
  const parsed = parseModelString(
    "dinrailendstop_th35x7.5_w10mm_d35mm_h30mm_m4_jawgap35mm_screwclamp",
  )
  expect(parsed).toEqual({
    fn: "dinrailendstop",
    th35x75: true,
    width: 10,
    depth: 35,
    height: 30,
    clampThread: "m4",
    jawGap: 35,
    screwClamp: true,
  })
  expect(getDinRailEndStopDimensions().clampScrewMajorDiameter).toBe(4)
})

test("dinrailendstop supports wider 12mm M5 variant and roundtrips", () => {
  const parsed = parseModelString("dinrailendstop_w12mm_d45mm_M5")
  expect(parsed.fn).toBe("dinrailendstop")
  if (parsed.fn !== "dinrailendstop") return
  expect(parsed.clampThread).toBe("m5")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(dinRailEndStopModelPropsSchema.parse({}).screwClamp).toBe(true)
})

test("dinrailendstop rejects legacy selectors and undersized depths", () => {
  expect(() =>
    parseModelString("dinrailendstop_rail(TH35x7.5)_type(screwclamp)"),
  ).toThrow()
  expect(() => parseModelString("dinrailendstop_d25mm")).toThrow()
})
