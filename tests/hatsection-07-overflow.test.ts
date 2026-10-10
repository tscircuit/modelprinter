import { expect, test } from "bun:test"
import { hatSectionModelPropsSchema } from "../src"
import { props } from "./fixtures/hatsection"
test("hatsection 8: overflowing dimensions are rejected", () => {
  expect(() =>
    hatSectionModelPropsSchema.parse({ ...props, crownWidth: 1e200 }),
  ).toThrow()
})
