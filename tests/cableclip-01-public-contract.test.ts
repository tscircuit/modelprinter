import { test, expect } from "bun:test"
import {
  mp,
  modelprinter,
  modelDefinitionSchema,
  cableClipModelPropsSchema,
  cableClipModelDefinitionSchema,
  getCableClipDimensions,
} from "../src"
import { props, modelString } from "./fixtures/cableclip-case"
test("cableclip resolves its strict public contract and fitting datums", () => {
  const model = mp.string(modelString).json()
  if (model.fn !== "cableclip") throw new Error("Unexpected model family")
  expect(model).toEqual({ fn: "cableclip", ...props })
  expect(modelprinter.getModelNames()).toContain("cableclip")
  expect(cableClipModelPropsSchema.parse(props)).toEqual(props)
  expect(cableClipModelDefinitionSchema.parse(model)).toEqual(model)
  expect(modelDefinitionSchema.parse(model)).toEqual(model)
  expect(mp.string(modelString.toUpperCase()).json()).toEqual(model)
  expect(getCableClipDimensions(props).bounds).toEqual([
    [-5, -6, 0],
    [15, 6, 10],
  ])
})
