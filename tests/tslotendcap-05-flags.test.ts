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
test("tslotendcap value-free flags reject repeated and conflicting selectors", () => {
  expect(
    mp
      .string(
        "tslotendcap_w20mm_h20mm_t3mm_corner1mm_pinod3.8mm_pinl6mm_pins1_centered",
      )
      .json(),
  ).toEqual({ fn: "tslotendcap", ...props })
  expect(() =>
    mp
      .string(
        "tslotendcap_w20mm_h20mm_t3mm_corner1mm_pinod3.8mm_pinl6mm_pins1_centered_centered",
      )
      .json(),
  ).toThrow()
  expect(() =>
    mp
      .string(
        "tslotendcap_w20mm_h20mm_t3mm_corner1mm_pinod3.8mm_pinl6mm_pins1_centered(true)",
      )
      .json(),
  ).toThrow()
})
