import { expect, test } from "bun:test"
import {
  enclosureLidModelPropsSchema,
  getEnclosureLidDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("enclosurelid resolves 100x70mm 4-hole inset-rim cover", () => {
  const parsed = parseModelString(
    "enclosurelid_w100mm_d70mm_t2mm_corner3mm_rimw2mm_rimdepth6mm_holes4_hole3mm_hp(88mm,58mm)",
  )
  expect(parsed).toEqual({
    fn: "enclosurelid",
    width: 100,
    depth: 70,
    thickness: 2,
    cornerRadius: 3,
    rimWidth: 2,
    rimDepth: 6,
    holes: 4,
    holeDiameter: 3,
    holePitchX: 88,
    holePitchY: 58,
  })

  const dims = getEnclosureLidDimensions()
  expect(dims.overallHeight).toBe(8)
  expect(dims.bottomZ).toBe(-6)
  expect(dims.topZ).toBe(2)
})

test("enclosurelid supports square-corner variant and schema roundtrip", () => {
  const parsed = parseModelString("enclosurelid_w12cm_corner0mm_hp(104mm,58mm)")
  expect(parsed.fn).toBe("enclosurelid")
  if (parsed.fn !== "enclosurelid") return
  expect(parsed.width).toBeCloseTo(120)
  expect(parsed.cornerRadius).toBe(0)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(enclosureLidModelPropsSchema.parse({}).holes).toBe(4)
})

test("enclosurelid rejects overflowing corner hole grids", () => {
  expect(() =>
    parseModelString("enclosurelid_w100mm_hole4mm_hp(98mm,58mm)"),
  ).toThrow()
})
