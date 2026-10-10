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
test("cableclip defaults its retaining arc", () => {
  expect(mp.string(modelString.replace("_arc240deg", "")).json()).toEqual(
    mp.string(modelString).json(),
  )
})
