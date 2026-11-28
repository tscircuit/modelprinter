import { expect, test } from "bun:test"
import {
  getLAnchorBoltDimensions,
  lAnchorBoltModelPropsSchema,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("lanchorbolt resolves M10x150mm 40mm-leg L foundation bolt", () => {
  const parsed = parseModelString(
    "lanchorbolt_m10_l150mm_leg40mm_bendr10mm_threadl40mm_bend90deg",
  )
  expect(parsed).toEqual({
    fn: "lanchorbolt",
    threadDiameter: 10,
    length: 150,
    legLength: 40,
    bendRadius: 10,
    threadLength: 40,
    bendAngle: 90,
  })
  expect(getLAnchorBoltDimensions().straightVerticalShank).toBe(100)
})

test("lanchorbolt supports M16x250mm heavy foundation bolt and roundtrips", () => {
  const parsed = parseModelString("lanchorbolt_m16_l250mm_leg65mm_bendr16mm")
  expect(parsed.fn).toBe("lanchorbolt")
  if (parsed.fn !== "lanchorbolt") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(lAnchorBoltModelPropsSchema.parse({}).bendAngle).toBe(90)
})

test("lanchorbolt rejects legacy selectors and kinked bend radii", () => {
  expect(() => parseModelString("lanchorbolt_bend(90deg)")).toThrow()
  expect(() => parseModelString("lanchorbolt_m16_bendr4mm")).toThrow()
})
