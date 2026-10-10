import { expect, test } from "bun:test"
import { getPerforatedAngleDimensions } from "../src"
import { props } from "./fixtures/perforatedangle"
test("perforatedangle 3: dimensions expose the documented envelope and datums", () => {
  const dims = getPerforatedAngleDimensions(props)
  expect(dims.size).toEqual([25.0, 25.0, 80])
  expect(dims.bottomZ).toBe(0)
  expect(dims.topZ).toBe(80)
})
