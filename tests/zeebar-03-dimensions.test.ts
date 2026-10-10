import { expect, test } from "bun:test"
import { getZeeBarDimensions } from "../src"
import { props } from "./fixtures/zeebar"
test("zeebar 3: dimensions expose the documented envelope and datums", () => {
  const dims = getZeeBarDimensions(props)
  expect(dims.size).toEqual([38, 30, 80])
  expect(dims.bottomZ).toBe(0)
  expect(dims.topZ).toBe(80)
})
