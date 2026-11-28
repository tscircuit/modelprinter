import { expect, test } from "bun:test"
import {
  getStrapClampDimensions,
  modelDefinitionSchema,
  parseModelString,
  strapClampModelPropsSchema,
} from "../src"

test("strapclamp resolves canonical roadmap contract parameters", () => {
  const parsed = parseModelString(
    "strapclamp_l100mm_w25mm_t10mm_slotl40mm_slotw10mm_nosel15mm_nosedrop3mm_heell20mm_heelh10mm",
  )
  expect(parsed).toEqual({
    fn: "strapclamp",
    length: 100,
    width: 25,
    thickness: 10,
    slotLength: 40,
    slotWidth: 10,
    noseLength: 15,
    noseDrop: 3,
    heelLength: 20,
    heelHeight: 10,
  })
  expect(getStrapClampDimensions().noseTipThickness).toBeCloseTo(7, 6)
})

test("strapclamp supports dimensional overrides and roundtrips through modelDefinitionSchema", () => {
  const parsed = parseModelString("strapclamp_l130mm_w32mm_slotl55mm_slotw12mm")
  expect(parsed.fn).toBe("strapclamp")
  if (parsed.fn !== "strapclamp") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(strapClampModelPropsSchema.parse({})).toBeDefined()
})

test("strapclamp rejects parenthesized selectors and invalid geometry", () => {
  expect(() => parseModelString("strapclamp_spec(legacy)")).toThrow()
  expect(() => parseModelString("strapclamp_w25mm_slotw22mm")).toThrow()
})
