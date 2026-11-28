import { expect, test } from "bun:test"
import {
  getTransistorHeatsinkDimensions,
  modelDefinitionSchema,
  parseModelString,
  transistorHeatsinkModelPropsSchema,
} from "../src"

test("transistorheatsink resolves 25x30x15mm stamped TO-220 heatsink", () => {
  const parsed = parseModelString(
    "transistorheatsink_w25mm_h30mm_d15mm_t1mm_ushapedwings_devicehole3.2mm_holez10mm_tabs2_tabhole3mm_hp20mm",
  )
  expect(parsed).toEqual({
    fn: "transistorheatsink",
    width: 25,
    height: 30,
    depth: 15,
    thickness: 1,
    uShapedWings: true,
    deviceHoleDiameter: 3.2,
    holeZ: 10,
    tabs: 2,
    tabHoleDiameter: 3,
    holePitch: 20,
  })

  const dims = getTransistorHeatsinkDimensions()
  expect(dims.innerChannelWidth).toBe(23)
  expect(dims.wingDepth).toBe(14)
})

test("transistorheatsink supports taller 45mm variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "transistorheatsink_w30mm_h45mm_holez15mm_hp24mm",
  )
  expect(parsed.fn).toBe("transistorheatsink")
  if (parsed.fn !== "transistorheatsink") return
  expect(parsed.height).toBe(45)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(transistorHeatsinkModelPropsSchema.parse({}).uShapedWings).toBe(true)
})

test("transistorheatsink rejects legacy selectors and out-of-bounds holes", () => {
  expect(() =>
    parseModelString("transistorheatsink_shape(ushapedwings)"),
  ).toThrow()
  expect(() => parseModelString("transistorheatsink_h30mm_holez31mm")).toThrow()
})
