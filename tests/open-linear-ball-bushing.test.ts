import { expect, test } from "bun:test"
import {
  getOpenLinearBallBushingDimensions,
  modelDefinitionSchema,
  openLinearBallBushingModelPropsSchema,
  parseModelString,
} from "../src"

test("openlinearballbushing resolves 16x26x36mm 60-deg open bushing", () => {
  const parsed = parseModelString(
    "openlinearballbushing_id16mm_od26mm_l36mm_openrecirculating_openingangle60deg_circlipgrooves2",
  )
  expect(parsed).toEqual({
    fn: "openlinearballbushing",
    innerDiameter: 16,
    outerDiameter: 26,
    length: 36,
    openRecirculating: true,
    openingAngle: 60,
    circlipGrooves: 2,
  })

  const dims = getOpenLinearBallBushingDimensions()
  expect(dims.radialWallThickness).toBe(5)
  expect(dims.slotChordWidth).toBeCloseTo(8)
})

test("openlinearballbushing supports 20mm bore 54-deg slot and roundtrips", () => {
  const parsed = parseModelString(
    "openlinearballbushing_id20mm_od32mm_l45mm_openingangle54deg",
  )
  expect(parsed.fn).toBe("openlinearballbushing")
  if (parsed.fn !== "openlinearballbushing") return
  expect(parsed.openingAngle).toBe(54)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(
    openLinearBallBushingModelPropsSchema.parse({}).openRecirculating,
  ).toBe(true)
})

test("openlinearballbushing rejects legacy selectors and invalid slot angles", () => {
  expect(() =>
    parseModelString("openlinearballbushing_style(openrecirculating)"),
  ).toThrow()
  expect(() =>
    parseModelString("openlinearballbushing_openingangle150deg"),
  ).toThrow()
})
