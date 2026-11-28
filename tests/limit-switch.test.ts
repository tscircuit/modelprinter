import { expect, test } from "bun:test"
import {
  getLimitSwitchDimensions,
  limitSwitchModelPropsSchema,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("limitswitch resolves canonical roadmap contract parameters", () => {
  const parsed = parseModelString(
    "limitswitch_w30mm_h65mm_d25mm_leverl40mm_rollerod12mm_pivot6mm_holes2_hole4mm_hp50mm_entryd16mm_entrypitch1.5mm",
  )
  expect(parsed).toEqual({
    fn: "limitswitch",
    width: 30,
    height: 65,
    depth: 25,
    leverLength: 40,
    rollerOuterDiameter: 12,
    pivotDiameter: 6,
    holes: 2,
    holeDiameter: 4,
    holePitch: 50,
    entryDiameter: 16,
    entryPitch: 1.5,
  })
  expect(getLimitSwitchDimensions().totalActuatorReach).toBeCloseTo(46, 6)
})

test("limitswitch supports dimensional overrides and roundtrips through modelDefinitionSchema", () => {
  const parsed = parseModelString("limitswitch_w40mm_h80mm_hp60mm_leverl50mm")
  expect(parsed.fn).toBe("limitswitch")
  if (parsed.fn !== "limitswitch") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(limitSwitchModelPropsSchema.parse({})).toBeDefined()
})

test("limitswitch rejects parenthesized selectors and invalid geometry", () => {
  expect(() => parseModelString("limitswitch_spec(legacy)")).toThrow()
  expect(() => parseModelString("limitswitch_h65mm_hp63mm_hole4mm")).toThrow()
})
