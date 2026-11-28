import { expect, test } from "bun:test"
import {
  getSupportedShaftDimensions,
  modelDefinitionSchema,
  parseModelString,
  supportedShaftModelPropsSchema,
} from "../src"

test("supportedshaft resolves canonical roadmap contract parameters", () => {
  const parsed = parseModelString(
    "supportedshaft_d16mm_l300mm_basew40mm_baseh20mm_holepitch50mm_holed6mm_shaftcenterh28mm_baseholes",
  )
  expect(parsed).toEqual({
    fn: "supportedshaft",
    shaftDiameter: 16,
    length: 300,
    baseWidth: 40,
    baseHeight: 20,
    holePitch: 50,
    holeDiameter: 6,
    shaftCenterHeight: 28,
    baseHoles: true,
  })
  expect(getSupportedShaftDimensions().overallCrownHeight).toBeCloseTo(36, 6)
})

test("supportedshaft supports dimensional overrides and roundtrips through modelDefinitionSchema", () => {
  const parsed = parseModelString(
    "supportedshaft_d20mm_l400mm_basew45mm_shaftcenterh32mm",
  )
  expect(parsed.fn).toBe("supportedshaft")
  if (parsed.fn !== "supportedshaft") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(supportedShaftModelPropsSchema.parse({})).toBeDefined()
})

test("supportedshaft rejects parenthesized selectors and invalid geometry", () => {
  expect(() => parseModelString("supportedshaft_spec(legacy)")).toThrow()
  expect(() =>
    parseModelString("supportedshaft_d20mm_baseh20mm_shaftcenterh15mm"),
  ).toThrow()
})
