# Mechanical model string flags

Prefer value-free flags for mechanical options. Fastener standard flags and
`threadedrod` use boolean JSON properties. Other aliases below preserve their
existing JSON schema and legacy raw `.params()` behavior. Those aliases validate
new flag strings during `.string()`; legacy strings retain deferred model
validation during `.json()`.

`threadedrod` accepts `_lefthanded` and `_righthanded` and uses `leftHand: boolean`.
Its fixed properties need no JSON fields or flags, and enum selectors are
rejected. See [Threaded rod](threaded-rods.md) for its contract.

| Legacy selector | Preferred syntax | Models |
| --- | --- | --- |
| `mount(setscrew)` | `_setscrew` | shaftcollar, rigidcoupler |
| `mount(singleclamp)` | `_singleclamp` | clampingshaftcollar |
| `threadhand(left)` | `_lefthanded` | shaftcollar, clampingshaftcollar, rigidcoupler, hexbolt, flatheadscrew, panscrew |
| `hand(left)` | `_lefthanded` | compressionspring |
| `ends(closedground)` | `_closedground` | compressionspring |
| `thread(full)` | `_fullthread` | hexbolt, flatheadscrew, panscrew, buttonscrew |
| `drive(hex)` | `_hex` | hexbolt |
| `drive(hexsocket)` | `_hexsocket` | flatheadscrew, buttonscrew |
| `drive(phillips)` | `_phillips` | panscrew |
| `profile(fourtsolid)` | `_fourtsolid` | tslotextrusion |
| `shape(righttriangle)` | `_righttriangle` | tslotgusset |
| `shape(symmetricring)` | `_symmetricring` | cablegrommet |

Omit redundant default selectors: `spec(custom)`, `state(free)`,
`style(plainclosed)`, `ends(flat)`, right handedness and male thread gender.
The corresponding `_custom`, `_free`, `_plainclosed`, `_flatends`,
`_righthanded` and `_male` aliases are accepted only in applicable models and
removed when normalizing flag syntax. All existing default values remain intact.
Fastener standards use optional value-free flags, with the same geometry when
the flag is omitted:

| Model | Optional standard flag |
| --- | --- |
| hexbolt | `_iso4017` |
| flatheadscrew | `_iso10642` |
| panscrew | `_iso7045` and the independent recess flag `_iso4757` |
| buttonscrew | `_iso7380-1` |
| hexnut | `_iso4032`, `_din934`, or `_asmeb18.2.2` |

Hex nuts choose their existing size-based family by default: ISO for supported
ISO metric sizes, DIN for other supported metric sizes, and ASME for imperial
sizes. Explicit family flags remain strict about supported sizes. These models
reject `standard(...)`; normalized contracts contain boolean standard flags.

Dimensions and identifiers such as `m6` and `threadclass(6H)` retain their
established syntax. Existing thread visibility
flags `_threads` and `_nothreads` continue to work.

For example:

```ts
mp.string("shaftcollar_bore8mm_od16mm_w8mm_setscrew_m4_lefthanded").json()
mp.string("compressionspring_od8mm_wire1mm_l20mm_turns8_closedground_lefthanded").json()
mp.string("plainbushing_id8mm_od12mm_l20mm").json()
mp.string("threadedrod_m6_l100mm_lefthanded").json()
```

Flags are case insensitive, model-local and value-free. Repeating a flag or
combining it with a selector for the same property is an error, even if they
agree. Unsupported options remain unsupported; these aliases do not add new
geometry variants. New models should use boolean JSON properties for options
from the outset. Apart from the standard flags above, aliases on released models
preserve their existing JSON API.
