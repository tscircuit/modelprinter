import { capNutDimensions } from "./table"
import type { CapNutRawProps } from "./validate"

export function normalizeCapNutProps<T extends CapNutRawProps>(props: T) {
  return {
    ...props,
    threadPitch: capNutDimensions[props.metricSize].threadPitch,
  }
}
