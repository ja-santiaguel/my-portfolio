# Cover mockup prompts (ChatGPT image generation)

Covers are generated as scenes with a solid chroma-green screen, then the real
screenshot is composited onto the screen (exact UI, correct perspective):

```
node scripts/composite-mockup.cjs . <scene.png> <screenshot.png> <out.png>
```

Vary the devices between projects (model and finish), and to change one thing
in a chosen image use ChatGPT's image editor (open the image, Describe edits):
re-prompting from text drifts the composition.

House rules for every prompt (DESIGN.md, Imagery; memory: mockup devices):
- Apple-style devices with no logos or branding.
- Same family as the Aether / Arasaka covers: one object in a grey material
  setting, soft natural daylight, muted palette, editorial product photography.
- The setting comes from the project's own world, so the scene tells its story.
- Portrait 2:3; the device centred at about half the frame width (the home
  list shows only the middle ~66% of a cover).
- The screen: solid flat chroma green (#00D42A), evenly lit, no reflections,
  all four corners visible and unobstructed.

## General Roofing (a roofing company; the audience is homeowners)

The scene is where its audience would look at the site: at home, on a rainy
Lower Mainland day, thinking about the roof (not on a roof: roofers aren't the
audience). Kept distinct from Highland Ventures' office in material, light
and mood. (A rooftop/slate version was tried and rejected, 2026-10-17.)

Photorealistic editorial product photograph, portrait 2:3. A modern silver
laptop in the style of a MacBook Pro, no logos or branding anywhere, open at
about 110 degrees, on a weathered pale oak dining table in a calm family home,
beside a large window streaked with rain, neighbouring house roofs softly out
of focus outside. A plain ceramic mug next to the laptop. Overcast soft
daylight through the window from the left, gentle shadows, muted grey and soft
warm neutral palette, lived-in but uncluttered. The laptop is centred and
takes up about half the frame width, seen from slightly to the left and
slightly above, the window behind it. The screen is a solid flat chroma green
(#00D42A), evenly lit with no reflections or glare, its four corners fully
visible. Calm, homely, premium, minimal.

## Highland Ventures (a venture capital group)

Photorealistic editorial product photograph, portrait 2:3. A modern silver
laptop in the style of a MacBook Pro, no logos or branding anywhere, open at
about 110 degrees, on a honed grey stone meeting table in a quiet modern
glass-walled meeting room. Soft daylight from tall windows on the left, gentle
shadows, muted grey and warm neutral palette, the room softly out of focus
behind. The laptop is centred and takes up about half the frame width, seen
from the front three-quarters, slightly above. The screen is a solid flat
chroma green (#00D42A), evenly lit with no reflections or glare, its four
corners fully visible. Calm, premium, minimal.

## General Roofing, second set (2026-10-19): after the Aether mockups

Jonathan: match the feel and composition of the Aether mockups (one device as
a sculptural object, pale concrete, hard daylight, crisp shadows, cool
monochrome), the theme from the homeowner's world, and no two shots alike
(vary angle, focus and setup; not "replace the laptop with a phone"). The
theme is rain on a home's window: a four-pane window shadow and dappled
raindrop shadows. No roofs (a rooftop scene was rejected, 2026-10-17).

- `gr2-laptop.png` (3:2): Starlight MacBook Air-style laptop on a low pale
  concrete block against a plaster wall, front three-quarters, slightly
  above, right of centre; the window and rain shadows across the wall.
- `gr2-phone.png` (3:2): iPhone 16 Pro-style phone, natural titanium, lying
  face up at a diagonal on a cracked concrete window sill, overhead, shallow
  focus, the window's edge in frame, a diagonal band of light with one
  mullion shadow and raindrop shadows.
- `gr2-cover.png` (2:3): the laptop on a low concrete step in a corner where
  two plaster walls meet, low camera near the floor, a shaft of window light
  across the corner, the step's near edge soft in the foreground.

Every prompt ends with the green-screen rule above. Composites (real
homepage, and the mobile homepage with a drawn status bar under the Dynamic
Island): `gr2-*-composite.png`; the phone uses `composite-mockup.cjs ... 0
1.07` so the rounded corners are covered.

## Highland Ventures, second set (2026-10-19)

Same Aether feel, its own world: a Space Black 16-inch MacBook Pro-style
laptop, honed travertine and a dark charcoal plaster wall, hard low light
through tall vertical blinds (long stripes); the laptop left of centre
(General Roofing's is right). Generated warm, then muted with ChatGPT's image
editor (Jonathan: "more muted colors that also align with the theming of my
portfolio"): "Make the colours much more muted and close to a neutral
monochrome: remove the orange and gold cast, make the travertine stone a
pale, cool greige, the wall a soft dark grey, and the sunlight a pale neutral
daylight... Keep everything else exactly the same."

- `hv2-laptop.png` (3:2): on a low stone slab against the dark wall, front
  three-quarters from the right, slightly above.
- `hv2-cover.png` (2:3): high camera (~45 degrees) onto the corner of a thick
  stone table, the laptop facing the lower left, the near corner soft.

Screens: the live homepage captured full length from highland.ventures at
1440px (`public/images/projects/highland-ventures/screen-home.webp`).

## Aether, extended (2026-10-19)

`aether-extended.png`: `public/images/mockups/aether/mobile_mockup_aether_01.jpg`
uploaded to ChatGPT and outpainted: "Extend (outpaint) this photograph outward
so it shows a wider view of the same scene, landscape 3:2. Keep the original
photo exactly as it is..., just zoomed out: the original should sit in the
left-centre of the new frame, at about 60% of its height, with the phone
ending up about a third of the way across from the left edge. Add new,
seamlessly matching surroundings: more of the same pale concrete wall and
floor in the same hard daylight, mostly on the right side..." Used as is
(the phone is redrawn slightly wider than the original, so the original
can't be pasted back without a double outline).
