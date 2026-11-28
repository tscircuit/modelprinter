import { expect, test } from "bun:test"
import {
  circuitBreakerModelPropsSchema,
  getCircuitBreakerDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("circuitbreaker resolves single-pole TH35x7.5 modular breaker envelope", () => {
  const parsed = parseModelString(
    "circuitbreaker_w18mm_h85mm_d70mm_poles1_th35x7.5_fronttoggle_topbottomterminals_stepped",
  )
  expect(parsed).toEqual({
    fn: "circuitbreaker",
    width: 18,
    height: 85,
    depth: 70,
    poles: 1,
    th35x75Rail: true,
    frontToggle: true,
    topBottomTerminals: true,
    stepped: true,
  })

  const dims = getCircuitBreakerDimensions()
  expect(dims.moduleWidth).toBe(18)
  expect(dims.railSlotWidth).toBe(35)
  expect(dims.noseWindowHeight).toBe(45)
  expect(dims.frontZ).toBe(70)
})

test("circuitbreaker defaults multi-pole width and roundtrips through modelDefinitionSchema", () => {
  const parsed = parseModelString("circuitbreaker_poles3_topbottom")
  expect(parsed.fn).toBe("circuitbreaker")
  if (parsed.fn !== "circuitbreaker") return
  expect(parsed.width).toBe(54)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(circuitBreakerModelPropsSchema.parse({ poles: 2 }).width).toBe(36)
})

test("circuitbreaker rejects legacy selectors, undersized pole widths and shallow housings", () => {
  expect(() =>
    parseModelString(
      "circuitbreaker_w18mm_h85mm_d70mm_poles1_rail(TH35x7.5)_actuator(fronttoggle)",
    ),
  ).toThrow()
  expect(() => parseModelString("circuitbreaker_poles3_w45mm")).toThrow()
  expect(() => parseModelString("circuitbreaker_h35mm")).toThrow()
})
