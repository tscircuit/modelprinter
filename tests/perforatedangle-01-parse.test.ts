import { expect, test } from "bun:test"
import { mp, modelDefinitionSchema } from "../src"
import { props, source } from "./fixtures/perforatedangle"
test("perforatedangle 1: public parser and definition schema agree", () => {
  expect(mp.string(source).json()).toEqual({ fn: "perforatedangle", ...props })
  expect(
    modelDefinitionSchema.parse({ fn: "perforatedangle", ...props }),
  ).toEqual({ fn: "perforatedangle", ...props })
})
