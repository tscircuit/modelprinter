import { expect, test } from "bun:test"
import {
  frlAssemblyModelPropsSchema,
  getFrlAssemblyDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("frlassembly resolves canonical roadmap contract parameters", () => {
  const parsed = parseModelString(
    "frlassembly_npt0.25in_w140mm_h160mm_d40mm_bowlod35mm_holes2_holep100mm_holed5mm_backrail",
  )
  expect(parsed).toEqual({
    fn: "frlassembly",
    portNominal: 6.35,
    width: 140,
    height: 160,
    depth: 40,
    bowlOuterDiameter: 35,
    holes: 2,
    holePitch: 100,
    holeDiameter: 5,
    backRail: true,
  })
  expect(getFrlAssemblyDimensions().moduleNominalPitch).toBeCloseTo(
    46.666666666666664,
    6,
  )
})

test("frlassembly supports dimensional overrides and roundtrips through modelDefinitionSchema", () => {
  const parsed = parseModelString(
    "frlassembly_w165mm_h180mm_d50mm_bowlod42mm_holep120mm",
  )
  expect(parsed.fn).toBe("frlassembly")
  if (parsed.fn !== "frlassembly") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(frlAssemblyModelPropsSchema.parse({})).toBeDefined()
})

test("frlassembly rejects parenthesized selectors and invalid geometry", () => {
  expect(() => parseModelString("frlassembly_spec(legacy)")).toThrow()
  expect(() => parseModelString("frlassembly_w140mm_bowlod50mm")).toThrow()
})
