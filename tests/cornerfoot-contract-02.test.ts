import { expect, test } from "bun:test"
import { mp, cornerFootModelPropsSchema } from "../src"
test("cornerfoot unit and token case normalization preserves dimensions", () => {
  expect(
    cornerFootModelPropsSchema.parse({
      width: "2.5cm",
      depth: "2.5cm",
      height: "1.2cm",
      wallThickness: "0.3cm",
      baseThickness: "0.3cm",
      seatWidth: "2.0cm",
      seatDepth: "2.0cm",
      holeDiameter: "0.4cm",
      cornerCup: true,
    }),
  ).toEqual({
    width: 25,
    depth: 25,
    height: 12,
    wallThickness: 3,
    baseThickness: 3,
    seatWidth: 20,
    seatDepth: 20,
    holeDiameter: 4,
    cornerCup: true,
  })
  expect(
    mp
      .string(
        "CORNERFOOT_W25MM_D25MM_H12MM_WALL3MM_SEAT(20MM,20MM)_HOLE4MM_BASE3MM_CORNERCUP",
      )
      .json(),
  ).toEqual(
    mp
      .string(
        "cornerfoot_w25mm_d25mm_h12mm_wall3mm_seat(20mm,20mm)_hole4mm_base3mm_cornercup",
      )
      .json(),
  )
})
