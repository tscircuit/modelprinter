import { expect, test } from "bun:test"
import {
  getParallelsDimensions,
  modelDefinitionSchema,
  parallelsModelPropsSchema,
  parseModelString,
} from "../src"

test("parallels resolves 100x20x5mm matched vise parallels", () => {
  const parsed = parseModelString(
    "parallels_l100mm_h20mm_t5mm_pairgap50mm_edger0mm",
  )
  expect(parsed).toEqual({
    fn: "parallels",
    length: 100,
    height: 20,
    thickness: 5,
    pairGap: 50,
    edgeRadius: 0,
  })
  expect(getParallelsDimensions().overallSpanY).toBe(55)
})

test("parallels supports 150x35mm pair and roundtrips", () => {
  const parsed = parseModelString("parallels_l150mm_h35mm_edger0.5mm")
  expect(parsed.fn).toBe("parallels")
  if (parsed.fn !== "parallels") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(parallelsModelPropsSchema.parse({}).pairGap).toBe(50)
})

test("parallels rejects colliding pair gaps and parenthesized tokens", () => {
  expect(() => parseModelString("parallels_grade(ground)")).toThrow()
  expect(() => parseModelString("parallels_t8mm_pairgap8mm")).toThrow()
})
