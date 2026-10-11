import { expect, test } from "bun:test"
import { mp } from "../src"
const props = {
  outerDiameter: 20,
  innerDiameter: 12,
  length: 200,
  endChamfer: 1,
  roundTube: true,
} as const
test("hollowshaft uses value-free flags and rejects removed selector syntax", () => {
  const base = "hollowshaft_od20mm_id12mm_l200mm_endchamfer1mm"
  const expected = { fn: "hollowshaft", ...props } as const
  expect(mp.string(`${base}_roundtube`).json()).toEqual(expected)
  expect(mp.string(base).json()).toEqual(expected)
  for (const token of [
    "roundtube_roundtube",
    "roundtube(true)",
    "style(roundtube)",
    "STYLE(ROUNDTUBE)",
    "style(unknown)",
  ]) {
    expect(() => mp.string(`${base}_${token}`).json()).toThrow()
  }
})
