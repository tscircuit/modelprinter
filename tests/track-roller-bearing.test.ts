import { expect, test } from "bun:test"
import {
  getTrackRollerBearingDimensions,
  modelDefinitionSchema,
  parseModelString,
  trackRollerBearingModelPropsSchema,
} from "../src"

test("trackrollerbearing resolves 15x40x18mm R500 crowned track roller", () => {
  const parsed = parseModelString(
    "trackrollerbearing_bore15mm_od40mm_w18mm_rows2_crownradius500mm_shielded_boremount",
  )
  expect(parsed).toEqual({
    fn: "trackrollerbearing",
    boreDiameter: 15,
    outerDiameter: 40,
    width: 18,
    rows: 2,
    crownRadius: 500,
    closure: "shielded",
    boreMount: true,
  })
  expect(getTrackRollerBearingDimensions().radialSection).toBe(12.5)
})

test("trackrollerbearing supports sealed 50mm roller and roundtrips", () => {
  const parsed = parseModelString("trackrollerbearing_od50mm_sealed")
  expect(parsed.fn).toBe("trackrollerbearing")
  if (parsed.fn !== "trackrollerbearing") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(trackRollerBearingModelPropsSchema.parse({}).crownRadius).toBe(500)
})

test("trackrollerbearing rejects undersized crown radii and legacy selectors", () => {
  expect(() => parseModelString("trackrollerbearing_mount(bore)")).toThrow()
  expect(() =>
    parseModelString("trackrollerbearing_od40mm_crownradius20mm"),
  ).toThrow()
})
