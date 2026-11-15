import { test, expect } from "bun:test"
import { mp, pcbEdgeSupportModelPropsSchema } from "../src"
import { props, modelString } from "./fixtures/pcbedgesupport-case"
test("pcbedgesupport rejects nonfinite lengths and impossible fitting geometry", () => {
  for (const value of [NaN, Infinity, -1, 0, "10oops", "(10mm)", true, 1e200])
    expect(() =>
      pcbEdgeSupportModelPropsSchema.parse({ ...props, width: value }),
    ).toThrow()
  for (const change of [
    { bodyWidth: 11 },
    { baseThickness: 10 },
    { slotWidth: 12 },
    { holePitch: 17 },
  ])
    expect(() =>
      pcbEdgeSupportModelPropsSchema.parse({ ...props, ...change }),
    ).toThrow()
  expect(() =>
    pcbEdgeSupportModelPropsSchema.parse({ ...props, unexpected: 1 }),
  ).toThrow()
})
