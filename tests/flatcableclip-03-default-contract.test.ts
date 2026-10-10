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
test("flatcableclip defaults to two mounting holes", () => {
  expect(mp.string(modelString.replace("_holes2", "")).json()).toEqual(
    mp.string(modelString).json(),
  )
})
