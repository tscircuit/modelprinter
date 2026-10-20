import { expect, test } from "bun:test"
import {
  mp,
  modelDefinitionSchema,
  pottingBoxModelPropsSchema,
  getPottingBoxDimensions,
} from "../src"
import { source, props } from "./fixtures/pottingbox-example"

test("pottingbox rejects incompatible mounting geometry", () => {
  for (const invalid of [
    { wallThickness: 20 },
    { floorThickness: 25 },
    { earWidth: 2 },
    { holePitch: 62 },
    { holePitch: 78 },
  ])
    expect(() =>
      pottingBoxModelPropsSchema.parse({ ...props, ...invalid }),
    ).toThrow()
})
