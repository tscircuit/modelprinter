import { expect, test } from "bun:test"
import {
  mp,
  modelDefinitionSchema,
  hollowShaftModelPropsSchema,
  getHollowShaftDimensions,
} from "../src"
const source = "hollowshaft_od20mm_id12mm_l200mm_style(roundtube)_endchamfer1mm"
const props = {
  outerDiameter: 20,
  innerDiameter: 12,
  length: 200,
  endChamfer: 1,
  roundTube: true,
} as const
test("hollowshaft rejects impossible fitting and feature dimensions", () => {
  for (const invalid of [
    { innerDiameter: 20 },
    { endChamfer: 2 },
    { length: 2 },
  ])
    expect(() =>
      hollowShaftModelPropsSchema.parse({ ...props, ...invalid }),
    ).toThrow()
})
