export interface Iso7049Spec {
  tappingSize: string
  majorDiameter: number
  threadPitch: number
  headDiameter: number
  headHeight: number
}

export const ISO7049_SHEET_METAL_SCREW_TABLE: readonly Iso7049Spec[] = [
  {
    tappingSize: "st2.9",
    majorDiameter: 2.9,
    threadPitch: 1.1,
    headDiameter: 5.6,
    headHeight: 2.4,
  },
  {
    tappingSize: "st3.5",
    majorDiameter: 3.5,
    threadPitch: 1.3,
    headDiameter: 7.0,
    headHeight: 2.6,
  },
  {
    tappingSize: "st4.2",
    majorDiameter: 4.2,
    threadPitch: 1.4,
    headDiameter: 8.0,
    headHeight: 3.1,
  },
  {
    tappingSize: "st4.8",
    majorDiameter: 4.8,
    threadPitch: 1.6,
    headDiameter: 9.5,
    headHeight: 3.7,
  },
  {
    tappingSize: "st5.5",
    majorDiameter: 5.5,
    threadPitch: 1.8,
    headDiameter: 11.0,
    headHeight: 4.0,
  },
  {
    tappingSize: "st6.3",
    majorDiameter: 6.3,
    threadPitch: 1.8,
    headDiameter: 12.0,
    headHeight: 4.6,
  },
]

export function findIso7049Spec(tappingSize: string): Iso7049Spec | null {
  const normalized = tappingSize.trim().toLowerCase()
  return (
    ISO7049_SHEET_METAL_SCREW_TABLE.find(
      (entry) => entry.tappingSize === normalized,
    ) ?? null
  )
}
