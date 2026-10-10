import { expect, test } from "bun:test"
import { mp, cornerFootModelPropsSchema } from "../src"
test("cornerfoot rejects ambiguous and physically incompatible inputs", () => {
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
  for (const source of [
    "cornerfoot_w25mm_d25mm_h12mm_wall3mm_seat(20mm,20mm)_hole4mm_base3mm_cornercup_unknown1mm",
    "cornerfoot_w25mm_d25mm_h12mm_wall3mm_seat(20mm,20mm)_hole4mm_base3mm_cornercup_seat(30mm,20mm)",
    "cornerfoot",
  ])
    expect(() => mp.string(source).json()).toThrow()
  expect(() =>
    cornerFootModelPropsSchema.parse({ ...props, ...{ holeDiameter: 20 } }),
  ).toThrow()
  expect(() =>
    cornerFootModelPropsSchema.parse({ ...props, width: Infinity }),
  ).toThrow()
  expect(() =>
    cornerFootModelPropsSchema.parse({ ...props, width: "12mmjunk" }),
  ).toThrow()
})
