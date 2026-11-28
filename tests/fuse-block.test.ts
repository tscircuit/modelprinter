import { expect, test } from "bun:test"
import {
  fuseBlockModelPropsSchema,
  getFuseBlockDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("fuseblock resolves 10x38mm cartridge fuse cradle", () => {
  const parsed = parseModelString(
    "fuseblock_fuse(10mm,38mm)_w25mm_l60mm_h18mm_clipod10mm_holes2_hole4mm_hp48mm",
  )
  expect(parsed).toEqual({
    fn: "fuseblock",
    fuseDiameter: 10,
    fuseLength: 38,
    width: 25,
    length: 60,
    height: 18,
    clipOuterDiameter: 10,
    holes: 2,
    holeDiameter: 4,
    holePitch: 48,
  })

  const dims = getFuseBlockDimensions()
  expect(dims.installedTopZ).toBe(23)
  expect(dims.topZ).toBe(18)
})

test("fuseblock supports 6.3x32mm fuse variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "fuseblock_fuse(6.3mm,32mm)_w18mm_l50mm_clipod7mm_hp40mm",
  )
  expect(parsed.fn).toBe("fuseblock")
  if (parsed.fn !== "fuseblock") return
  expect(parsed.fuseDiameter).toBe(6.3)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(fuseBlockModelPropsSchema.parse({}).holes).toBe(2)
})

test("fuseblock rejects unsupported selectors and oversized fuses", () => {
  expect(() => parseModelString("fuseblock_mount(din)")).toThrow()
  expect(() => parseModelString("fuseblock_fuse(10mm,58mm)_l60mm")).toThrow()
})
