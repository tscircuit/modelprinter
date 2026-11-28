export interface Din7984Spec {
  thread: string
  majorDiameter: number
  threadPitch: number
  headDiameter: number
  headHeight: number
  socketAcrossFlats: number
  socketDepth: number
}

export const DIN7984_LOW_HEAD_SOCKET_TABLE: readonly Din7984Spec[] = [
  {
    thread: "m3",
    majorDiameter: 3,
    threadPitch: 0.5,
    headDiameter: 5.5,
    headHeight: 2.0,
    socketAcrossFlats: 2.0,
    socketDepth: 1.3,
  },
  {
    thread: "m4",
    majorDiameter: 4,
    threadPitch: 0.7,
    headDiameter: 7.0,
    headHeight: 2.8,
    socketAcrossFlats: 2.5,
    socketDepth: 1.8,
  },
  {
    thread: "m5",
    majorDiameter: 5,
    threadPitch: 0.8,
    headDiameter: 8.5,
    headHeight: 3.5,
    socketAcrossFlats: 3.0,
    socketDepth: 2.3,
  },
  {
    thread: "m6",
    majorDiameter: 6,
    threadPitch: 1.0,
    headDiameter: 10.0,
    headHeight: 4.0,
    socketAcrossFlats: 4.0,
    socketDepth: 2.5,
  },
  {
    thread: "m8",
    majorDiameter: 8,
    threadPitch: 1.25,
    headDiameter: 13.0,
    headHeight: 5.0,
    socketAcrossFlats: 5.0,
    socketDepth: 3.5,
  },
  {
    thread: "m10",
    majorDiameter: 10,
    threadPitch: 1.5,
    headDiameter: 16.0,
    headHeight: 6.0,
    socketAcrossFlats: 7.0,
    socketDepth: 4.0,
  },
  {
    thread: "m12",
    majorDiameter: 12,
    threadPitch: 1.75,
    headDiameter: 18.0,
    headHeight: 7.0,
    socketAcrossFlats: 8.0,
    socketDepth: 4.8,
  },
]

export function findDin7984Spec(thread: string): Din7984Spec | null {
  const normalized = thread.trim().toLowerCase()
  return (
    DIN7984_LOW_HEAD_SOCKET_TABLE.find(
      (entry) => entry.thread === normalized,
    ) ?? null
  )
}
