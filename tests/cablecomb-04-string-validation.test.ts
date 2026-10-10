import { test, expect } from "bun:test"
import { mp, cableCombModelPropsSchema } from "../src"
import { props, modelString } from "./fixtures/cablecomb-case"
test("cablecomb rejects malformed, duplicated and incomplete model strings", () => {
  for (const source of [
    modelString + "_typo1mm",
    modelString + "_w1mm",
    modelString + "_width1mm",
    modelString + "_",
    modelString.replace("w60mm", "w"),
    modelString.replace("w60mm", "w1e3mm"),
    "cablecomb",
    modelString.replace("cablecomb", "cablecomb(custom)"),
  ])
    expect(() => mp.string(source).json()).toThrow()
})
