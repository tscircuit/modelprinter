import { expect, test } from "bun:test"
import {
  getVaporChamberDimensions,
  modelDefinitionSchema,
  parseModelString,
  vaporChamberModelPropsSchema,
} from "../src"

test("vaporchamber resolves 50x80x3mm 4-tab thermal vapor chamber", () => {
  const parsed = parseModelString(
    "vaporchamber_w50mm_l80mm_h3mm_corner3mm_tabs4_tabw8mm_hole3mm_hp(60mm,70mm)",
  )
  expect(parsed).toEqual({
    fn: "vaporchamber",
    width: 50,
    length: 80,
    height: 3,
    cornerRadius: 3,
    tabs: 4,
    tabWidth: 8,
    holeDiameter: 3,
    holePitchX: 60,
    holePitchY: 70,
  })
  expect(getVaporChamberDimensions().overallSpanX).toBe(68)
})

test("vaporchamber supports 60x100mm chamber variant and roundtrips", () => {
  const parsed = parseModelString("vaporchamber_w60mm_l100mm_hp(72mm,86mm)")
  expect(parsed.fn).toBe("vaporchamber")
  if (parsed.fn !== "vaporchamber") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(vaporChamberModelPropsSchema.parse({}).tabs).toBe(4)
})

test("vaporchamber rejects inward tab pitches and unsupported selectors", () => {
  expect(() => parseModelString("vaporchamber_mount(tabs)")).toThrow()
  expect(() => parseModelString("vaporchamber_w50mm_hp(44mm,70mm)")).toThrow()
})
