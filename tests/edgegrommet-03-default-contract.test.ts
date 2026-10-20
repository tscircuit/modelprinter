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
test("edgegrommet defaults its 1mm outer edge radius", () => {
  expect(mp.string(modelString.replace("_corner1mm", "")).json()).toEqual(
    mp.string(modelString).json(),
  )
})
