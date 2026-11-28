import { expect, test } from "bun:test"
import {
  getSelfAligningBallBearingDimensions,
  modelDefinitionSchema,
  parseModelString,
  selfAligningBallBearingModelPropsSchema,
} from "../src"

test("selfaligningballbearing resolves 20x47x14mm 1204 open bearing", () => {
  const parsed = parseModelString(
    "selfaligningballbearing_id20mm_od47mm_w14mm_rows2_open_sphericalouter",
  )
  expect(parsed).toEqual({
    fn: "selfaligningballbearing",
    innerDiameter: 20,
    outerDiameter: 47,
    width: 14,
    rows: 2,
    closure: "open",
    sphericalOuter: true,
  })
  expect(getSelfAligningBallBearingDimensions().pitchCircleDiameter).toBe(33.5)
})

test("selfaligningballbearing supports sealed 2204 variant and roundtrips", () => {
  const parsed = parseModelString("selfaligningballbearing_w18mm_sealed")
  expect(parsed.fn).toBe("selfaligningballbearing")
  if (parsed.fn !== "selfaligningballbearing") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(selfAligningBallBearingModelPropsSchema.parse({}).rows).toBe(2)
})

test("selfaligningballbearing rejects single-row counts and legacy selectors", () => {
  expect(() =>
    parseModelString("selfaligningballbearing_series(1204)"),
  ).toThrow()
  expect(() => parseModelString("selfaligningballbearing_rows1")).toThrow()
})
