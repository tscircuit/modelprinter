import { expect, test } from "bun:test"
import {
  footCupModelPropsSchema,
  getFootCupDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("footcup resolves 30x40x10mm 2-tab floor receptacle cup", () => {
  const parsed = parseModelString(
    "footcup_id30mm_od40mm_h10mm_floort3mm_mounts2_hole3mm_hp50mm",
  )
  expect(parsed).toEqual({
    fn: "footcup",
    innerDiameter: 30,
    outerDiameter: 40,
    height: 10,
    floorThickness: 3,
    mounts: 2,
    holeDiameter: 3,
    holePitch: 50,
  })
  expect(getFootCupDimensions().pocketDepth).toBe(7)
})

test("footcup supports 50mm seat cup variant and schema roundtrip", () => {
  const parsed = parseModelString("footcup_id50mm_od62mm_hp76mm")
  expect(parsed.fn).toBe("footcup")
  if (parsed.fn !== "footcup") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(footCupModelPropsSchema.parse({}).mounts).toBe(2)
})

test("footcup rejects colliding tab holes and parenthesized tokens", () => {
  expect(() => parseModelString("footcup_shape(round)")).toThrow()
  expect(() => parseModelString("footcup_od40mm_hp41mm_hole3mm")).toThrow()
})
