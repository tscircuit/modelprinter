import type { z } from "zod"
import {
  type ClevisPinSizeKey,
  clevisPinNominalLengths,
  clevisPinSpecs,
} from "./table"

export interface ClevisPinRawProps {
  iso2341: true
  formB: true
  diameter: number
  length: number
}

const sizeKeys = Object.keys(clevisPinSpecs) as ClevisPinSizeKey[]

export function validateClevisPinProps(
  props: ClevisPinRawProps,
  context: z.RefinementCtx,
) {
  const matchedKey = sizeKeys.find(
    (key) => Math.abs(clevisPinSpecs[key].diameter - props.diameter) <= 1e-9,
  )
  if (!matchedKey) {
    context.addIssue({
      code: "custom",
      path: ["diameter"],
      message:
        "Diameter must be a supported ISO 2341 nominal clevis-pin size (3 through 16 mm)",
    })
    return
  }
  const spec = clevisPinSpecs[matchedKey]
  if (
    !clevisPinNominalLengths.some(
      (nominal) => Math.abs(nominal - props.length) <= 1e-9,
    )
  ) {
    context.addIssue({
      code: "custom",
      path: ["length"],
      message:
        "Length must be a tabulated ISO 2341 nominal value from 8 through 100 mm",
    })
  }
  if (props.length < 2 * spec.diameter) {
    context.addIssue({
      code: "custom",
      path: ["length"],
      message:
        "Under-head shank length must be at least twice the nominal pin diameter",
    })
  }
}
