import { expect, test } from "bun:test"
import {
  getShelfSplitSleeveDimensions,
  modelDefinitionSchema,
  parseModelString,
  shelfSplitSleeveModelPropsSchema,
} from "../src"

test("shelfsplitsleeve resolves 25mm-bore tapered locking sleeve", () => {
  const parsed = parseModelString(
    "shelfsplitsleeve_id25mm_h30mm_bottomod35mm_topod33mm_ridgeh1mm_ridgew2mm_ridgez15mm_seamtabs2_tabw4mm_tabh2mm",
  )
  expect(parsed).toEqual({
    fn: "shelfsplitsleeve",
    innerDiameter: 25,
    height: 30,
    bottomOuterDiameter: 35,
    topOuterDiameter: 33,
    ridgeHeight: 1,
    ridgeWidth: 2,
    ridgeZ: 15,
    seamTabs: 2,
    tabWidth: 4,
    tabHeight: 2,
  })
  expect(getShelfSplitSleeveDimensions().ridgeInnerDiameter).toBe(23)
})

test("shelfsplitsleeve supports 38mm tall sleeve and roundtrips", () => {
  const parsed = parseModelString("shelfsplitsleeve_h38mm_ridgez19mm")
  expect(parsed.fn).toBe("shelfsplitsleeve")
  if (parsed.fn !== "shelfsplitsleeve") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(shelfSplitSleeveModelPropsSchema.parse({}).seamTabs).toBe(2)
})

test("shelfsplitsleeve rejects inverted tapers and parenthesized tokens", () => {
  expect(() => parseModelString("shelfsplitsleeve_material(abs)")).toThrow()
  expect(() =>
    parseModelString("shelfsplitsleeve_bottomod32mm_topod35mm"),
  ).toThrow()
})
