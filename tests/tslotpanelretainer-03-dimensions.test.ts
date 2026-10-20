import { expect, test } from "bun:test"
import { getTSlotPanelRetainerDimensions } from "../src"
import { props } from "./fixtures/tslotpanelretainer"
test("tslotpanelretainer 3: dimensions expose the documented envelope and datums", () => {
  const dims = getTSlotPanelRetainerDimensions(props)
  expect(dims.size).toEqual([20, 12, 25])
  expect(dims.bottomZ).toBe(0)
  expect(dims.topZ).toBe(25)
})
