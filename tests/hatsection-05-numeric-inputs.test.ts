import { expect, test } from "bun:test"
import { hatSectionModelPropsSchema } from "../src"
import { props } from "./fixtures/hatsection"
test("hatsection 5: invalid numeric inputs and extra keys are rejected", () => {
  for (const value of [0, -1, Infinity, NaN, "2mmjunk", "1e2", "(2mm)"])
    expect(() =>
      hatSectionModelPropsSchema.parse({ ...props, crownWidth: value }),
    ).toThrow()
  expect(() =>
    hatSectionModelPropsSchema.parse({ ...props, extra: true }),
  ).toThrow()
})
