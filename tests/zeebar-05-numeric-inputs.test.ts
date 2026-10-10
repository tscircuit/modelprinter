import { expect, test } from "bun:test"
import { zeeBarModelPropsSchema } from "../src"
import { props } from "./fixtures/zeebar"
test("zeebar 5: invalid numeric inputs and extra keys are rejected", () => {
  for (const value of [0, -1, Infinity, NaN, "2mmjunk", "1e2", "(2mm)"])
    expect(() =>
      zeeBarModelPropsSchema.parse({ ...props, height: value }),
    ).toThrow()
  expect(() =>
    zeeBarModelPropsSchema.parse({ ...props, extra: true }),
  ).toThrow()
})
