import { expect, test } from "bun:test"
import {
  getMagneticBaseDimensions,
  magneticBaseModelPropsSchema,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("magneticbase resolves canonical roadmap contract parameters", () => {
  const parsed = parseModelString(
    "magneticbase_basel50mm_basew50mm_baseh60mm_arml150mm_armd10mm_jointd20mm_clampbore8mm",
  )
  expect(parsed).toEqual({
    fn: "magneticbase",
    baseLength: 50,
    baseWidth: 50,
    baseHeight: 60,
    armLength: 150,
    armDiameter: 10,
    jointDiameter: 20,
    clampBoreDiameter: 8,
  })
  expect(getMagneticBaseDimensions().verticalStandHeight).toBeCloseTo(210, 6)
})

test("magneticbase supports dimensional overrides and roundtrips through modelDefinitionSchema", () => {
  const parsed = parseModelString(
    "magneticbase_basel60mm_basew55mm_arml180mm_jointd24mm",
  )
  expect(parsed.fn).toBe("magneticbase")
  if (parsed.fn !== "magneticbase") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(magneticBaseModelPropsSchema.parse({})).toBeDefined()
})

test("magneticbase rejects parenthesized selectors and invalid geometry", () => {
  expect(() => parseModelString("magneticbase_spec(legacy)")).toThrow()
  expect(() => parseModelString("magneticbase_armd22mm_jointd20mm")).toThrow()
})
