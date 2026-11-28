import { z } from "zod"

export const camFollowerThreads = {
  M5: { diameter: 5, threadPitch: 0.8 },
  M6: { diameter: 6, threadPitch: 1 },
  M8: { diameter: 8, threadPitch: 1.25 },
  M10: { diameter: 10, threadPitch: 1.5 },
  M12: { diameter: 12, threadPitch: 1.75 },
  M16: { diameter: 16, threadPitch: 2 },
  M20: { diameter: 20, threadPitch: 2.5 },
} as const

export const camFollowerMetricSizeSchema = z.enum([
  "M5",
  "M6",
  "M8",
  "M10",
  "M12",
  "M16",
  "M20",
])

export type CamFollowerMetricSize = z.output<typeof camFollowerMetricSizeSchema>
