import { expect, test } from "bun:test"
import { mp } from "../src"
const props = {
  acrossFlats: 12,
  length: 200,
  endChamfer: 1,
  regularHex: true,
} as const
test("hexshaft uses value-free flags and rejects removed selector syntax", () => {
  const base = "hexshaft_af12mm_l200mm_endchamfer1mm"
  const expected = { fn: "hexshaft", ...props } as const
  expect(mp.string(`${base}_regularhex`).json()).toEqual(expected)
  expect(mp.string(base).json()).toEqual(expected)
  for (const token of [
    "regularhex_regularhex",
    "regularhex(true)",
    "profile(regularhex)",
    "PROFILE(REGULARHEX)",
    "profile(unknown)",
  ]) {
    expect(() => mp.string(`${base}_${token}`).json()).toThrow()
  }
})
