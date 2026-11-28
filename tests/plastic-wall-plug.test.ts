import { expect, test } from "bun:test"
import {
  getPlasticWallPlugDimensions,
  modelDefinitionSchema,
  parseModelString,
  plasticWallPlugModelPropsSchema,
} from "../src"

test("plasticwallplug resolves 6x30mm 6-rib nylon masonry plug", () => {
  const parsed = parseModelString(
    "plasticwallplug_d6mm_l30mm_bore3mm_slots2_slotl20mm_ribs6_ribh0.5mm_ribp4mm_flangeod8mm_flangeh1mm_unset",
  )
  expect(parsed).toEqual({
    fn: "plasticwallplug",
    outerDiameter: 6,
    length: 30,
    boreDiameter: 3,
    slots: 2,
    slotLength: 20,
    ribs: 6,
    ribHeight: 0.5,
    ribPitch: 4,
    flangeOuterDiameter: 8,
    flangeHeight: 1,
    unset: true,
  })
  expect(getPlasticWallPlugDimensions().ribCrestDiameter).toBe(7)
})

test("plasticwallplug supports 8x40mm wall plug and roundtrips", () => {
  const parsed = parseModelString(
    "plasticwallplug_d8mm_l40mm_bore4.5mm_flangeod11mm",
  )
  expect(parsed.fn).toBe("plasticwallplug")
  if (parsed.fn !== "plasticwallplug") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(plasticWallPlugModelPropsSchema.parse({}).ribs).toBe(6)
})

test("plasticwallplug rejects legacy selectors and overflowing rib arrays", () => {
  expect(() => parseModelString("plasticwallplug_state(unset)")).toThrow()
  expect(() =>
    parseModelString("plasticwallplug_l20mm_ribs6_ribp5mm"),
  ).toThrow()
})
