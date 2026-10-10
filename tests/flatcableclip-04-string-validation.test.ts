import { test, expect } from "bun:test"
import { mp, flatCableClipModelPropsSchema } from "../src"
import { props, modelString } from "./fixtures/flatcableclip-case"
test("flatcableclip rejects malformed, duplicated and incomplete model strings", () => {
  for (const source of [
    modelString + "_typo1mm",
    modelString + "_iw1mm",
    modelString + "_innerwidth1mm",
    modelString + "_",
    modelString.replace("iw25mm", "iw"),
    modelString.replace("iw25mm", "iw1e3mm"),
    "flatcableclip",
    modelString.replace("flatcableclip", "flatcableclip(custom)"),
  ])
    expect(() => mp.string(source).json()).toThrow()
})
