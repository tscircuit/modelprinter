export interface Iso1207Spec {
  thread: string
  majorDiameter: number
  threadPitch: number
  headDiameter: number
  headHeight: number
  slotWidth: number
  slotDepth: number
}

export const ISO1207_CHEESE_HEAD_SCREW_TABLE: readonly Iso1207Spec[] = [
  {
    thread: "m2",
    majorDiameter: 2,
    threadPitch: 0.4,
    headDiameter: 3.8,
    headHeight: 1.3,
    slotWidth: 0.5,
    slotDepth: 0.6,
  },
  {
    thread: "m2.5",
    majorDiameter: 2.5,
    threadPitch: 0.45,
    headDiameter: 4.5,
    headHeight: 1.6,
    slotWidth: 0.6,
    slotDepth: 0.7,
  },
  {
    thread: "m3",
    majorDiameter: 3,
    threadPitch: 0.5,
    headDiameter: 5.5,
    headHeight: 2.0,
    slotWidth: 0.8,
    slotDepth: 0.85,
  },
  {
    thread: "m4",
    majorDiameter: 4,
    threadPitch: 0.7,
    headDiameter: 7.0,
    headHeight: 2.6,
    slotWidth: 1.0,
    slotDepth: 1.1,
  },
  {
    thread: "m5",
    majorDiameter: 5,
    threadPitch: 0.8,
    headDiameter: 8.5,
    headHeight: 3.3,
    slotWidth: 1.2,
    slotDepth: 1.3,
  },
  {
    thread: "m6",
    majorDiameter: 6,
    threadPitch: 1.0,
    headDiameter: 10.0,
    headHeight: 3.9,
    slotWidth: 1.6,
    slotDepth: 1.6,
  },
  {
    thread: "m8",
    majorDiameter: 8,
    threadPitch: 1.25,
    headDiameter: 13.0,
    headHeight: 5.0,
    slotWidth: 2.0,
    slotDepth: 2.0,
  },
  {
    thread: "m10",
    majorDiameter: 10,
    threadPitch: 1.5,
    headDiameter: 16.0,
    headHeight: 6.0,
    slotWidth: 2.5,
    slotDepth: 2.4,
  },
]

export function findIso1207Spec(thread: string): Iso1207Spec | null {
  const normalized = thread.trim().toLowerCase()
  return (
    ISO1207_CHEESE_HEAD_SCREW_TABLE.find(
      (entry) => entry.thread === normalized,
    ) ?? null
  )
}
