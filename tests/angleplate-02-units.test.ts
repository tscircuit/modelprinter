import { expect, test } from "bun:test"
import { mp, anglePlateModelPropsSchema } from "../src"
import { source, props } from "./fixtures/angleplate"

test("angleplate normalizes unit-bearing lengths and full aliases without changing other models", () => {
  expect(
    mp
      .string(
        source.replace("w100mm", "width10cm").replace("d80mm", "depth0.08m"),
      )
      .json(),
  ).toEqual({ fn: "angleplate", ...props })
  expect(
    anglePlateModelPropsSchema.parse({ ...props, width: "4in" }).width,
  ).toBeCloseTo(101.6)
  expect(
    mp.string("rectangularbar_w20mm_h12mm_l200mm_cornerr0mm").json(),
  ).toMatchObject({ fn: "rectangularbar", width: 20, height: 12, length: 200 })
})
