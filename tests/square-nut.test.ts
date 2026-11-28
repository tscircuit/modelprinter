import { expect, test } from "bun:test"
import {
  getSquareNutDimensions,
  modelDefinitionSchema,
  parseModelString,
  squareNutModelPropsSchema,
} from "../src"

test("squarenut resolves M6 10x10x5mm chamfered square nut", () => {
  const parsed = parseModelString(
    "squarenut_custom_m6_w10mm_h5mm_squarebody_throughbore_chamfer0.5mm",
  )
  expect(parsed).toEqual({
    fn: "squarenut",
    custom: true,
    thread: "m6",
    width: 10,
    height: 5,
    squareBody: true,
    throughBore: true,
    chamfer: 0.5,
  })

  const dims = getSquareNutDimensions()
  expect(dims.acrossCorners).toBeCloseTo(10 * Math.SQRT2)
  expect(dims.topZ).toBe(5)
})

test("squarenut supports M3 5.5x1.8mm pocket nut and schema roundtrip", () => {
  const parsed = parseModelString("squarenut_M3_w5.5mm_h1.8mm_chamfer0.2mm")
  expect(parsed.fn).toBe("squarenut")
  if (parsed.fn !== "squarenut") return
  expect(parsed.thread).toBe("m3")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(squareNutModelPropsSchema.parse({}).squareBody).toBe(true)
})

test("squarenut rejects legacy selectors and undersized across-flats widths", () => {
  expect(() =>
    parseModelString("squarenut_spec(custom)_body(square)_bore(through)"),
  ).toThrow()
  expect(() => parseModelString("squarenut_m6_w7mm")).toThrow()
})
