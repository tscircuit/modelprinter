import { expect, test } from "bun:test"
import { mp, modelDefinitionSchema } from "../src"
import { props, source } from "./fixtures/slottedchannel"
test("slottedchannel 1: public parser and definition schema agree", () => {
  expect(mp.string(source).json()).toEqual({ fn: "slottedchannel", ...props })
  expect(
    modelDefinitionSchema.parse({ fn: "slottedchannel", ...props }),
  ).toEqual({ fn: "slottedchannel", ...props })
})
