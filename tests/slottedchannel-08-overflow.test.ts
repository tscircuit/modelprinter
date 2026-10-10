import { expect, test } from "bun:test"
import { slottedChannelModelPropsSchema } from "../src"
import { props } from "./fixtures/slottedchannel"
test("slottedchannel 8: overflowing dimensions are rejected", () => {
  expect(() =>
    slottedChannelModelPropsSchema.parse({ ...props, width: 1e200 }),
  ).toThrow()
})
