import { expect, test } from "bun:test"
import {
  cartridgeBearingModelPropsSchema,
  getCartridgeBearingDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("cartridgebearing resolves 25x62x45mm flanged bearing cartridge", () => {
  const parsed = parseModelString(
    "cartridgebearing_bore25mm_od62mm_l45mm_cylindricalfit_locatingflangeod75mm_flangeh5mm",
  )
  expect(parsed).toEqual({
    fn: "cartridgebearing",
    boreDiameter: 25,
    outerDiameter: 62,
    length: 45,
    cylindricalFit: true,
    locatingFlangeOuterDiameter: 75,
    flangeHeight: 5,
  })
  expect(getCartridgeBearingDimensions().pilotCylinderLength).toBe(40)
})

test("cartridgebearing supports 30mm bore variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "cartridgebearing_bore30mm_od72mm_locatingflangeod85mm",
  )
  expect(parsed.fn).toBe("cartridgebearing")
  if (parsed.fn !== "cartridgebearing") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(cartridgeBearingModelPropsSchema.parse({}).cylindricalFit).toBe(true)
})

test("cartridgebearing rejects legacy selectors and undersized flanges", () => {
  expect(() =>
    parseModelString("cartridgebearing_mount(cylindricalfit)"),
  ).toThrow()
  expect(() =>
    parseModelString("cartridgebearing_od62mm_locatingflangeod62mm"),
  ).toThrow()
})
