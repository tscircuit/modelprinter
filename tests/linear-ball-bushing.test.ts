import { expect, test } from "bun:test"
import {
  getLinearBallBushingDimensions,
  linearBallBushingModelPropsSchema,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("linearballbushing resolves 8x15x24mm closed recirculating bushing", () => {
  const parsed = parseModelString(
    "linearballbushing_id8mm_od15mm_l24mm_closedrecirculating_circlipgrooves2",
  )
  expect(parsed).toEqual({
    fn: "linearballbushing",
    innerDiameter: 8,
    outerDiameter: 15,
    length: 24,
    closedRecirculating: true,
    circlipGrooves: 2,
  })

  const dims = getLinearBallBushingDimensions()
  expect(dims.radialWallThickness).toBeCloseTo(3.5)
  expect(dims.grooveDiameter).toBeLessThan(15)
  expect(dims.topZ).toBe(24)
})

test("linearballbushing supports grooveless variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "linearballbushing_id12mm_od21mm_l3cm_circlipgrooves0",
  )
  expect(parsed.fn).toBe("linearballbushing")
  if (parsed.fn !== "linearballbushing") return
  expect(parsed.length).toBeCloseTo(30)
  expect(parsed.circlipGrooves).toBe(0)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(linearBallBushingModelPropsSchema.parse({}).closedRecirculating).toBe(
    true,
  )
})

test("linearballbushing rejects legacy style selectors and inverted diameters", () => {
  expect(() =>
    parseModelString(
      "linearballbushing_id8mm_od15mm_style(closedrecirculating)",
    ),
  ).toThrow()
  expect(() => parseModelString("linearballbushing_id15mm_od12mm")).toThrow()
})
