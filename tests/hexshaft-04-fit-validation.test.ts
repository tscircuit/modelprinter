import { expect, test } from "bun:test"
import {
  mp,
  modelDefinitionSchema,
  hexShaftModelPropsSchema,
  getHexShaftDimensions,
} from "../src"
const source = "hexshaft_af12mm_l200mm_profile(regularhex)_endchamfer1mm"
const props = {
  acrossFlats: 12,
  length: 200,
  endChamfer: 1,
  regularHex: true,
} as const
test("hexshaft rejects impossible fitting and feature dimensions", () => {
  for (const invalid of [{ endChamfer: 6 }, { length: 2 }])
    expect(() =>
      hexShaftModelPropsSchema.parse({ ...props, ...invalid }),
    ).toThrow()
})
