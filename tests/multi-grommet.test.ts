import { expect, test } from "bun:test"
import {
  getMultiGrommetDimensions,
  modelDefinitionSchema,
  multiGrommetModelPropsSchema,
  parseModelString,
} from "../src"

test("multigrommet resolves 30x10mm 4-bore panel grommet", () => {
  const parsed = parseModelString(
    "multigrommet_od30mm_h10mm_panelhole25mm_groovew3mm_bores4_id4mm_borepcd12mm",
  )
  expect(parsed).toEqual({
    fn: "multigrommet",
    outerDiameter: 30,
    height: 10,
    panelHoleDiameter: 25,
    grooveWidth: 3,
    bores: 4,
    boreInnerDiameter: 4,
    borePcd: 12,
  })
  expect(getMultiGrommetDimensions().flangeLipHeight).toBe(3.5)
})

test("multigrommet supports 6-bore 40mm variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "multigrommet_od40mm_panelhole34mm_bores6_borepcd18mm",
  )
  expect(parsed.fn).toBe("multigrommet")
  if (parsed.fn !== "multigrommet") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(multiGrommetModelPropsSchema.parse({}).bores).toBe(4)
})

test("multigrommet rejects overlapping cable bores and parenthesized tokens", () => {
  expect(() => parseModelString("multigrommet_style(round)")).toThrow()
  expect(() =>
    parseModelString("multigrommet_bores8_id4mm_borepcd8mm"),
  ).toThrow()
})
