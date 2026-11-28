import { expect, test } from "bun:test"
import {
  getSkateWheelDimensions,
  modelDefinitionSchema,
  parseModelString,
  skateWheelModelPropsSchema,
} from "../src"

test("skatewheel resolves 50x15mm 608-bearing roller wheel", () => {
  const parsed = parseModelString(
    "skatewheel_od50mm_w15mm_bore8mm_bearingbore_bearingseat22mm",
  )
  expect(parsed).toEqual({
    fn: "skatewheel",
    outerDiameter: 50,
    width: 15,
    boreDiameter: 8,
    bearingBore: true,
    bearingSeatDiameter: 22,
  })
  expect(getSkateWheelDimensions().treadRadialThickness).toBe(14)
})

test("skatewheel supports 72x24mm inline wheel and schema roundtrip", () => {
  const parsed = parseModelString("skatewheel_od72mm_w24mm")
  expect(parsed.fn).toBe("skatewheel")
  if (parsed.fn !== "skatewheel") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(skateWheelModelPropsSchema.parse({}).bearingBore).toBe(true)
})

test("skatewheel rejects legacy selectors and oversized bearing seats", () => {
  expect(() => parseModelString("skatewheel_mount(bearingbore)")).toThrow()
  expect(() => parseModelString("skatewheel_od50mm_bearingseat48mm")).toThrow()
})
