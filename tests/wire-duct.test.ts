import { expect, test } from "bun:test"
import {
  getWireDuctDimensions,
  modelDefinitionSchema,
  parseModelString,
  wireDuctModelPropsSchema,
} from "../src"

test("wireduct resolves canonical roadmap contract parameters", () => {
  const parsed = parseModelString(
    "wireduct_iw40mm_ih40mm_l150mm_t2mm_slots12_slotw6mm_p10mm_sloth28mm_holes2_hole4mm_hp100mm",
  )
  expect(parsed).toEqual({
    fn: "wireduct",
    innerWidth: 40,
    innerHeight: 40,
    length: 150,
    wallThickness: 2,
    slots: 12,
    slotWidth: 6,
    slotPitch: 10,
    slotHeight: 28,
    holes: 2,
    holeDiameter: 4,
    holePitch: 100,
  })
  expect(getWireDuctDimensions().outerWidth).toBeCloseTo(44, 6)
})

test("wireduct supports dimensional overrides and roundtrips through modelDefinitionSchema", () => {
  const parsed = parseModelString(
    "wireduct_iw60mm_ih60mm_l200mm_slots16_sloth42mm",
  )
  expect(parsed.fn).toBe("wireduct")
  if (parsed.fn !== "wireduct") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(wireDuctModelPropsSchema.parse({})).toBeDefined()
})

test("wireduct rejects parenthesized selectors and invalid geometry", () => {
  expect(() => parseModelString("wireduct_spec(legacy)")).toThrow()
  expect(() => parseModelString("wireduct_slotw10mm_p10mm")).toThrow()
})
