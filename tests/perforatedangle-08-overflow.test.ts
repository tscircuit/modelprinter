import { expect, test } from "bun:test"
import { perforatedAngleModelPropsSchema } from "../src"
import { props } from "./fixtures/perforatedangle"
test("perforatedangle 8: overflowing dimensions are rejected", () => {
  expect(() =>
    perforatedAngleModelPropsSchema.parse({ ...props, width: 1e200 }),
  ).toThrow()
})
