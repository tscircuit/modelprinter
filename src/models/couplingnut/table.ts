import { z } from "zod"

/** DIN 6334 elongated hexagon coupling nuts (nominal length m = 3d), in mm.
 * Reference dimensions: https://www.fasteners.eu/standards/DIN/6334/
 * Bore mouth diameters use the documented 1.08d untoleranced visual rule.
 */
export const couplingNutDimensions = {
  M6: {
    diameter: 6,
    threadPitch: 1,
    length: 18,
    acrossFlats: 10,
    mouthDiameter: 6.48,
  },
  M8: {
    diameter: 8,
    threadPitch: 1.25,
    length: 24,
    acrossFlats: 13,
    mouthDiameter: 8.64,
  },
  M10: {
    diameter: 10,
    threadPitch: 1.5,
    length: 30,
    acrossFlats: 17,
    mouthDiameter: 10.8,
  },
  M12: {
    diameter: 12,
    threadPitch: 1.75,
    length: 36,
    acrossFlats: 19,
    mouthDiameter: 12.96,
  },
  M16: {
    diameter: 16,
    threadPitch: 2,
    length: 48,
    acrossFlats: 24,
    mouthDiameter: 17.28,
  },
  M20: {
    diameter: 20,
    threadPitch: 2.5,
    length: 60,
    acrossFlats: 30,
    mouthDiameter: 21.6,
  },
} as const

export const couplingNutMetricSizeSchema = z.enum([
  "M6",
  "M8",
  "M10",
  "M12",
  "M16",
  "M20",
])

export type CouplingNutMetricSize = z.output<typeof couplingNutMetricSizeSchema>
