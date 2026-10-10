import { expect, test } from "bun:test"
import {
  mp,
  modelDefinitionSchema,
  tSlotCoverStripModelPropsSchema,
  getTSlotCoverStripDimensions,
} from "../src"
const source =
  "tslotcoverstrip_l100mm_w8mm_t1mm_stemw5.8mm_stemh2mm_barbw6.2mm_profile(tee)"
const props = {
  length: 100,
  width: 8,
  thickness: 1,
  stemWidth: 5.8,
  stemHeight: 2,
  barbWidth: 6.2,
  barbHeight: 0.5,
  tee: true,
} as const
test("tslotcoverstrip rejects missing, duplicate, unknown and partially parsed tokens", () => {
  for (const suffix of [
    "",
    "typo1mm",
    "constructor1",
    "l1mm",
    "length1mm",
    "l(1mm)",
    "l1mmjunk",
  ])
    expect(() => mp.string(`${source}_${suffix}`).json()).toThrow()
  expect(() => mp.string("tslotcoverstrip").json()).toThrow()
  for (const value of [0, -1, Infinity, NaN, 1e308, "1e2", "2mmjunk", "(2mm)"])
    expect(() =>
      tSlotCoverStripModelPropsSchema.parse({ ...props, length: value }),
    ).toThrow()
  expect(() =>
    tSlotCoverStripModelPropsSchema.parse({ ...props, unknown: true }),
  ).toThrow()
})
