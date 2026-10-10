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
test("tslotcoverstrip value-free flags reject repeated and conflicting selectors", () => {
  expect(
    mp
      .string(
        "tslotcoverstrip_l100mm_w8mm_t1mm_stemw5.8mm_stemh2mm_barbw6.2mm_tee",
      )
      .json(),
  ).toEqual({ fn: "tslotcoverstrip", ...props })
  expect(() =>
    mp
      .string(
        "tslotcoverstrip_l100mm_w8mm_t1mm_stemw5.8mm_stemh2mm_barbw6.2mm_tee_tee",
      )
      .json(),
  ).toThrow()
  expect(() =>
    mp
      .string(
        "tslotcoverstrip_l100mm_w8mm_t1mm_stemw5.8mm_stemh2mm_barbw6.2mm_tee(true)",
      )
      .json(),
  ).toThrow()
  expect(() => mp.string(`${source}_tee`).json()).toThrow()
})
