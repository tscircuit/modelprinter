import { expect, test } from "bun:test"
import {
  getNeedleRollerBearingDimensions,
  modelDefinitionSchema,
  needleRollerBearingModelPropsSchema,
  parseModelString,
} from "../src"

test("needlerollerbearing resolves 20x28x20mm NA4902 open needle bearing", () => {
  const parsed = parseModelString(
    "needlerollerbearing_id20mm_od28mm_w20mm_rows1_innerring1_open",
  )
  expect(parsed).toEqual({
    fn: "needlerollerbearing",
    innerDiameter: 20,
    outerDiameter: 28,
    width: 20,
    rows: 1,
    innerRing: 1,
    closure: "open",
  })
  expect(getNeedleRollerBearingDimensions().radialSection).toBe(4)
})

test("needlerollerbearing supports NK ringless sealed variant and roundtrips", () => {
  const parsed = parseModelString("needlerollerbearing_innerring0_sealed")
  expect(parsed.fn).toBe("needlerollerbearing")
  if (parsed.fn !== "needlerollerbearing") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(needleRollerBearingModelPropsSchema.parse({}).innerRing).toBe(1)
})

test("needlerollerbearing rejects inverted diameters and legacy selectors", () => {
  expect(() => parseModelString("needlerollerbearing_closure(open)")).toThrow()
  expect(() => parseModelString("needlerollerbearing_id27mm_od28mm")).toThrow()
})
