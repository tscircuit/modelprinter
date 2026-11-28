import { expect, test } from "bun:test"
import {
  currentTransformerModelPropsSchema,
  getCurrentTransformerDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("currenttransformer resolves 40x45x20mm 20mm-window CT sensor", () => {
  const parsed = parseModelString(
    "currenttransformer_w40mm_h45mm_d20mm_bore20mm_terminals2_tabs2_hole4mm_hp50mm_closedring",
  )
  expect(parsed).toEqual({
    fn: "currenttransformer",
    width: 40,
    height: 45,
    depth: 20,
    boreDiameter: 20,
    terminals: 2,
    tabs: 2,
    holeDiameter: 4,
    holePitch: 50,
    closedRing: true,
  })
  expect(getCurrentTransformerDimensions().coreRadialWall).toBe(10)
})

test("currenttransformer supports 60mm CT variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "currenttransformer_w60mm_h65mm_bore30mm_hp72mm",
  )
  expect(parsed.fn).toBe("currenttransformer")
  if (parsed.fn !== "currenttransformer") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(currentTransformerModelPropsSchema.parse({}).closedRing).toBe(true)
})

test("currenttransformer rejects legacy selectors and oversized bores", () => {
  expect(() =>
    parseModelString("currenttransformer_type(closedring)"),
  ).toThrow()
  expect(() => parseModelString("currenttransformer_w40mm_bore36mm")).toThrow()
})
