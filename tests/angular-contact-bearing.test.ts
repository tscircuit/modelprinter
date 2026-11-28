import { expect, test } from "bun:test"
import {
  angularContactBearingModelPropsSchema,
  getAngularContactBearingDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("angularcontactbearing resolves 15x35x11mm 40-deg bearing", () => {
  const parsed = parseModelString(
    "angularcontactbearing_id15mm_od35mm_w11mm_contactangle40deg_rows1_open",
  )
  expect(parsed).toEqual({
    fn: "angularcontactbearing",
    innerDiameter: 15,
    outerDiameter: 35,
    width: 11,
    contactAngle: 40,
    rows: 1,
    open: true,
  })

  const dims = getAngularContactBearingDimensions()
  expect(dims.pitchDiameter).toBe(25)
  expect(dims.loadCenterOffset).toBeCloseTo(
    12.5 * Math.tan((40 * Math.PI) / 180),
  )
})

test("angularcontactbearing supports 25-deg precision spindle bearing and roundtrips", () => {
  const parsed = parseModelString(
    "angularcontactbearing_id20mm_od47mm_w14mm_contactangle25deg",
  )
  expect(parsed.fn).toBe("angularcontactbearing")
  if (parsed.fn !== "angularcontactbearing") return
  expect(parsed.contactAngle).toBe(25)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(angularContactBearingModelPropsSchema.parse({}).open).toBe(true)
})

test("angularcontactbearing rejects legacy closure selectors and out-of-range contact angles", () => {
  expect(() =>
    parseModelString("angularcontactbearing_closure(open)"),
  ).toThrow()
  expect(() =>
    parseModelString("angularcontactbearing_contactangle5deg"),
  ).toThrow()
})
