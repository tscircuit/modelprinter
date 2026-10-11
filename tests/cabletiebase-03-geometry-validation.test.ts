import { expect, test } from "bun:test"
import {
  mp,
  modelDefinitionSchema,
  cableTieBaseModelPropsSchema,
  getCableTieBaseDimensions,
} from "../src"
import { source, props } from "./fixtures/cabletiebase-example"

test("cabletiebase rejects incompatible mounting geometry", () => {
  for (const invalid of [
    { slotWidth: 24 },
    { slotHeight: 4 },
    { holeDiameter: 4 },
  ])
    expect(() =>
      cableTieBaseModelPropsSchema.parse({ ...props, ...invalid }),
    ).toThrow()
})
