import { z } from "zod"

export const bridgeHandleThreads = {
  M3: { diameter: 3, threadPitch: 0.5, threadDepth: 6 },
  M4: { diameter: 4, threadPitch: 0.7, threadDepth: 8 },
  M5: { diameter: 5, threadPitch: 0.8, threadDepth: 10 },
  M6: { diameter: 6, threadPitch: 1, threadDepth: 12 },
  M8: { diameter: 8, threadPitch: 1.25, threadDepth: 16 },
  M10: { diameter: 10, threadPitch: 1.5, threadDepth: 20 },
  M12: { diameter: 12, threadPitch: 1.75, threadDepth: 24 },
} as const

export const bridgeHandleMetricSizeSchema = z.enum([
  "M3",
  "M4",
  "M5",
  "M6",
  "M8",
  "M10",
  "M12",
])

export type BridgeHandleMetricSize = z.output<
  typeof bridgeHandleMetricSizeSchema
>
