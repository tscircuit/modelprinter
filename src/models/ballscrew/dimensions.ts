import {
  type BallScrewModelPropsInput,
  ballScrewModelPropsSchema,
} from "./schema"

export function getBallScrewDimensions(input: BallScrewModelPropsInput = {}) {
  const p = ballScrewModelPropsSchema.parse(input)
  const lead = p.pitch * p.starts
  const threadedLength = p.length - 2 * p.endJournalLength
  return {
    ...p,
    lead,
    threadedLength,
    bottomZ: 0,
    topZ: p.length,
  }
}
