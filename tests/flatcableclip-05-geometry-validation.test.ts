import { test, expect } from "bun:test"
import { mp, flatCableClipModelPropsSchema } from "../src"
import { props, modelString } from "./fixtures/flatcableclip-case"
test("flatcableclip rejects nonfinite lengths and impossible fitting geometry", () => {
  for (const value of [NaN, Infinity, -1, 0, "10oops", "(10mm)", true, 1e200])
    expect(() =>
      flatCableClipModelPropsSchema.parse({ ...props, innerWidth: value }),
    ).toThrow()
  for (const change of [
    { holePitch: 31 },
    { holeCount: 3 },
    { holeDiameter: 10 },
    { innerHeight: 2 },
  ])
    expect(() =>
      flatCableClipModelPropsSchema.parse({ ...props, ...change }),
    ).toThrow()
  expect(() =>
    flatCableClipModelPropsSchema.parse({ ...props, unexpected: 1 }),
  ).toThrow()
})
