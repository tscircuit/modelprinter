import { expect, test } from "bun:test"
import {
  getRoundFlangeBearingDimensions,
  modelDefinitionSchema,
  parseModelString,
  roundFlangeBearingModelPropsSchema,
} from "../src"

test("roundflangebearing resolves 20mm bore 90mm circular flange unit", () => {
  const parsed = parseModelString(
    "roundflangebearing_bore20mm_od90mm_depth35mm_pcd70mm_face4hole_holed8mm",
  )
  expect(parsed).toEqual({
    fn: "roundflangebearing",
    boreDiameter: 20,
    outerDiameter: 90,
    depth: 35,
    pitchCircleDiameter: 70,
    face4Hole: true,
    holeDiameter: 8,
  })

  const dims = getRoundFlangeBearingDimensions()
  expect(dims.mountingHoleCount).toBe(4)
  expect(dims.topZ).toBe(35)
})

test("roundflangebearing supports 25mm bore 115mm OD unit and roundtrips", () => {
  const parsed = parseModelString(
    "roundflangebearing_bore25mm_od11.5cm_pcd90mm_holed10mm",
  )
  expect(parsed.fn).toBe("roundflangebearing")
  if (parsed.fn !== "roundflangebearing") return
  expect(parsed.outerDiameter).toBeCloseTo(115)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(roundFlangeBearingModelPropsSchema.parse({}).face4Hole).toBe(true)
})

test("roundflangebearing rejects legacy selectors and overflowing bolt circles", () => {
  expect(() =>
    parseModelString("roundflangebearing_mount(face4hole)"),
  ).toThrow()
  expect(() =>
    parseModelString("roundflangebearing_od90mm_pcd85mm_holed8mm"),
  ).toThrow()
})
