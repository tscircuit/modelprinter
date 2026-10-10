import { expect, test } from "bun:test"
import { mp, slottedChannelModelPropsSchema } from "../src"
import { props, source } from "./fixtures/slottedchannel"
test("slottedchannel 7: counts require bounded unitless integers", () => {
  for (const value of [0, -1, 1.5, 257, Infinity])
    expect(() =>
      slottedChannelModelPropsSchema.parse({ ...props, slotCount: value }),
    ).toThrow()
  expect(() => mp.string(source.replace("slots3", "slots3mm")).json()).toThrow()
})
