import { expect, test } from "bun:test"
import {
  compoundGearModelPropsSchema,
  getCompoundGearDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("compoundgear resolves 16T/40T M1.0 stepped compound spur gear", () => {
  const parsed = parseModelString(
    "compoundgear_teetha16_teethb40_module1mm_w16mm_bore8mm_pa20deg_keyway_keyw3mm",
  )
  expect(parsed).toEqual({
    fn: "compoundgear",
    teethA: 16,
    teethB: 40,
    module: 1,
    width: 16,
    boreDiameter: 8,
    pressureAngleDeg: 20,
    keyway: true,
    keyWidth: 3,
  })
  expect(getCompoundGearDimensions().pitchDiameterB).toBe(40)
})

test("compoundgear supports M1.5 18T/36T variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "compoundgear_teetha18_teethb36_module1.5mm_bore10mm",
  )
  expect(parsed.fn).toBe("compoundgear")
  if (parsed.fn !== "compoundgear") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(compoundGearModelPropsSchema.parse({}).keyway).toBe(true)
})

test("compoundgear rejects legacy selectors and equal stage teeth", () => {
  expect(() => parseModelString("compoundgear_mount(keyway)")).toThrow()
  expect(() => parseModelString("compoundgear_teetha20_teethb20")).toThrow()
})
