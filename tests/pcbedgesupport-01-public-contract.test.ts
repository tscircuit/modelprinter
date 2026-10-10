import { test, expect } from "bun:test"
import {
  mp,
  modelprinter,
  modelDefinitionSchema,
  pcbEdgeSupportModelPropsSchema,
  pcbEdgeSupportModelDefinitionSchema,
  getPcbEdgeSupportDimensions,
} from "../src"
import { props, modelString } from "./fixtures/pcbedgesupport-case"
test("pcbedgesupport resolves its strict public contract and fitting datums", () => {
  const model = mp.string(modelString).json()
  if (model.fn !== "pcbedgesupport") throw new Error("Unexpected model family")
  expect(model).toEqual({ fn: "pcbedgesupport", ...props })
  expect(modelprinter.getModelNames()).toContain("pcbedgesupport")
  expect(pcbEdgeSupportModelPropsSchema.parse(props)).toEqual(props)
  expect(pcbEdgeSupportModelDefinitionSchema.parse(model)).toEqual(model)
  expect(modelDefinitionSchema.parse(model)).toEqual(model)
  expect(mp.string(modelString.toUpperCase()).json()).toEqual(model)
  expect(getPcbEdgeSupportDimensions(props).bounds).toEqual([
    [-10, -6, 0],
    [10, 6, 15],
  ])
})
