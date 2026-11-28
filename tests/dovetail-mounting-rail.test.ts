import { expect, test } from "bun:test"
import {
  dovetailMountingRailModelPropsSchema,
  getDovetailMountingRailDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("dovetailmountingrail resolves canonical roadmap contract parameters", () => {
  const parsed = parseModelString(
    "dovetailmountingrail_basew60mm_baset8mm_l200mm_headw40mm_neckw26.144mm_dovetailh12mm_angle60deg_holes3_hole8.5mm_pitch75mm_end25mm_counterbore14mm_counterdepth5mm",
  )
  expect(parsed).toEqual({
    fn: "dovetailmountingrail",
    baseWidth: 60,
    baseThickness: 8,
    length: 200,
    headWidth: 40,
    neckWidth: 26.144,
    dovetailHeight: 12,
    dovetailAngle: 60,
    holes: 3,
    holeDiameter: 8.5,
    holePitch: 75,
    endMargin: 25,
    counterboreDiameter: 14,
    counterboreDepth: 5,
  })
  expect(getDovetailMountingRailDimensions().totalHeight).toBeCloseTo(20, 6)
})

test("dovetailmountingrail supports dimensional overrides and roundtrips through modelDefinitionSchema", () => {
  const parsed = parseModelString(
    "dovetailmountingrail_l275mm_holes4_pitch75mm_end25mm",
  )
  expect(parsed.fn).toBe("dovetailmountingrail")
  if (parsed.fn !== "dovetailmountingrail") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(dovetailMountingRailModelPropsSchema.parse({})).toBeDefined()
})

test("dovetailmountingrail rejects parenthesized selectors and invalid geometry", () => {
  expect(() => parseModelString("dovetailmountingrail_spec(legacy)")).toThrow()
  expect(() =>
    parseModelString("dovetailmountingrail_headw40mm_neckw42mm"),
  ).toThrow()
})
