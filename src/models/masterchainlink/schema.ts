import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateMasterChainLinkProps } from "./validate"

const shape = {
  pitch: positive.default(12.7),
  width: positive.default(16),
  pinDiameter: positive.default(3.96),
  springClip: z.literal(true).default(true),
  innerWidth: positive.default(7.85),
}

export const masterChainLinkModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateMasterChainLinkProps)

export const masterChainLinkModelDefinitionSchema = z
  .object({ fn: z.literal("masterchainlink"), ...shape })
  .strict()
  .superRefine(validateMasterChainLinkProps)

export type MasterChainLinkModelPropsInput = z.input<
  typeof masterChainLinkModelPropsSchema
>
export type MasterChainLinkModelProps = z.output<
  typeof masterChainLinkModelPropsSchema
>
export type MasterChainLinkModelDefinition = z.output<
  typeof masterChainLinkModelDefinitionSchema
>
