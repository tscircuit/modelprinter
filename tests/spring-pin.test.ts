import { expect, test } from "bun:test"
import {
  getSpringPinDimensions,
  modelDefinitionSchema,
  modelprinter,
  mp,
  springPinModelDefinitionSchema,
  springPinModelPropsSchema,
} from "../src"

test("springpin resolves ISO 8752 free-state tubular slotted pin dimensions", () => {
  const parsed = mp.string("springpin_iso8752_holed3mm_l10mm_free").json()
  if (parsed.fn !== "springpin") throw new Error("Unexpected model")
  expect(parsed).toEqual({
    fn: "springpin",
    iso8752: true,
    holeDiameter: 3,
    length: 10,
    free: true,
  })
  expect(mp.string("springpin_holed3mm_l10mm").json()).toEqual(parsed)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(springPinModelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(modelprinter.getModelNames()).toContain("springpin")

  const dims = getSpringPinDimensions({ holeDiameter: 3, length: 10 })
  expect(dims.freeOuterDiameter).toBe(3.4)
  expect(dims.wallThickness).toBe(0.6)
  expect(dims.freeInnerDiameter).toBeCloseTo(2.2, 9)
  expect(dims.slotWidth).toBe(0.6)
  expect(dims.chamferLength).toBe(0.5)
  expect(dims.bearingZ).toBe(0)
  expect(dims.topZ).toBe(10)
})

test("springpin normalizes units, aliases and schema roundtrips", () => {
  const m6 = mp
    .string("SPRINGPIN_ISO8752_HOLEDIAMETER0.6CM_LENGTH2.4CM_FREE")
    .json()
  if (m6.fn !== "springpin") throw new Error("Unexpected model")
  expect(m6).toEqual({
    fn: "springpin",
    iso8752: true,
    holeDiameter: 6,
    length: 24,
    free: true,
  })
  const { fn, ...props } = m6
  expect(springPinModelPropsSchema.parse(props)).toEqual(props)
})

test("springpin rejects legacy selectors, unsupported diameters and untabulated lengths", () => {
  for (const badStr of [
    "springpin3",
    "springpin",
    "springpin_standard(iso8752)_holed3mm_l10mm",
    "springpin_holed3mm_l10mm_state(free)",
    "springpin_iso8752(true)_holed3mm_l10mm",
    "springpin_holed3mm_l10mm_free(true)",
    "springpin_iso8752_iso8752_holed3mm_l10mm",
    "springpin_holed3.5mm_l10mm",
    "springpin_holed3mm_l11mm",
    "springpin_holed10mm_l4mm",
    "springpin_holed3mm_l10mm_unknown1",
  ]) {
    expect(() => mp.string(badStr).json()).toThrow()
  }

  for (const badProps of [
    { holeDiameter: 3.5, length: 10 },
    { holeDiameter: 10, length: 4 },
    { holeDiameter: 3, length: 10, free: false },
    { holeDiameter: 3, length: 10, standard: "iso8752" },
  ]) {
    expect(springPinModelPropsSchema.safeParse(badProps).success).toBe(false)
  }
})
