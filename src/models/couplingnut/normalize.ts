import { couplingNutDimensions } from "./table"
import type { CouplingNutRawProps } from "./validate"

export function normalizeCouplingNutProps<T extends CouplingNutRawProps>(
  props: T,
) {
  const spec = couplingNutDimensions[props.metricSize]
  return {
    ...props,
    length: spec.length,
    acrossFlats: spec.acrossFlats,
    threadPitch: spec.threadPitch,
  }
}
