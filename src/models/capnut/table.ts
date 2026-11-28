import { z } from "zod"

/** DIN 1587 high-domed hexagon cap nuts (acorn nuts), nominal envelope in mm.
 * Reference dimensions: https://www.fasteners.eu/standards/DIN/1587/
 * Bore mouth diameters use the documented 1.08d untoleranced visual rule.
 */
export const capNutDimensions = {
  M4: {
    diameter: 4,
    threadPitch: 0.7,
    acrossFlats: 7,
    height: 8,
    capDiameter: 6.5,
    hexHeight: 3.2,
    threadDepth: 5.26,
    mouthDiameter: 4.32,
  },
  M5: {
    diameter: 5,
    threadPitch: 0.8,
    acrossFlats: 8,
    height: 10,
    capDiameter: 7.5,
    hexHeight: 4,
    threadDepth: 7.21,
    mouthDiameter: 5.4,
  },
  M6: {
    diameter: 6,
    threadPitch: 1,
    acrossFlats: 10,
    height: 12,
    capDiameter: 9.5,
    hexHeight: 5,
    threadDepth: 7.71,
    mouthDiameter: 6.48,
  },
  M8: {
    diameter: 8,
    threadPitch: 1.25,
    acrossFlats: 13,
    height: 15,
    capDiameter: 12.5,
    hexHeight: 6.5,
    threadDepth: 10.65,
    mouthDiameter: 8.64,
  },
  M10: {
    diameter: 10,
    threadPitch: 1.5,
    acrossFlats: 16,
    height: 18,
    capDiameter: 15,
    hexHeight: 8,
    threadDepth: 12.65,
    mouthDiameter: 10.8,
  },
  M12: {
    diameter: 12,
    threadPitch: 1.75,
    acrossFlats: 18,
    height: 22,
    capDiameter: 17,
    hexHeight: 10,
    threadDepth: 15.65,
    mouthDiameter: 12.96,
  },
} as const

export const capNutMetricSizeSchema = z.enum([
  "M4",
  "M5",
  "M6",
  "M8",
  "M10",
  "M12",
])

export type CapNutMetricSize = z.output<typeof capNutMetricSizeSchema>
