import { expect, test } from "bun:test"
import {
  getTriangularBarDimensions,
  modelDefinitionSchema,
  parseModelString,
  triangularBarModelPropsSchema,
} from "../src"

test("triangularbar resolves 20x100mm equilateral bar stock", () => {
  const parsed = parseModelString(
    "triangularbar_side20mm_l100mm_equilateral_cornerr0mm",
  )
  expect(parsed).toEqual({
    fn: "triangularbar",
    sideLength: 20,
    length: 100,
    equilateral: true,
    cornerRadius: 0,
  })
  expect(getTriangularBarDimensions().altitude).toBeCloseTo(
    10 * Math.sqrt(3),
    4,
  )
})

test("triangularbar supports filleted 30mm bar and schema roundtrip", () => {
  const parsed = parseModelString("triangularbar_side30mm_cornerr1.5mm")
  expect(parsed.fn).toBe("triangularbar")
  if (parsed.fn !== "triangularbar") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(triangularBarModelPropsSchema.parse({}).equilateral).toBe(true)
})

test("triangularbar rejects legacy selectors and excessive corner fillets", () => {
  expect(() => parseModelString("triangularbar_shape(equilateral)")).toThrow()
  expect(() => parseModelString("triangularbar_side20mm_cornerr6mm")).toThrow()
})
