import { expect, test } from "bun:test"
import {
  drawnCupBearingModelPropsSchema,
  getDrawnCupBearingDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("drawncupbearing resolves HK1012 10x14x12mm open-ended cup bearing", () => {
  const parsed = parseModelString(
    "drawncupbearing_id10mm_od14mm_w12mm_rows1_innerring0_openended",
  )
  expect(parsed).toEqual({
    fn: "drawncupbearing",
    innerDiameter: 10,
    outerDiameter: 14,
    width: 12,
    rows: 1,
    innerRing: 0,
    cupStyle: "openended",
  })
  expect(getDrawnCupBearingDimensions().radialSection).toBe(2)
})

test("drawncupbearing supports BK closed-end cup variant and roundtrips", () => {
  const parsed = parseModelString("drawncupbearing_id12mm_od16mm_closedend")
  expect(parsed.fn).toBe("drawncupbearing")
  if (parsed.fn !== "drawncupbearing") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(drawnCupBearingModelPropsSchema.parse({}).cupStyle).toBe("openended")
})

test("drawncupbearing rejects heavy radial walls and legacy selectors", () => {
  expect(() => parseModelString("drawncupbearing_style(openended)")).toThrow()
  expect(() => parseModelString("drawncupbearing_id10mm_od30mm")).toThrow()
})
