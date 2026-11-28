import { expect, test } from "bun:test"
import {
  fanGuardModelPropsSchema,
  getFanGuardDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("fanguard resolves 40mm 3-ring 4-spoke wire finger guard", () => {
  const parsed = parseModelString(
    "fanguard_od40mm_wire1mm_rings3_ringod(16mm,28mm,40mm)_spokes4_tabs4_hole3.5mm_hp(32mm,32mm)",
  )
  expect(parsed).toEqual({
    fn: "fanguard",
    outerDiameter: 40,
    wireDiameter: 1,
    rings: 3,
    ringOuterDiameters: [16, 28, 40],
    spokes: 4,
    tabs: 4,
    holeDiameter: 3.5,
    holePitchX: 32,
    holePitchY: 32,
  })

  const dims = getFanGuardDimensions()
  expect(dims.overallThickness).toBe(2)
  expect(dims.tabOuterSpanX).toBe(37.5)
})

test("fanguard supports 60mm 4-ring variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "fanguard_od60mm_rings4_ringod(18mm,32mm,46mm,60mm)_hp(50mm,50mm)",
  )
  expect(parsed.fn).toBe("fanguard")
  if (parsed.fn !== "fanguard") return
  expect(parsed.rings).toBe(4)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(fanGuardModelPropsSchema.parse({}).tabs).toBe(4)
})

test("fanguard rejects non-ascending ring lists and unsupported selectors", () => {
  expect(() => parseModelString("fanguard_style(wire)")).toThrow()
  expect(() =>
    parseModelString("fanguard_od40mm_rings3_ringod(28mm,16mm,40mm)"),
  ).toThrow()
})
