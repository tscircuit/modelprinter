import { expect, test } from "bun:test"
import { tSlotPanelRetainerModelPropsSchema } from "../src"
import { props } from "./fixtures/tslotpanelretainer"
test("tslotpanelretainer 5: invalid numeric inputs and extra keys are rejected", () => {
  for (const value of [0, -1, Infinity, NaN, "2mmjunk", "1e2", "(2mm)"])
    expect(() =>
      tSlotPanelRetainerModelPropsSchema.parse({ ...props, width: value }),
    ).toThrow()
  expect(() =>
    tSlotPanelRetainerModelPropsSchema.parse({ ...props, extra: true }),
  ).toThrow()
})
