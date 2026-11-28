import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizePlanetaryGearmotorProps } from "./normalize"
import { validatePlanetaryGearmotorProps } from "./validate"

const shape = {
  motorOuterDiameter: positive.default(50),
  length: positive.default(140),
  shaftDiameter: positive.default(12),
  face4Hole: z.literal(true).default(true),
  pcd: positive.default(40),
  mountThread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m4"),
  coaxial: z.literal(true).default(true),
}

export const planetaryGearmotorModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validatePlanetaryGearmotorProps)
  .transform(normalizePlanetaryGearmotorProps)

export const planetaryGearmotorModelDefinitionSchema = z
  .object({ fn: z.literal("planetarygearmotor"), ...shape })
  .strict()
  .superRefine(validatePlanetaryGearmotorProps)
  .transform(normalizePlanetaryGearmotorProps)

export type PlanetaryGearmotorModelPropsInput = z.input<
  typeof planetaryGearmotorModelPropsSchema
>
export type PlanetaryGearmotorModelProps = z.output<
  typeof planetaryGearmotorModelPropsSchema
>
export type PlanetaryGearmotorModelDefinition = z.output<
  typeof planetaryGearmotorModelDefinitionSchema
>
