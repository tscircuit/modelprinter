import { expect, test } from "bun:test"
import {
  getGridGratingDimensions,
  gridGratingModelPropsSchema,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("gridgrating resolves 300x200x25mm 25x50mm bar grating", () => {
  const parsed = parseModelString(
    "gridgrating_l300mm_w200mm_h25mm_bart3mm_pitch25mm_crosst3mm_crossh5mm_crosspitch50mm",
  )
  expect(parsed).toEqual({
    fn: "gridgrating",
    length: 300,
    width: 200,
    bearingBarHeight: 25,
    bearingBarThickness: 3,
    bearingBarPitch: 25,
    crossBarThickness: 3,
    crossBarHeight: 5,
    crossBarPitch: 50,
  })
  expect(getGridGratingDimensions().cellOpeningWidth).toBe(22)
})

test("gridgrating supports 40mm deep heavy grating and roundtrips", () => {
  const parsed = parseModelString("gridgrating_h40mm_bart5mm_pitch30mm")
  expect(parsed.fn).toBe("gridgrating")
  if (parsed.fn !== "gridgrating") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(gridGratingModelPropsSchema.parse({}).crossBarPitch).toBe(50)
})

test("gridgrating rejects oversized crossbars and parenthesized tokens", () => {
  expect(() => parseModelString("gridgrating_surface(serrated)")).toThrow()
  expect(() => parseModelString("gridgrating_h25mm_crossh22mm")).toThrow()
})
