import { test, expect } from "bun:test"
import { mp, cableClipModelPropsSchema } from "../src"
import { props, modelString } from "./fixtures/cableclip-case"
test("cableclip rejects malformed, duplicated and incomplete model strings", () => {
  for (const source of [
    modelString + "_typo1mm",
    modelString + "_cable1mm",
    modelString + "_cablediameter1mm",
    modelString + "_",
    modelString.replace("cable6mm", "cable"),
    modelString.replace("cable6mm", "cable1e3mm"),
    "cableclip",
    modelString.replace("cableclip", "cableclip(custom)"),
  ])
    expect(() => mp.string(source).json()).toThrow()
})
