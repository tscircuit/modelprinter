import { expect, test } from "bun:test"
import { getSlottedChannelDimensions } from "../src"
import { props } from "./fixtures/slottedchannel"
test("slottedchannel 3: dimensions expose the documented envelope and datums", () => {
  const dims = getSlottedChannelDimensions(props)
  expect(dims.size).toEqual([40, 20, 80])
  expect(dims.bottomZ).toBe(0)
  expect(dims.topZ).toBe(80)
})
