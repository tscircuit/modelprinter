import {
  type ClevisPinSizeKey,
  clevisPinNominalLengths,
  clevisPinSpecs,
} from "./table"
import type { ClevisPinRawProps } from "./validate"

const sizeKeys = Object.keys(clevisPinSpecs) as ClevisPinSizeKey[]

export function normalizeClevisPinProps<T extends ClevisPinRawProps>(props: T) {
  const matchedKey = sizeKeys.find(
    (key) => Math.abs(clevisPinSpecs[key].diameter - props.diameter) <= 1e-9,
  )
  const spec = clevisPinSpecs[matchedKey ?? "6"]
  const canonicalLength =
    clevisPinNominalLengths.find(
      (nominal) => Math.abs(nominal - props.length) <= 1e-9,
    ) ?? props.length
  return {
    ...props,
    diameter: spec.diameter,
    length: canonicalLength,
  }
}
