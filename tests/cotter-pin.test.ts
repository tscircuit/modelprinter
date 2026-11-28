import { expect, test } from "bun:test"
import {
  cotterPinModelDefinitionSchema,
  cotterPinModelPropsSchema,
  getCotterPinDimensions,
  modelDefinitionSchema,
  modelprinter,
  mp,
} from "../src"

test("cotterpin resolves ISO 1234 looped head and unequal straight leg dimensions", () => {
  const parsed = mp.string("cotterpin_iso1234_nominal2mm_l25mm_straight").json()
  if (parsed.fn !== "cotterpin") throw new Error("Unexpected model")
  expect(parsed).toEqual({
    fn: "cotterpin",
    iso1234: true,
    nominalSize: 2,
    length: 25,
    straight: true,
  })
  expect(mp.string("cotterpin_nominal2mm_l25mm").json()).toEqual(parsed)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(cotterPinModelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(modelprinter.getModelNames()).toContain("cotterpin")

  const dims = getCotterPinDimensions({ nominalSize: 2, length: 25 })
  expect(dims.shankDiameter).toBe(1.8)
  expect(dims.eyeOuterDiameter).toBe(3.6)
  expect(dims.eyeHeight).toBe(4)
  expect(dims.shortLegLength).toBe(25)
  expect(dims.longLegLength).toBe(27)
  expect(dims.overallLength).toBe(31)
  expect(dims.eyeTopZ).toBe(4)
  expect(dims.shortLegTipZ).toBe(-25)
  expect(dims.longLegTipZ).toBe(-27)
})

test("cotterpin normalizes units, aliases and schema roundtrips", () => {
  const m32 = mp
    .string("COTTERPIN_ISO1234_NOMINALSIZE0.32CM_LENGTH3.2CM_STRAIGHT")
    .json()
  if (m32.fn !== "cotterpin") throw new Error("Unexpected model")
  expect(m32).toEqual({
    fn: "cotterpin",
    iso1234: true,
    nominalSize: 3.2,
    length: 32,
    straight: true,
  })
  const { fn, ...props } = m32
  expect(cotterPinModelPropsSchema.parse(props)).toEqual(props)
})

test("cotterpin rejects legacy selectors, unsupported sizes and short lengths", () => {
  for (const badStr of [
    "cotterpin2",
    "cotterpin",
    "cotterpin_standard(iso1234)_nominal2mm_l25mm",
    "cotterpin_nominal2mm_l25mm_state(straight)",
    "cotterpin_iso1234(true)_nominal2mm_l25mm",
    "cotterpin_nominal2mm_l25mm_straight(true)",
    "cotterpin_iso1234_iso1234_nominal2mm_l25mm",
    "cotterpin_nominal3mm_l25mm",
    "cotterpin_nominal2mm_l23mm",
    "cotterpin_nominal8mm_l10mm",
    "cotterpin_nominal2mm_l25mm_unknown1",
  ]) {
    expect(() => mp.string(badStr).json()).toThrow()
  }

  for (const badProps of [
    { nominalSize: 3, length: 25 },
    { nominalSize: 8, length: 10 },
    { nominalSize: 2, length: 25, straight: false },
    { nominalSize: 2, length: 25, standard: "iso1234" },
  ]) {
    expect(cotterPinModelPropsSchema.safeParse(badProps).success).toBe(false)
  }
})
