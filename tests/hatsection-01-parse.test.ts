import { expect, test } from "bun:test"
import { mp, modelDefinitionSchema } from "../src"
import { props, source } from "./fixtures/hatsection"
test("hatsection 1: public parser and definition schema agree", () => {
  expect(mp.string(source).json()).toEqual({ fn: "hatsection", ...props })
  expect(modelDefinitionSchema.parse({ fn: "hatsection", ...props })).toEqual({
    fn: "hatsection",
    ...props,
  })
})
