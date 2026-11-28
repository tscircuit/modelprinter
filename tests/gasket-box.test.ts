import { expect, test } from "bun:test"
import {
  gasketBoxModelPropsSchema,
  getGasketBoxDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("gasketbox resolves 120x80x55 perimeter-groove sealed enclosure", () => {
  const parsed = parseModelString(
    "gasketbox_w120mm_d80mm_h55mm_wall3mm_corner4mm_lidt3mm_groovew3mm_grooved2mm_screws4_hp(104mm,64mm)",
  )
  expect(parsed).toEqual({
    fn: "gasketbox",
    width: 120,
    depth: 80,
    height: 55,
    wallThickness: 3,
    cornerRadius: 4,
    lidThickness: 3,
    grooveWidth: 3,
    grooveDepth: 2,
    lidScrews: 4,
    holePitchX: 104,
    holePitchY: 64,
    screwOnLid: true,
  })

  const dims = getGasketBoxDimensions()
  expect(dims.seamZ).toBe(52)
  expect(dims.grooveFloorZ).toBe(50)
  expect(dims.innerWidth).toBe(114)
  expect(dims.topZ).toBe(55)
})

test("gasketbox supports split hpx/hpy tokens, square corners and schema roundtrip", () => {
  const parsed = parseModelString(
    "gasketbox_w10cm_d8cm_corner0mm_hpx84mm_hpy64mm_screwon",
  )
  expect(parsed.fn).toBe("gasketbox")
  if (parsed.fn !== "gasketbox") return
  expect(parsed.width).toBeCloseTo(100)
  expect(parsed.cornerRadius).toBe(0)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(gasketBoxModelPropsSchema.parse({}).lidScrews).toBe(4)
})

test("gasketbox rejects legacy selectors, excessive groove widths and out-of-wall screws", () => {
  expect(() =>
    parseModelString("gasketbox_w120mm_d80mm_lid(screwon)"),
  ).toThrow()
  expect(() =>
    parseModelString("gasketbox_w60mm_d40mm_wall3mm_groovew20mm"),
  ).toThrow()
  expect(() =>
    parseModelString("gasketbox_w120mm_wall3mm_hp(118mm,64mm)"),
  ).toThrow()
})
