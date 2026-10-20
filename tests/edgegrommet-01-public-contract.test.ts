import { test, expect } from "bun:test"
import {
  mp,
  modelprinter,
  modelDefinitionSchema,
  edgeGrommetModelPropsSchema,
  edgeGrommetModelDefinitionSchema,
  getEdgeGrommetDimensions,
} from "../src"
import { props, modelString } from "./fixtures/edgegrommet-case"
test("edgegrommet resolves its strict public contract and fitting datums", () => {
  const model = mp.string(modelString).json()
  if (model.fn !== "edgegrommet") throw new Error("Unexpected model family")
  expect(model).toEqual({ fn: "edgegrommet", ...props })
  expect(modelprinter.getModelNames()).toContain("edgegrommet")
  expect(edgeGrommetModelPropsSchema.parse(props)).toEqual(props)
  expect(edgeGrommetModelDefinitionSchema.parse(model)).toEqual(model)
  expect(modelDefinitionSchema.parse(model)).toEqual(model)
  expect(mp.string(modelString.toUpperCase()).json()).toEqual(model)
  expect(getEdgeGrommetDimensions(props).bounds).toEqual([
    [-50, -2.5, 0],
    [50, 2.5, 6],
  ])
})
