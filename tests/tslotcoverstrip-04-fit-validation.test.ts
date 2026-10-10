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
test("tslotcoverstrip rejects impossible fitting and feature dimensions", () => {
  for (const invalid of [
    { stemWidth: 6.2 },
    { barbWidth: 8 },
    { barbHeight: 2 },
  ])
    expect(() =>
      tSlotCoverStripModelPropsSchema.parse({ ...props, ...invalid }),
    ).toThrow()
})
