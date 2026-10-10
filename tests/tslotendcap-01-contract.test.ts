import { expect, test } from "bun:test"
import {
  mp,
  modelDefinitionSchema,
  tSlotEndCapModelPropsSchema,
  getTSlotEndCapDimensions,
} from "../src"
const source =
  "tslotendcap_w20mm_h20mm_t3mm_corner1mm_pinod3.8mm_pinl6mm_pins1_centered"
const props = {
  width: 20,
  height: 20,
  thickness: 3,
  cornerRadius: 1,
  pinDiameter: 3.8,
  pinLength: 6,
  pinCount: 1,
  centered: true,
} as const
test("tslotendcap complete roadmap contract and public schema roundtrip", () => {
  const expected = { fn: "tslotendcap" as const, ...props }
  expect(mp.string(source).json()).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  expect(tSlotEndCapModelPropsSchema.parse(props)).toEqual(props)
  expect(
    getTSlotEndCapDimensions(props).size.every(
      (value) => value > 0 && Number.isFinite(value),
    ),
  ).toBe(true)
})
