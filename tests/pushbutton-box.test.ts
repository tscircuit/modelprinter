import { expect, test } from "bun:test"
import {
  getPushbuttonBoxDimensions,
  modelDefinitionSchema,
  parseModelString,
  pushbuttonBoxModelPropsSchema,
} from "../src"

test("pushbuttonbox resolves 80x80x65mm 22.5mm operator enclosure", () => {
  const parsed = parseModelString(
    "pushbuttonbox_w80mm_d80mm_h65mm_wall3mm_corner4mm_lidt3mm_hole22.5mm_screwonlid_screws4_hp(62mm,62mm)",
  )
  expect(parsed).toEqual({
    fn: "pushbuttonbox",
    width: 80,
    depth: 80,
    height: 65,
    wallThickness: 3,
    cornerRadius: 4,
    lidThickness: 3,
    cutoutDiameter: 22.5,
    screwOnLid: true,
    screws: 4,
    holePitchX: 62,
    holePitchY: 62,
  })

  const dims = getPushbuttonBoxDimensions()
  expect(dims.innerWidth).toBe(74)
  expect(dims.baseHeight).toBe(62)
  expect(dims.topZ).toBe(65)
})

test("pushbuttonbox supports 30.5mm heavy-duty cutout and schema roundtrip", () => {
  const parsed = parseModelString(
    "pushbuttonbox_w10cm_d10cm_hole30.5mm_hp(80mm,80mm)",
  )
  expect(parsed.fn).toBe("pushbuttonbox")
  if (parsed.fn !== "pushbuttonbox") return
  expect(parsed.width).toBeCloseTo(100)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(pushbuttonBoxModelPropsSchema.parse({}).screwOnLid).toBe(true)
})

test("pushbuttonbox rejects legacy lid selectors and oversized cutouts", () => {
  expect(() => parseModelString("pushbuttonbox_lid(screwon)")).toThrow()
  expect(() =>
    parseModelString("pushbuttonbox_hole60mm_hp(62mm,62mm)"),
  ).toThrow()
})
