import { expect, test } from "bun:test"
import { getHatSectionDimensions } from "../src"
import { props } from "./fixtures/hatsection"
test("hatsection 3: dimensions expose the documented envelope and datums", () => {
  const dims = getHatSectionDimensions(props)
  expect(dims.size).toEqual([60, 20, 80])
  expect(dims.bottomZ).toBe(0)
  expect(dims.topZ).toBe(80)
})
