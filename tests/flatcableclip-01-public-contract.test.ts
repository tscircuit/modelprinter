import { test, expect } from "bun:test"
import {
  mp,
  modelprinter,
  modelDefinitionSchema,
  flatCableClipModelPropsSchema,
  flatCableClipModelDefinitionSchema,
  getFlatCableClipDimensions,
} from "../src"
import { props, modelString } from "./fixtures/flatcableclip-case"
test("flatcableclip resolves its strict public contract and fitting datums", () => {
  const model = mp.string(modelString).json()
  if (model.fn !== "flatcableclip") throw new Error("Unexpected model family")
  expect(model).toEqual({ fn: "flatcableclip", ...props })
  expect(modelprinter.getModelNames()).toContain("flatcableclip")
  expect(flatCableClipModelPropsSchema.parse(props)).toEqual(props)
  expect(flatCableClipModelDefinitionSchema.parse(model)).toEqual(model)
  expect(modelDefinitionSchema.parse(model)).toEqual(model)
  expect(mp.string(modelString.toUpperCase()).json()).toEqual(model)
  expect(getFlatCableClipDimensions(props).bounds).toEqual([
    [-19.5, -5, 0],
    [19.5, 5, 5],
  ])
})
