import { expect, test } from "bun:test"
import {
  getIdlerPulleyDimensions,
  idlerPulleyModelDefinitionSchema,
  idlerPulleyModelPropsSchema,
  modelDefinitionSchema,
  modelprinter,
  mp,
} from "../src"

test("idlerpulley resolves smooth flanged roller and bearing bore defaults", () => {
  const parsed = mp
    .string(
      "idlerpulley_od30mm_bore8mm_w12mm_smoothflanged_flangeod34mm_bearingbore8mm",
    )
    .json()
  if (parsed.fn !== "idlerpulley") throw new Error("Unexpected model")
  expect(parsed).toEqual({
    fn: "idlerpulley",
    outerDiameter: 30,
    boreDiameter: 8,
    width: 12,
    smoothFlanged: true,
    flangeDiameter: 34,
    bearingBoreDiameter: 8,
  })
  expect(mp.string("idlerpulley").json()).toEqual(parsed)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(idlerPulleyModelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(modelprinter.getModelNames()).toContain("idlerpulley")

  const dims = getIdlerPulleyDimensions()
  expect(dims.flangeThickness).toBe(1.5)
  expect(dims.beltTrackWidth).toBe(9)
  expect(dims.flangeRadialHeight).toBe(2)
  expect(dims.rimWallThickness).toBe(11)
  expect(dims.bottomZ).toBe(0)
  expect(dims.topZ).toBe(12)
  expect(dims.size).toEqual([34, 34, 12])
})

test("idlerpulley normalizes units, aliases and schema roundtrips", () => {
  const custom = mp
    .string(
      "IDLERPULLEY_OUTERDIAMETER4CM_BOREDIAMETER10MM_WIDTH1.6CM_SMOOTHFLANGED_FLANGEDIAMETER4.6CM_BEARINGBOREDIAMETER22MM",
    )
    .json()
  if (custom.fn !== "idlerpulley") throw new Error("Unexpected model")
  expect(custom).toEqual({
    fn: "idlerpulley",
    outerDiameter: 40,
    boreDiameter: 10,
    width: 16,
    smoothFlanged: true,
    flangeDiameter: 46,
    bearingBoreDiameter: 22,
  })
  const { fn, ...props } = custom
  expect(idlerPulleyModelPropsSchema.parse(props)).toEqual(props)
})

test("idlerpulley rejects legacy style selectors, duplicates and invalid diameter ordering", () => {
  for (const badStr of [
    "idlerpulley30",
    "idlerpulley_style(smoothflanged)",
    "idlerpulley_smoothflanged(true)",
    "idlerpulley_smoothflanged_smoothflanged",
    "idlerpulley_od30mm_outerdiameter30mm",
    "idlerpulley_od30mm_flangeod30mm",
    "idlerpulley_bore10mm_bearingbore8mm",
    "idlerpulley_od30mm_bearingbore30mm",
    "idlerpulley_unknown1",
  ]) {
    expect(() => mp.string(badStr).json()).toThrow()
  }

  for (const badProps of [
    { outerDiameter: 30, flangeDiameter: 30 },
    { boreDiameter: 10, bearingBoreDiameter: 8 },
    { outerDiameter: 30, bearingBoreDiameter: 30 },
    { smoothFlanged: false },
    { style: "smoothflanged" },
  ]) {
    expect(idlerPulleyModelPropsSchema.safeParse(badProps).success).toBe(false)
  }
})
