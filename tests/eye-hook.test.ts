import { expect, test } from "bun:test"
import {
  eyeHookModelPropsSchema,
  getEyeHookDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("eyehook resolves 100x65mm rigging eye hook", () => {
  const parsed = parseModelString(
    "eyehook_h100mm_w65mm_body16mm_throat25mm_bendr20mm_eyeid20mm_eyeod40mm_nolatch",
  )
  expect(parsed).toEqual({
    fn: "eyehook",
    height: 100,
    width: 65,
    bodyDiameter: 16,
    throatOpening: 25,
    bendRadius: 20,
    eyeInnerDiameter: 20,
    eyeOuterDiameter: 40,
    noLatch: true,
  })
  expect(getEyeHookDimensions().eyeRingWall).toBe(10)
})

test("eyehook supports larger 140mm hook and schema roundtrip", () => {
  const parsed = parseModelString("eyehook_h140mm_w85mm_eyeid28mm_eyeod54mm")
  expect(parsed.fn).toBe("eyehook")
  if (parsed.fn !== "eyehook") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(eyeHookModelPropsSchema.parse({}).noLatch).toBe(true)
})

test("eyehook rejects legacy selectors and overflowing throats", () => {
  expect(() => parseModelString("eyehook_latch(none)")).toThrow()
  expect(() => parseModelString("eyehook_w50mm_body20mm_throat35mm")).toThrow()
})
