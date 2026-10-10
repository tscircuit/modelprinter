import { expect, test } from "bun:test"
import { mp, rectangularGasketModelPropsSchema } from "../src"
test("rectangulargasket unit and token case normalization preserves dimensions", () => {
  expect(
    rectangularGasketModelPropsSchema.parse({
      width: "8.0cm",
      height: "5.0cm",
      border: "0.5cm",
      thickness: "0.2cm",
      cornerRadius: "0.5cm",
      flatFrame: true,
    }),
  ).toEqual({
    width: 80,
    height: 50,
    border: 5,
    thickness: 2,
    cornerRadius: 5,
    flatFrame: true,
  })
  expect(
    mp
      .string(
        "RECTANGULARGASKET_W80MM_H50MM_BORDER5MM_T2MM_CORNERR5MM_FLATFRAME",
      )
      .json(),
  ).toEqual(
    mp
      .string(
        "rectangulargasket_w80mm_h50mm_border5mm_t2mm_cornerr5mm_flatframe",
      )
      .json(),
  )
})
