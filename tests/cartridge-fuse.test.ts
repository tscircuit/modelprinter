import { expect, test } from "bun:test"
import {
  cartridgeFuseModelPropsSchema,
  getCartridgeFuseDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("cartridgefuse resolves 5x20mm ceramic cartridge fuse", () => {
  const parsed = parseModelString(
    "cartridgefuse_cartridge5x20_od5mm_l20mm_capl5mm_ceramiccylinder",
  )
  expect(parsed).toEqual({
    fn: "cartridgefuse",
    cartridge5x20: true,
    outerDiameter: 5,
    length: 20,
    capLength: 5,
    ceramicCylinder: true,
  })
  expect(getCartridgeFuseDimensions().exposedBodyLength).toBe(10)
})

test("cartridgefuse supports 4.5mm cap variant and schema roundtrip", () => {
  const parsed = parseModelString("cartridgefuse_capl4.5mm")
  expect(parsed.fn).toBe("cartridgefuse")
  if (parsed.fn !== "cartridgefuse") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(cartridgeFuseModelPropsSchema.parse({}).ceramicCylinder).toBe(true)
})

test("cartridgefuse rejects legacy selectors and touching end caps", () => {
  expect(() =>
    parseModelString("cartridgefuse_envelope(5x20cartridge)"),
  ).toThrow()
  expect(() => parseModelString("cartridgefuse_l20mm_capl10mm")).toThrow()
})
