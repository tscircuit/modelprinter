import { expect, test } from "bun:test"
import {
  getRackStepBeamDimensions,
  modelDefinitionSchema,
  parseModelString,
  rackStepBeamModelPropsSchema,
} from "../src"

test("rackstepbeam resolves 1200x100x50mm stepped pallet-rack beam", () => {
  const parsed = parseModelString(
    "rackstepbeam_l1200mm_h100mm_w50mm_wall2.5mm_stepw20mm_stepd20mm_r3mm_endholes2_hole9mm_pitch50mm",
  )
  expect(parsed).toEqual({
    fn: "rackstepbeam",
    length: 1200,
    height: 100,
    width: 50,
    wallThickness: 2.5,
    stepWidth: 20,
    stepDepth: 20,
    cornerRadius: 3,
    endHoles: 2,
    holeDiameter: 9,
    holePitch: 50,
  })
  expect(getRackStepBeamDimensions().topChordWidth).toBe(30)
})

test("rackstepbeam supports 2400mm heavy rack beam and roundtrips", () => {
  const parsed = parseModelString("rackstepbeam_l2400mm_h120mm")
  expect(parsed.fn).toBe("rackstepbeam")
  if (parsed.fn !== "rackstepbeam") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(rackStepBeamModelPropsSchema.parse({}).stepWidth).toBe(20)
})

test("rackstepbeam rejects oversized step recesses and parenthesized tokens", () => {
  expect(() => parseModelString("rackstepbeam_end(teardrop)")).toThrow()
  expect(() => parseModelString("rackstepbeam_w50mm_stepw45mm")).toThrow()
})
