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
test("tslotendcap rejects missing, duplicate, unknown and partially parsed tokens", () => {
  for (const suffix of [
    "",
    "typo1mm",
    "constructor1",
    "w1mm",
    "width1mm",
    "w(1mm)",
    "w1mmjunk",
  ])
    expect(() => mp.string(`${source}_${suffix}`).json()).toThrow()
  expect(() => mp.string("tslotendcap").json()).toThrow()
  for (const value of [0, -1, Infinity, NaN, 1e308, "1e2", "2mmjunk", "(2mm)"])
    expect(() =>
      tSlotEndCapModelPropsSchema.parse({ ...props, width: value }),
    ).toThrow()
  expect(() =>
    tSlotEndCapModelPropsSchema.parse({ ...props, unknown: true }),
  ).toThrow()
})
