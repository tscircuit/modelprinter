import { expect, test } from "bun:test"
import { mp, modelDefinitionSchema } from "../src"
import { props, source } from "./fixtures/tslotpanelretainer"
test("tslotpanelretainer 1: public parser and definition schema agree", () => {
  expect(mp.string(source).json()).toEqual({
    fn: "tslotpanelretainer",
    ...props,
  })
  expect(
    modelDefinitionSchema.parse({ fn: "tslotpanelretainer", ...props }),
  ).toEqual({ fn: "tslotpanelretainer", ...props })
})
