import { wingNutDimensions } from "./table"
import type { WingNutRawProps } from "./validate"

export function normalizeWingNutProps<T extends WingNutRawProps>(props: T) {
  return {
    ...props,
    threadPitch: wingNutDimensions[props.metricSize].threadPitch,
  }
}
