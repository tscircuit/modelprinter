import { expect, test } from "bun:test"
import {
  mp,
  modelDefinitionSchema,
  keyedShaftModelPropsSchema,
  getKeyedShaftDimensions,
} from "../src"
const source =
  "keyedshaft_d20mm_l250mm_keyw6mm_keydepth3mm_keyl200mm_endchamfer1mm"
const props = {
  diameter: 20,
  length: 250,
  keyWidth: 6,
  keyDepth: 3,
  keyLength: 200,
  endChamfer: 1,
} as const
test("keyedshaft rejects impossible fitting and feature dimensions", () => {
  for (const invalid of [
    { keyWidth: 20 },
    { keyDepth: 10 },
    { keyDepth: 0.1 },
    { keyLength: 249 },
    { endChamfer: 10 },
  ])
    expect(() =>
      keyedShaftModelPropsSchema.parse({ ...props, ...invalid }),
    ).toThrow()
})
