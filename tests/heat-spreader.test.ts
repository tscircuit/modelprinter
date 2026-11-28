import { expect, test } from "bun:test"
import {
  getHeatSpreaderDimensions,
  heatSpreaderModelPropsSchema,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("heatspreader resolves 50x50x3mm stepped boss spreader plate", () => {
  const parsed = parseModelString(
    "heatspreader_w50mm_l50mm_t3mm_boss(20mm,20mm,2mm)_holes4_hole3mm_countersink6mm_hp(40mm,40mm)",
  )
  expect(parsed).toEqual({
    fn: "heatspreader",
    width: 50,
    length: 50,
    thickness: 3,
    bossWidth: 20,
    bossLength: 20,
    bossHeight: 2,
    holes: 4,
    holeDiameter: 3,
    countersinkDiameter: 6,
    holePitchX: 40,
    holePitchY: 40,
  })
  expect(getHeatSpreaderDimensions().overallHeight).toBe(5)
})

test("heatspreader supports 60x60mm variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "heatspreader_w60mm_l60mm_boss(25mm,25mm,2.5mm)_hp(48mm,48mm)",
  )
  expect(parsed.fn).toBe("heatspreader")
  if (parsed.fn !== "heatspreader") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(heatSpreaderModelPropsSchema.parse({}).holes).toBe(4)
})

test("heatspreader rejects colliding bosses and unsupported selectors", () => {
  expect(() => parseModelString("heatspreader_shape(square)")).toThrow()
  expect(() =>
    parseModelString("heatspreader_boss(36mm,36mm,2mm)_hp(40mm,40mm)"),
  ).toThrow()
})
