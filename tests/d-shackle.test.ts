import { expect, test } from "bun:test"
import {
  dShackleModelPropsSchema,
  getDShackleDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("dshackle resolves canonical roadmap contract parameters", () => {
  const parsed = parseModelString(
    "dshackle_innerw25mm_innerh50mm_stock12mm_crownr12.5mm_pin12mm_eyet15mm_pinm12",
  )
  expect(parsed).toEqual({
    fn: "dshackle",
    innerWidth: 25,
    innerHeight: 50,
    stockDiameter: 12,
    crownRadius: 12.5,
    pinDiameter: 12,
    eyeThickness: 15,
    pinThreadDiameter: 12,
  })
  expect(getDShackleDimensions().straightLegLength).toBeCloseTo(37.5, 6)
})

test("dshackle supports dimensional overrides and roundtrips through modelDefinitionSchema", () => {
  const parsed = parseModelString(
    "dshackle_innerw32mm_innerh64mm_crownr16mm_stock16mm_pin16mm_pinm16",
  )
  expect(parsed.fn).toBe("dshackle")
  if (parsed.fn !== "dshackle") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(dShackleModelPropsSchema.parse({})).toBeDefined()
})

test("dshackle rejects parenthesized selectors and invalid geometry", () => {
  expect(() => parseModelString("dshackle_spec(legacy)")).toThrow()
  expect(() => parseModelString("dshackle_innerw25mm_crownr20mm")).toThrow()
})
