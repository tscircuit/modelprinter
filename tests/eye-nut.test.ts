import { expect, test } from "bun:test"
import {
  eyeNutModelPropsSchema,
  getEyeNutDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("eyenut resolves M8 20mm-bore lifting eye nut", () => {
  const parsed = parseModelString(
    "eyenut_custom_m8_eyeid20mm_eyewire6mm_baseod18mm_baseh10mm_threaddepth10mm_closedeye_axialplane",
  )
  expect(parsed).toEqual({
    fn: "eyenut",
    custom: true,
    thread: "m8",
    eyeInnerDiameter: 20,
    eyeWireDiameter: 6,
    baseOuterDiameter: 18,
    baseHeight: 10,
    threadDepth: 10,
    closedEye: true,
    axialPlane: true,
  })
  expect(getEyeNutDimensions().eyeOuterDiameter).toBe(32)
})

test("eyenut supports M10 variant and schema roundtrip", () => {
  const parsed = parseModelString("eyenut_M10_eyeid25mm_baseod24mm")
  expect(parsed.fn).toBe("eyenut")
  if (parsed.fn !== "eyenut") return
  expect(parsed.thread).toBe("m10")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(eyeNutModelPropsSchema.parse({}).closedEye).toBe(true)
})

test("eyenut rejects legacy selectors and threadDepth > baseHeight", () => {
  expect(() => parseModelString("eyenut_eye(closed)_plane(axial)")).toThrow()
  expect(() => parseModelString("eyenut_baseh8mm_threaddepth10mm")).toThrow()
})
