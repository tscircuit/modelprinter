import type { z } from "zod"
import {
  type CotterPinSizeKey,
  cotterPinNominalLengths,
  cotterPinSpecs,
} from "./table"

export interface CotterPinRawProps {
  iso1234: true
  nominalSize: number
  length: number
  straight: true
}

const sizeKeys = Object.keys(cotterPinSpecs) as CotterPinSizeKey[]

export function validateCotterPinProps(
  props: CotterPinRawProps,
  context: z.RefinementCtx,
) {
  const matchedKey = sizeKeys.find(
    (key) =>
      Math.abs(cotterPinSpecs[key].nominalSize - props.nominalSize) <= 1e-9,
  )
  if (!matchedKey) {
    context.addIssue({
      code: "custom",
      path: ["nominalSize"],
      message:
        "Nominal size must be a supported ISO 1234 split-pin designation (1.6 through 8 mm)",
    })
    return
  }
  const spec = cotterPinSpecs[matchedKey]
  if (
    !cotterPinNominalLengths.some(
      (nominal) => Math.abs(nominal - props.length) <= 1e-9,
    )
  ) {
    context.addIssue({
      code: "custom",
      path: ["length"],
      message:
        "Length must be a tabulated ISO 1234 nominal value from 6 through 100 mm",
    })
  }
  if (props.length < 2 * spec.nominalSize) {
    context.addIssue({
      code: "custom",
      path: ["length"],
      message: "Working leg length must be at least twice the nominal pin size",
    })
  }
}
