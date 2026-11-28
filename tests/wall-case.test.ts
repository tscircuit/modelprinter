import { expect, test } from "bun:test"
import {
  getWallCaseDimensions,
  modelDefinitionSchema,
  parseModelString,
  wallCaseModelPropsSchema,
} from "../src"

test("wallcase resolves 200x80x250mm left-hinged wall cabinet", () => {
  const parsed = parseModelString(
    "wallcase_w200mm_d80mm_h250mm_wall3mm_corner3mm_leftpivotdoor_mounts4_hole6mm_hp(180mm,220mm)",
  )
  expect(parsed).toEqual({
    fn: "wallcase",
    width: 200,
    depth: 80,
    height: 250,
    wallThickness: 3,
    cornerRadius: 3,
    leftPivotDoor: true,
    mounts: 4,
    holeDiameter: 6,
    holePitchX: 180,
    holePitchY: 220,
  })

  const dims = getWallCaseDimensions()
  expect(dims.innerWidth).toBe(194)
  expect(dims.innerHeight).toBe(244)
  expect(dims.topZ).toBe(80)
})

test("wallcase supports 300mm tall cabinet and schema roundtrip", () => {
  const parsed = parseModelString("wallcase_h30cm_hp(180mm,260mm)")
  expect(parsed.fn).toBe("wallcase")
  if (parsed.fn !== "wallcase") return
  expect(parsed.height).toBeCloseTo(300)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(wallCaseModelPropsSchema.parse({}).leftPivotDoor).toBe(true)
})

test("wallcase rejects legacy door selectors and overflowing mounting grids", () => {
  expect(() => parseModelString("wallcase_door(leftpivot)")).toThrow()
  expect(() =>
    parseModelString("wallcase_w200mm_hole6mm_hp(198mm,220mm)"),
  ).toThrow()
})
