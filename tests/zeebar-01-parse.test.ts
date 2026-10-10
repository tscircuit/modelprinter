import { expect, test } from "bun:test"
import { mp, modelDefinitionSchema } from "../src"
import { props, source } from "./fixtures/zeebar"
test("zeebar 1: public parser and definition schema agree", () => {
  expect(mp.string(source).json()).toEqual({ fn: "zeebar", ...props })
  expect(modelDefinitionSchema.parse({ fn: "zeebar", ...props })).toEqual({
    fn: "zeebar",
    ...props,
  })
})
