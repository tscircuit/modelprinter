import { expect, test } from "bun:test"
import { mp, slottedChannelModelPropsSchema } from "../src"
import { props, source } from "./fixtures/slottedchannel"
test("slottedchannel 2: aliases, case, and mixed length units normalize", () => {
  expect(mp.string(source.toUpperCase()).json()).toEqual({
    fn: "slottedchannel",
    ...props,
  })
  expect(
    slottedChannelModelPropsSchema.parse({ ...props, width: "4.0cm" }),
  ).toEqual(props)
})
