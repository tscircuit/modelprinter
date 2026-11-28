import { expect, test } from "bun:test"
import {
  clevisPinModelDefinitionSchema,
  clevisPinModelPropsSchema,
  getClevisPinDimensions,
  modelDefinitionSchema,
  modelprinter,
  mp,
} from "../src"

test("clevispin resolves ISO 2341 Form B headed clevis pin and split-pin hole", () => {
  const parsed = mp.string("clevispin_iso2341_formb_d6mm_l30mm").json()
  if (parsed.fn !== "clevispin") throw new Error("Unexpected model")
  expect(parsed).toEqual({
    fn: "clevispin",
    iso2341: true,
    formB: true,
    diameter: 6,
    length: 30,
  })
  expect(mp.string("clevispin_d6mm_l30mm").json()).toEqual(parsed)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(clevisPinModelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(modelprinter.getModelNames()).toContain("clevispin")

  const dims = getClevisPinDimensions({ diameter: 6, length: 30 })
  expect(dims.headDiameter).toBe(10)
  expect(dims.headHeight).toBe(2)
  expect(dims.splitPinHoleDiameter).toBe(1.6)
  expect(dims.gripLength).toBeCloseTo(26, 9)
  expect(dims.overallLength).toBe(32)
  expect(dims.headTopZ).toBe(2)
  expect(dims.splitPinHoleZ).toBeCloseTo(-26.8, 9)
  expect(dims.shankTipZ).toBe(-30)
})

test("clevispin normalizes units, aliases and schema roundtrips", () => {
  const d10 = mp.string("CLEVISPIN_ISO2341_FORMB_DIAMETER1CM_LENGTH4CM").json()
  if (d10.fn !== "clevispin") throw new Error("Unexpected model")
  expect(d10).toEqual({
    fn: "clevispin",
    iso2341: true,
    formB: true,
    diameter: 10,
    length: 40,
  })
  const { fn, ...props } = d10
  expect(clevisPinModelPropsSchema.parse(props)).toEqual(props)
})

test("clevispin rejects legacy selectors, unsupported diameters and short shanks", () => {
  for (const badStr of [
    "clevispin6",
    "clevispin",
    "clevispin_standard(iso2341)_d6mm_l30mm",
    "clevispin_form(b)_d6mm_l30mm",
    "clevispin_iso2341(true)_d6mm_l30mm",
    "clevispin_formb(true)_d6mm_l30mm",
    "clevispin_iso2341_iso2341_d6mm_l30mm",
    "clevispin_d7mm_l30mm",
    "clevispin_d6mm_l25mm",
    "clevispin_d10mm_l14mm",
    "clevispin_d6mm_l30mm_unknown1",
  ]) {
    expect(() => mp.string(badStr).json()).toThrow()
  }

  for (const badProps of [
    { diameter: 7, length: 30 },
    { diameter: 10, length: 14 },
    { diameter: 6, length: 30, formB: false },
    { diameter: 6, length: 30, form: "b" },
  ]) {
    expect(clevisPinModelPropsSchema.safeParse(badProps).success).toBe(false)
  }
})
