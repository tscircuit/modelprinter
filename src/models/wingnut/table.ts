import { z } from "zod"

/** DIN 315 rounded-wing nuts (German form), nominal envelope in mm.
 * Reference dimensions: https://www.fasteners.eu/standards/DIN/315/
 */
export const wingNutDimensions = {
  M4: {
    diameter: 4,
    threadPitch: 0.7,
    baseDiameter: 9,
    topBossDiameter: 8,
    bossHeight: 5,
    wingSpan: 20,
    height: 10,
    wingThickness: 2.2,
    mouthDiameter: 4.32,
  },
  M5: {
    diameter: 5,
    threadPitch: 0.8,
    baseDiameter: 11,
    topBossDiameter: 10,
    bossHeight: 6,
    wingSpan: 26,
    height: 13,
    wingThickness: 2.8,
    mouthDiameter: 5.4,
  },
  M6: {
    diameter: 6,
    threadPitch: 1,
    baseDiameter: 13,
    topBossDiameter: 12,
    bossHeight: 8,
    wingSpan: 32,
    height: 16,
    wingThickness: 3.3,
    mouthDiameter: 6.48,
  },
  M8: {
    diameter: 8,
    threadPitch: 1.25,
    baseDiameter: 16,
    topBossDiameter: 14,
    bossHeight: 10,
    wingSpan: 40,
    height: 20,
    wingThickness: 4,
    mouthDiameter: 8.64,
  },
  M10: {
    diameter: 10,
    threadPitch: 1.5,
    baseDiameter: 20,
    topBossDiameter: 18,
    bossHeight: 12,
    wingSpan: 50,
    height: 25,
    wingThickness: 5,
    mouthDiameter: 10.8,
  },
  M12: {
    diameter: 12,
    threadPitch: 1.75,
    baseDiameter: 23,
    topBossDiameter: 20,
    bossHeight: 14,
    wingSpan: 64,
    height: 32,
    wingThickness: 6,
    mouthDiameter: 12.96,
  },
} as const

export const wingNutMetricSizeSchema = z.enum([
  "M4",
  "M5",
  "M6",
  "M8",
  "M10",
  "M12",
])

export type WingNutMetricSize = z.output<typeof wingNutMetricSizeSchema>
