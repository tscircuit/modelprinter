import { test, expect } from "bun:test"
import { mp, edgeGrommetModelPropsSchema } from "../src"
import { props, modelString } from "./fixtures/edgegrommet-case"
test("edgegrommet rejects malformed, duplicated and incomplete model strings", () => {
  for (const source of [
    modelString + "_typo1mm",
    modelString + "_l1mm",
    modelString + "_length1mm",
    modelString + "_",
    modelString.replace("l100mm", "l"),
    modelString.replace("l100mm", "l1e3mm"),
    "edgegrommet",
    modelString.replace("edgegrommet", "edgegrommet(custom)"),
  ])
    expect(() => mp.string(source).json()).toThrow()
})
