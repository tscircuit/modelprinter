import { expect, test } from "bun:test"
import { tSlotPanelRetainerModelPropsSchema } from "../src"
import { props } from "./fixtures/tslotpanelretainer"
test("tslotpanelretainer 8: overflowing dimensions are rejected", () => {
  expect(() =>
    tSlotPanelRetainerModelPropsSchema.parse({ ...props, width: 1e200 }),
  ).toThrow()
})
