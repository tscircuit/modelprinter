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
test("pcbedgesupport defaults to two mounting holes", () => {
  expect(mp.string(modelString.replace("_holes2", "")).json()).toEqual(
    mp.string(modelString).json(),
  )
})
