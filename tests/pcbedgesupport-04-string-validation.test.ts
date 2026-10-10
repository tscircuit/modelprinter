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
test("pcbedgesupport defaults its explicitly documented 2mm base", () => {
  expect(mp.string(modelString.replace("_bt2mm", "")).json()).toEqual(
    mp.string(modelString).json(),
  )
})
