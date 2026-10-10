import { expect, test } from "bun:test"
import { zeeBarModelPropsSchema } from "../src"
import { props } from "./fixtures/zeebar"
test("zeebar 8: overflowing dimensions are rejected", () => {
  expect(() =>
    zeeBarModelPropsSchema.parse({ ...props, height: 1e200 }),
  ).toThrow()
})
