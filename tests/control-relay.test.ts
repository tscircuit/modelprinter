import { expect, test } from "bun:test"
import {
  controlRelayModelPropsSchema,
  getControlRelayDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("controlrelay resolves 8-pin octal plug-in relay envelope and center key", () => {
  const parsed = parseModelString(
    "controlrelay_w22mm_d28mm_h35mm_pins8_pinod1mm_pincircle11mm_centerkey_rectangularcase",
  )
  expect(parsed).toEqual({
    fn: "controlrelay",
    width: 22,
    depth: 28,
    height: 35,
    pins: 8,
    pinDiameter: 1,
    pinCircleDiameter: 11,
    centerKey: true,
    rectangularCase: true,
  })

  const dims = getControlRelayDimensions()
  expect(dims.angularPitchDeg).toBeCloseTo(45)
  expect(dims.centerSpigotDiameter).toBeCloseTo(3.2)
  expect(dims.seatZ).toBe(0)
  expect(dims.topZ).toBe(35)
  expect(dims.bottomPinTipZ).toBeLessThan(0)
})

test("controlrelay supports 11-pin undecal base, unit conversions and schema roundtrip", () => {
  const parsed = parseModelString(
    "controlrelay_w3.5cm_d3.5cm_h50mm_pins11_pincircle17mm_rectangular",
  )
  expect(parsed.fn).toBe("controlrelay")
  if (parsed.fn !== "controlrelay") return
  expect(parsed.pins).toBe(11)
  expect(parsed.width).toBeCloseTo(35)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(controlRelayModelPropsSchema.parse({}).centerKey).toBe(true)
})

test("controlrelay rejects legacy selectors, oversized pin circles and unsupported pin counts", () => {
  expect(() =>
    parseModelString(
      "controlrelay_w22mm_d28mm_h35mm_pins8_pinod1mm_pincircle11mm_key(center)_case(rectangular)",
    ),
  ).toThrow()
  expect(() =>
    parseModelString("controlrelay_w18mm_d28mm_pincircle18mm"),
  ).toThrow()
  expect(() => parseModelString("controlrelay_pins6")).toThrow()
})
