import { camFollowerThreads } from "./table"
import type { CamFollowerRawProps } from "./validate"

export function normalizeCamFollowerProps<T extends CamFollowerRawProps>(
  props: T,
) {
  const spec = camFollowerThreads[props.metricSize]
  return {
    ...props,
    studDiameter: props.studDiameter ?? spec.diameter,
    threadPitch: spec.threadPitch,
  }
}
