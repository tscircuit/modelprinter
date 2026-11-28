import { expect, test } from "bun:test"
import {
  getJunctionBoxDimensions,
  junctionBoxModelPropsSchema,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("junctionbox resolves 100x100x60 four-knockout electrical box envelope", () => {
  const parsed = parseModelString(
    "junctionbox_w100mm_d100mm_h60mm_wall3mm_corner3mm_knockouts(20mm,20mm,20mm,20mm)_screwonlid_screws4_hp(84mm,84mm)",
  )
  expect(parsed).toEqual({
    fn: "junctionbox",
    width: 100,
    depth: 100,
    height: 60,
    wallThickness: 3,
    cornerRadius: 3,
    frontKnockoutDiameter: 20,
    rightKnockoutDiameter: 20,
    rearKnockoutDiameter: 20,
    leftKnockoutDiameter: 20,
    screwOnLid: true,
    lidScrews: 4,
    holePitchX: 84,
    holePitchY: 84,
  })

  const dims = getJunctionBoxDimensions()
  expect(dims.innerWidth).toBe(94)
  expect(dims.innerDepth).toBe(94)
  expect(dims.knockoutCenterZ).toBeCloseTo(28.5)
  expect(dims.topZ).toBe(60)
})

test("junctionbox supports uniform knockout shorthand and schema roundtrip", () => {
  const parsed = parseModelString("junctionbox_knockout25mm_corner0mm_screwon")
  expect(parsed.fn).toBe("junctionbox")
  if (parsed.fn !== "junctionbox") return
  expect(parsed.frontKnockoutDiameter).toBe(25)
  expect(parsed.leftKnockoutDiameter).toBe(25)
  expect(parsed.cornerRadius).toBe(0)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(junctionBoxModelPropsSchema.parse({}).lidScrews).toBe(4)
})

test("junctionbox rejects legacy lid selectors and oversized knockouts", () => {
  expect(() =>
    parseModelString("junctionbox_w100mm_d100mm_h60mm_lid(screwon)_screws4"),
  ).toThrow()
  expect(() =>
    parseModelString("junctionbox_h30mm_wall3mm_knockout28mm"),
  ).toThrow()
  expect(() =>
    parseModelString("junctionbox_w100mm_wall3mm_hp(96mm,84mm)"),
  ).toThrow()
})
