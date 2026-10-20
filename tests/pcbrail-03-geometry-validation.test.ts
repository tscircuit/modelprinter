import { expect, test } from "bun:test"
import {
  mp,
  modelDefinitionSchema,
  pcbRailModelPropsSchema,
  getPcbRailDimensions,
} from "../src"
import { source, props } from "./fixtures/pcbrail-example"

test("pcbrail rejects incompatible mounting geometry", () => {
  for (const invalid of [
    { wallThickness: 12 },
    { slotDepth: 3 },
    { slotBottomZ: 1 },
    { slotWidth: 4 },
    { holePitch: 82 },
    { holePitch: 94 },
    { tabWidth: 2 },
  ])
    expect(() =>
      pcbRailModelPropsSchema.parse({ ...props, ...invalid }),
    ).toThrow()
})
