import { expect, test } from "bun:test"
import {
  barrelJackModelPropsSchema,
  getBarrelJackDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("barreljack resolves 5.5x2.1mm horizontal PCB box jack envelope and cavity", () => {
  const parsed = parseModelString(
    "barreljack_boxjack_plugod5.5mm_pinod2.1mm_w9mm_h11mm_l14.5mm_throughhole_horizontal_contacts3_frontcenterrear",
  )
  expect(parsed).toEqual({
    fn: "barreljack",
    boxJack: true,
    plugOuterDiameter: 5.5,
    centerPinDiameter: 2.1,
    width: 9,
    height: 11,
    length: 14.5,
    throughHole: true,
    horizontal: true,
    contacts: 3,
    frontCenterRear: true,
  })

  const dims = getBarrelJackDimensions()
  expect(dims.annularPlugClearance).toBeCloseTo(1.7)
  expect(dims.barrelCenterZ).toBeCloseTo(5.5)
  expect(dims.frontY).toBeCloseTo(-7.25)
  expect(dims.rearY).toBeCloseTo(7.25)
  expect(dims.bottomZ).toBe(0)
  expect(dims.topZ).toBe(11)
})

test("barreljack supports 5.5x2.5mm variant, unit conversions and schema roundtrip", () => {
  const parsed = parseModelString("barreljack_plugod5.5mm_pinod2.5mm_l1.45cm")
  expect(parsed.fn).toBe("barreljack")
  if (parsed.fn !== "barreljack") return
  expect(parsed.centerPinDiameter).toBeCloseTo(2.5)
  expect(parsed.length).toBeCloseTo(14.5)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(barrelJackModelPropsSchema.parse({}).contacts).toBe(3)
})

test("barreljack rejects legacy selectors, oversized center pins and undersized housings", () => {
  expect(() =>
    parseModelString(
      "barreljack_form(boxjack)_plugod5.5mm_pinod2.1mm_w9mm_h11mm_l14.5mm_mount(throughhole)",
    ),
  ).toThrow()
  expect(() => parseModelString("barreljack_plugod5.5mm_pinod5mm")).toThrow()
  expect(() =>
    parseModelString("barreljack_plugod5.5mm_pinod2.1mm_w5mm"),
  ).toThrow()
  expect(() => parseModelString("barreljack_contacts2")).toThrow()
})
