import { expect, test } from "bun:test"
import {
  getRollerCatchDimensions,
  modelDefinitionSchema,
  parseModelString,
  rollerCatchModelPropsSchema,
} from "../src"

test("rollercatch resolves canonical roadmap contract parameters", () => {
  const parsed = parseModelString(
    "rollercatch_w25mm_d15mm_h20mm_roller6mm_gap3mm_strikew8mm_hole3mm_hp18mm",
  )
  expect(parsed).toEqual({
    fn: "rollercatch",
    width: 25,
    depth: 15,
    height: 20,
    rollerDiameter: 6,
    rollerGap: 3,
    strikeWidth: 8,
    holeDiameter: 3,
    holePitch: 18,
  })
  expect(getRollerCatchDimensions().strikeInterference).toBeCloseTo(5, 6)
})

test("rollercatch supports dimensional overrides and roundtrips through modelDefinitionSchema", () => {
  const parsed = parseModelString(
    "rollercatch_w32mm_hp24mm_roller7mm_gap4mm_strikew9mm",
  )
  expect(parsed.fn).toBe("rollercatch")
  if (parsed.fn !== "rollercatch") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(rollerCatchModelPropsSchema.parse({})).toBeDefined()
})

test("rollercatch rejects parenthesized selectors and invalid geometry", () => {
  expect(() => parseModelString("rollercatch_spec(legacy)")).toThrow()
  expect(() => parseModelString("rollercatch_gap9mm_strikew8mm")).toThrow()
})
