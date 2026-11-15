import { test, expect } from "bun:test"
import { mp, cableClipModelPropsSchema } from "../src"
import { props, modelString } from "./fixtures/cableclip-case"
test("cableclip rejects nonfinite lengths and impossible fitting geometry", () => {
  for (const value of [NaN, Infinity, -1, 0, "10oops", "(10mm)", true, 1e200])
    expect(() =>
      cableClipModelPropsSchema.parse({ ...props, cableDiameter: value }),
    ).toThrow()
  for (const change of [
    { height: 11 },
    { arcDegrees: 180 },
    { arcDegrees: 360 },
    { holeDiameter: 10 },
  ])
    expect(() =>
      cableClipModelPropsSchema.parse({ ...props, ...change }),
    ).toThrow()
  expect(() =>
    cableClipModelPropsSchema.parse({ ...props, unexpected: 1 }),
  ).toThrow()
})
