import { test, expect } from "bun:test"
import { mp, pcbEdgeSupportModelPropsSchema } from "../src"
import { props, modelString } from "./fixtures/pcbedgesupport-case"
test("pcbedgesupport rejects malformed, duplicated and incomplete model strings", () => {
  for (const source of [
    modelString + "_typo1mm",
    modelString + "_w1mm",
    modelString + "_width1mm",
    modelString + "_",
    modelString.replace("w20mm", "w"),
    modelString.replace("w20mm", "w1e3mm"),
    "pcbedgesupport",
    modelString.replace("pcbedgesupport", "pcbedgesupport(custom)"),
  ])
    expect(() => mp.string(source).json()).toThrow()
})
