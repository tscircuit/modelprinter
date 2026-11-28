import { expect, test } from "bun:test"
import {
  getRoundNutDimensions,
  modelDefinitionSchema,
  parseModelString,
  roundNutModelPropsSchema,
} from "../src"

test("roundnut resolves M10 20x6mm 4-slot spanner nut", () => {
  const parsed = parseModelString(
    "roundnut_custom_m10_od20mm_h6mm_slots4_slotw2mm_slotdepth2mm_axialslots_throughbore",
  )
  expect(parsed).toEqual({
    fn: "roundnut",
    custom: true,
    thread: "m10",
    outerDiameter: 20,
    height: 6,
    slots: 4,
    slotWidth: 2,
    slotDepth: 2,
    axialSlots: true,
    throughBore: true,
  })
  expect(getRoundNutDimensions().rootRingDiameter).toBe(16)
})

test("roundnut supports M12 6-slot variant and schema roundtrip", () => {
  const parsed = parseModelString("roundnut_M12_od26mm_h7mm_slots6")
  expect(parsed.fn).toBe("roundnut")
  if (parsed.fn !== "roundnut") return
  expect(parsed.thread).toBe("m12")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(roundNutModelPropsSchema.parse({}).axialSlots).toBe(true)
})

test("roundnut rejects legacy selectors and deep slots", () => {
  expect(() =>
    parseModelString("roundnut_slotform(axial)_bore(through)"),
  ).toThrow()
  expect(() => parseModelString("roundnut_m10_od20mm_slotdepth5mm")).toThrow()
})
