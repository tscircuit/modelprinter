import { expect, test } from "bun:test"
import {
  mp,
  modelDefinitionSchema,
  cableClampModelPropsSchema,
  getCableClampDimensions,
} from "../src"
import { source, props } from "./fixtures/cableclamp-example"

test("cableclamp rejects incompatible mounting geometry", () => {
  for (const invalid of [
    { holeDiameter: 12 },
    { tabLength: 3 },
    { bandWidth: 3 },
  ])
    expect(() =>
      cableClampModelPropsSchema.parse({ ...props, ...invalid }),
    ).toThrow()
})
