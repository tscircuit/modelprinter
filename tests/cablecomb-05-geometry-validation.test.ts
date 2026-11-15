import { test, expect } from "bun:test"
import { mp, cableCombModelPropsSchema } from "../src"
import { props, modelString } from "./fixtures/cablecomb-case"
test("cablecomb rejects nonfinite lengths and impossible fitting geometry", () => {
  for (const value of [NaN, Infinity, -1, 0, "10oops", "(10mm)", true, 1e200])
    expect(() =>
      cableCombModelPropsSchema.parse({ ...props, width: value }),
    ).toThrow()
  for (const change of [
    { slotDepth: 10 },
    { slotPitch: 6 },
    { holePitch: 46 },
    { slotCount: 6.5 },
  ])
    expect(() =>
      cableCombModelPropsSchema.parse({ ...props, ...change }),
    ).toThrow()
  expect(() =>
    cableCombModelPropsSchema.parse({ ...props, unexpected: 1 }),
  ).toThrow()
})
