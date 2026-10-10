import { expect, test } from "bun:test"
import { slottedChannelModelPropsSchema } from "../src"
import { props } from "./fixtures/slottedchannel"
test("slottedchannel 5: invalid numeric inputs and extra keys are rejected", () => {
  for (const value of [0, -1, Infinity, NaN, "2mmjunk", "1e2", "(2mm)"])
    expect(() =>
      slottedChannelModelPropsSchema.parse({ ...props, width: value }),
    ).toThrow()
  expect(() =>
    slottedChannelModelPropsSchema.parse({ ...props, extra: true }),
  ).toThrow()
})
