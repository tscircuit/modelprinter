import { levelingFootThreads } from "./table"
import type { LevelingFootRawProps } from "./validate"

export function normalizeLevelingFootProps<T extends LevelingFootRawProps>(
  props: T,
) {
  return {
    ...props,
    threadPitch: levelingFootThreads[props.metricSize].threadPitch,
  }
}
