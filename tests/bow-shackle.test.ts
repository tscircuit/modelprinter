import { expect, test } from "bun:test"
import {
  bowShackleModelPropsSchema,
  getBowShackleDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("bowshackle resolves canonical roadmap contract parameters", () => {
  const parsed = parseModelString(
    "bowshackle_innerw40mm_innerh60mm_stock12mm_bowr30mm_pin12mm_eyet15mm_pinm12",
  )
  expect(parsed).toEqual({
    fn: "bowshackle",
    innerWidth: 40,
    innerHeight: 60,
    stockDiameter: 12,
    bowRadius: 30,
    pinDiameter: 12,
    eyeThickness: 15,
    pinThreadDiameter: 12,
  })
  expect(getBowShackleDimensions().outerPinSpan).toBeCloseTo(70, 6)
})

test("bowshackle supports dimensional overrides and roundtrips through modelDefinitionSchema", () => {
  const parsed = parseModelString(
    "bowshackle_innerw50mm_innerh80mm_stock16mm_bowr38mm_pin16mm_pinm16",
  )
  expect(parsed.fn).toBe("bowshackle")
  if (parsed.fn !== "bowshackle") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(bowShackleModelPropsSchema.parse({})).toBeDefined()
})

test("bowshackle rejects parenthesized selectors and invalid geometry", () => {
  expect(() => parseModelString("bowshackle_spec(legacy)")).toThrow()
  expect(() => parseModelString("bowshackle_innerw50mm_bowr20mm")).toThrow()
})
