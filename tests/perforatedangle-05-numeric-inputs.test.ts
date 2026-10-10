import { expect, test } from "bun:test"
import { perforatedAngleModelPropsSchema } from "../src"
import { props } from "./fixtures/perforatedangle"
test("perforatedangle 5: invalid numeric inputs and extra keys are rejected", () => {
  for (const value of [0, -1, Infinity, NaN, "2mmjunk", "1e2", "(2mm)"])
    expect(() =>
      perforatedAngleModelPropsSchema.parse({ ...props, width: value }),
    ).toThrow()
  expect(() =>
    perforatedAngleModelPropsSchema.parse({ ...props, extra: true }),
  ).toThrow()
})
