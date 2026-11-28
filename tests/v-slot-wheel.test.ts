import { expect, test } from "bun:test"
import {
  getVSlotWheelDimensions,
  modelDefinitionSchema,
  parseModelString,
  vSlotWheelModelPropsSchema,
} from "../src"

test("vslotwheel resolves 24x11mm 90deg dual-bevel V-track roller", () => {
  const parsed = parseModelString(
    "vslotwheel_od24mm_w11mm_bore5mm_includedangle90deg_dualbevel_bearingseat16mm_axlebore",
  )
  expect(parsed).toEqual({
    fn: "vslotwheel",
    outerDiameter: 24,
    width: 11,
    boreDiameter: 5,
    includedAngleDeg: 90,
    dualBevel: true,
    bearingSeatDiameter: 16,
    axleBore: true,
  })

  const dims = getVSlotWheelDimensions()
  expect(dims.bevelHalfAngleDeg).toBe(45)
  expect(dims.topZ).toBe(5.5)
})

test("vslotwheel supports mini 15.2mm wheel variant and schema roundtrip", () => {
  const parsed = parseModelString("vslotwheel_od15.2mm_w8.8mm_bearingseat10mm")
  expect(parsed.fn).toBe("vslotwheel")
  if (parsed.fn !== "vslotwheel") return
  expect(parsed.outerDiameter).toBe(15.2)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(vSlotWheelModelPropsSchema.parse({}).dualBevel).toBe(true)
})

test("vslotwheel rejects legacy selectors and oversized bearing seats", () => {
  expect(() =>
    parseModelString("vslotwheel_profile(dualbevel)_mount(axlebore)"),
  ).toThrow()
  expect(() => parseModelString("vslotwheel_od24mm_bearingseat22mm")).toThrow()
})
