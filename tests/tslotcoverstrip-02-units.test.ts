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
test("tslotcoverstrip accepts full decimal units and case-insensitive strings", () => {
  expect(mp.string(source.toUpperCase()).json()).toEqual({
    fn: "tslotcoverstrip",
    ...props,
  })
  expect(
    tSlotCoverStripModelPropsSchema.parse({ ...props, length: "10.0cm" }),
  ).toEqual(props)
  expect(
    tSlotCoverStripModelPropsSchema.parse({ ...props, length: "+100mm" }),
  ).toEqual(props)
})
