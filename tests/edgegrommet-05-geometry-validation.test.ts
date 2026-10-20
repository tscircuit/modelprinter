import { test, expect } from "bun:test"
import { mp, edgeGrommetModelPropsSchema } from "../src"
import { props, modelString } from "./fixtures/edgegrommet-case"
test("edgegrommet rejects nonfinite lengths and impossible fitting geometry", () => {
  for (const value of [NaN, Infinity, -1, 0, "10oops", "(10mm)", true, 1e200])
    expect(() =>
      edgeGrommetModelPropsSchema.parse({ ...props, length: value }),
    ).toThrow()
  for (const change of [
    { slotWidth: 5 },
    { slotDepth: 6 },
    { cornerRadius: 2 },
    { cornerRadius: -1 },
  ])
    expect(() =>
      edgeGrommetModelPropsSchema.parse({ ...props, ...change }),
    ).toThrow()
  expect(() =>
    edgeGrommetModelPropsSchema.parse({ ...props, unexpected: 1 }),
  ).toThrow()
})
