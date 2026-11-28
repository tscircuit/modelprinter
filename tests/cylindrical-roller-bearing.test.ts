import { expect, test } from "bun:test"
import {
  cylindricalRollerBearingModelPropsSchema,
  getCylindricalRollerBearingDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("cylindricalrollerbearing resolves 25x52x15mm NU205 open bearing", () => {
  const parsed = parseModelString(
    "cylindricalrollerbearing_id25mm_od52mm_w15mm_rows1_nu_open",
  )
  expect(parsed).toEqual({
    fn: "cylindricalrollerbearing",
    innerDiameter: 25,
    outerDiameter: 52,
    width: 15,
    rows: 1,
    layout: "nu",
    closure: "open",
  })
  expect(getCylindricalRollerBearingDimensions().pitchCircleDiameter).toBe(38.5)
})

test("cylindricalrollerbearing supports NJ shielded variant and roundtrips", () => {
  const parsed = parseModelString("cylindricalrollerbearing_nj_shielded_w18mm")
  expect(parsed.fn).toBe("cylindricalrollerbearing")
  if (parsed.fn !== "cylindricalrollerbearing") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(cylindricalRollerBearingModelPropsSchema.parse({}).layout).toBe("nu")
})

test("cylindricalrollerbearing rejects legacy selectors and inverted diameters", () => {
  expect(() => parseModelString("cylindricalrollerbearing_style(nu)")).toThrow()
  expect(() =>
    parseModelString("cylindricalrollerbearing_id50mm_od52mm"),
  ).toThrow()
})
