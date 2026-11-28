import { expect, test } from "bun:test"
import {
  getSubmersiblePumpDimensions,
  modelDefinitionSchema,
  parseModelString,
  submersiblePumpModelPropsSchema,
} from "../src"

test("submersiblepump resolves canonical roadmap contract parameters", () => {
  const parsed = parseModelString(
    "submersiblepump_bodyod90mm_h180mm_outletod25mm_baseod110mm_holes3_boltcirc90mm_holed5mm_topbarb_basefeet",
  )
  expect(parsed).toEqual({
    fn: "submersiblepump",
    bodyOuterDiameter: 90,
    height: 180,
    outletOuterDiameter: 25,
    baseOuterDiameter: 110,
    holes: 3,
    boltCircleDiameter: 90,
    holeDiameter: 5,
    topBarb: true,
    baseFeet: true,
  })
  expect(getSubmersiblePumpDimensions().baseFlangeRadialOverhang).toBeCloseTo(
    10,
    6,
  )
})

test("submersiblepump supports dimensional overrides and roundtrips through modelDefinitionSchema", () => {
  const parsed = parseModelString(
    "submersiblepump_bodyod100mm_h210mm_baseod130mm_boltcirc110mm",
  )
  expect(parsed.fn).toBe("submersiblepump")
  if (parsed.fn !== "submersiblepump") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(submersiblePumpModelPropsSchema.parse({})).toBeDefined()
})

test("submersiblepump rejects parenthesized selectors and invalid geometry", () => {
  expect(() => parseModelString("submersiblepump_spec(legacy)")).toThrow()
  expect(() =>
    parseModelString("submersiblepump_bodyod115mm_baseod110mm"),
  ).toThrow()
})
