import { expect, test } from "bun:test"
import {
  mp,
  modelDefinitionSchema,
  pcbCornerClipModelPropsSchema,
  getPcbCornerClipDimensions,
} from "../src"
import { source, props } from "./fixtures/pcbcornerclip-example"

test("pcbcornerclip rejects incompatible mounting geometry", () => {
  for (const invalid of [
    { wallThickness: 8 },
    { grooveDepth: 3 },
    { slotBottomZ: 1 },
    { boardThickness: 5 },
    { holeDiameter: 10 },
  ])
    expect(() =>
      pcbCornerClipModelPropsSchema.parse({ ...props, ...invalid }),
    ).toThrow()
})
