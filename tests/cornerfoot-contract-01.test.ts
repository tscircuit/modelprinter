import { expect, test } from "bun:test"
import { mp, cornerFootModelPropsSchema, getCornerFootDimensions } from "../src"
test("cornerfoot complete strings and public dimensions agree", () => {
  const props = {
    width: 25,
    depth: 25,
    height: 12,
    wallThickness: 3,
    baseThickness: 3,
    seatWidth: 20,
    seatDepth: 20,
    holeDiameter: 4,
    cornerCup: true,
  } as const
  expect(
    mp
      .string(
        "cornerfoot_w25mm_d25mm_h12mm_wall3mm_seat(20mm,20mm)_hole4mm_base3mm_cornercup",
      )
      .json(),
  ).toEqual({ fn: "cornerfoot", ...props })
  expect(
    mp
      .string(
        "cornerfoot_w25mm_d25mm_h12mm_wall3mm_seat(20mm,20mm)_hole4mm_shape(cornercup)",
      )
      .json(),
  ).toEqual({ fn: "cornerfoot", ...props })
  expect(cornerFootModelPropsSchema.parse(props)).toEqual(props)
  expect(getCornerFootDimensions(props).size).toEqual([25, 25, 12])
})
