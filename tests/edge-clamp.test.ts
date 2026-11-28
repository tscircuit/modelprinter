import { expect, test } from "bun:test"
import {
  edgeClampModelPropsSchema,
  getEdgeClampDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("edgeclamp resolves canonical roadmap contract parameters", () => {
  const parsed = parseModelString(
    "edgeclamp_l50mm_w30mm_h20mm_travel5mm_jaww25mm_jawh12mm_holes2_hole6.6mm_pitch30mm_drivem6",
  )
  expect(parsed).toEqual({
    fn: "edgeclamp",
    length: 50,
    width: 30,
    height: 20,
    jawTravel: 5,
    jawWidth: 25,
    jawHeight: 12,
    holes: 2,
    holeDiameter: 6.6,
    holePitch: 30,
    driveThreadDiameter: 6,
  })
  expect(getEdgeClampDimensions().extendedLength).toBeCloseTo(55, 6)
})

test("edgeclamp supports dimensional overrides and roundtrips through modelDefinitionSchema", () => {
  const parsed = parseModelString(
    "edgeclamp_l65mm_w38mm_jaww32mm_pitch42mm_drivem8",
  )
  expect(parsed.fn).toBe("edgeclamp")
  if (parsed.fn !== "edgeclamp") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(edgeClampModelPropsSchema.parse({})).toBeDefined()
})

test("edgeclamp rejects parenthesized selectors and invalid geometry", () => {
  expect(() => parseModelString("edgeclamp_spec(legacy)")).toThrow()
  expect(() => parseModelString("edgeclamp_w30mm_jaww34mm")).toThrow()
})
