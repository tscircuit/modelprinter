import { expect, test } from "bun:test"
import {
  getGuardPostClampDimensions,
  guardPostClampModelPropsSchema,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("guardpostclamp resolves 40x40mm square post safety collar", () => {
  const parsed = parseModelString(
    "guardpostclamp_insidew40mm_insided40mm_h35mm_wall5mm_earw15mm_eart8mm_earholes2_hole8.5mm_earpitch60mm",
  )
  expect(parsed).toEqual({
    fn: "guardpostclamp",
    insideWidth: 40,
    insideDepth: 40,
    height: 35,
    wallThickness: 5,
    earWidth: 15,
    earThickness: 8,
    earHoles: 2,
    holeDiameter: 8.5,
    earPitch: 60,
  })
  expect(getGuardPostClampDimensions().overallSpanWidth).toBe(80)
})

test("guardpostclamp supports 60x60mm heavy post collar and roundtrips", () => {
  const parsed = parseModelString(
    "guardpostclamp_insidew60mm_insided60mm_earpitch82mm",
  )
  expect(parsed.fn).toBe("guardpostclamp")
  if (parsed.fn !== "guardpostclamp") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(guardPostClampModelPropsSchema.parse({}).earHoles).toBe(2)
})

test("guardpostclamp rejects colliding ear pitches and parenthesized tokens", () => {
  expect(() => parseModelString("guardpostclamp_post(square)")).toThrow()
  expect(() =>
    parseModelString("guardpostclamp_insidew40mm_wall5mm_earpitch48mm"),
  ).toThrow()
})
