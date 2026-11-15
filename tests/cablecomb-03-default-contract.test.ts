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
test("cablecomb defaults to two mounting holes", () => {
  expect(mp.string(modelString.replace("_holes2", "")).json()).toEqual(
    mp.string(modelString).json(),
  )
})
