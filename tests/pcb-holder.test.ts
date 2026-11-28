import { expect, test } from "bun:test"
import {
  getPcbHolderDimensions,
  modelDefinitionSchema,
  parseModelString,
  pcbHolderModelPropsSchema,
} from "../src"

test("pcbholder resolves canonical roadmap contract parameters", () => {
  const parsed = parseModelString(
    "pcbholder_span150mm_h80mm_jaww10mm_groovew1.6mm_grooved3mm_basel200mm_basew60mm_mounts4_hole5.5mm_pitchx170mm_pitchy40mm",
  )
  expect(parsed).toEqual({
    fn: "pcbholder",
    boardSpan: 150,
    height: 80,
    jawWidth: 10,
    grooveWidth: 1.6,
    grooveDepth: 3,
    baseLength: 200,
    baseWidth: 60,
    mounts: 4,
    holeDiameter: 5.5,
    pitchX: 170,
    pitchY: 40,
  })
  expect(getPcbHolderDimensions().pillarOuterSpan).toBeCloseTo(164, 6)
})

test("pcbholder supports dimensional overrides and roundtrips through modelDefinitionSchema", () => {
  const parsed = parseModelString("pcbholder_span180mm_basel240mm_pitchx210mm")
  expect(parsed.fn).toBe("pcbholder")
  if (parsed.fn !== "pcbholder") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(pcbHolderModelPropsSchema.parse({})).toBeDefined()
})

test("pcbholder rejects parenthesized selectors and invalid geometry", () => {
  expect(() => parseModelString("pcbholder_spec(legacy)")).toThrow()
  expect(() =>
    parseModelString("pcbholder_span195mm_jaww10mm_grooved2mm_basel200mm"),
  ).toThrow()
})
