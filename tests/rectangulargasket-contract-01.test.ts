import { expect, test } from "bun:test"
import {
  mp,
  rectangularGasketModelPropsSchema,
  getRectangularGasketDimensions,
} from "../src"
test("rectangulargasket complete strings and public dimensions agree", () => {
  const props = {
    width: 80,
    height: 50,
    border: 5,
    thickness: 2,
    cornerRadius: 5,
    flatFrame: true,
  } as const
  expect(
    mp
      .string(
        "rectangulargasket_w80mm_h50mm_border5mm_t2mm_cornerr5mm_flatframe",
      )
      .json(),
  ).toEqual({ fn: "rectangulargasket", ...props })
  expect(
    mp
      .string(
        "rectangulargasket_w80mm_h50mm_border5mm_t2mm_profile(flatframe)_cornerr5mm",
      )
      .json(),
  ).toEqual({ fn: "rectangulargasket", ...props })
  expect(rectangularGasketModelPropsSchema.parse(props)).toEqual(props)
  expect(getRectangularGasketDimensions(props).size).toEqual([80, 50, 2])
})
