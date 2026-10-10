import { test, expect } from "bun:test"
import {
  mp,
  modelprinter,
  modelDefinitionSchema,
  cableCombModelPropsSchema,
  cableCombModelDefinitionSchema,
  getCableCombDimensions,
} from "../src"
import { props, modelString } from "./fixtures/cablecomb-case"
test("cablecomb resolves its strict public contract and fitting datums", () => {
  const model = mp.string(modelString).json()
  if (model.fn !== "cablecomb") throw new Error("Unexpected model family")
  expect(model).toEqual({ fn: "cablecomb", ...props })
  expect(modelprinter.getModelNames()).toContain("cablecomb")
  expect(cableCombModelPropsSchema.parse(props)).toEqual(props)
  expect(cableCombModelDefinitionSchema.parse(model)).toEqual(model)
  expect(modelDefinitionSchema.parse(model)).toEqual(model)
  expect(mp.string(modelString.toUpperCase()).json()).toEqual(model)
  expect(getCableCombDimensions(props).bounds).toEqual([
    [-30, -4, 0],
    [30, 4, 10],
  ])
})
