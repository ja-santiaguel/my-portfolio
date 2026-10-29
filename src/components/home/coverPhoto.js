// The project photo at its true proportions, sized to cover its frame (CSS:
// .cover-photo in globals.css), instead of an image box cropped with
// object-fit (2026-10-20). Between list and grid the photo is never
// re-cropped: the frame reshapes around it while it scales uniformly (a
// nested view-transition group), like rearranging apps on a phone.
// `frame` (optional) overrides the framing for one layout, e.g. media.grid:
// { focus: [x, y], zoom }, so a photo can be centred differently in a wide
// grid cell than in the tall list frame (2026-10-20). `focus` is the
// subject's centre as fractions of the photo; that point is held at the
// centre of the frame at any size (clamped so the photo still covers it).
// The object-position that centres a focal point in a square crop
// (object-fit: cover), e.g. the index thumbnails (2026-10-20).
export function squareFocus(media) {
  const f = media.focus ?? media.grid?.focus;
  if (!f) return undefined;
  const a = media.width / media.height;
  const axis = (focus, ratio) => (ratio === 1 ? 50 : Math.min(100, Math.max(0, ((0.5 - focus * ratio) / (1 - ratio)) * 100)));
  // Overflowing side scaled by its ratio to the square (the other side fits).
  return a < 1 ? `50% ${axis(f[1], 1 / a)}%` : `${axis(f[0], a)}% 50%`;
}

export function coverPhotoProps(media, frame) {
  const position = frame?.position ?? media.position;
  const [px = "50%", py = "50%"] = (position || "").split(" ").filter(Boolean);
  return {
    width: media.width,
    height: media.height,
    className: "cover-photo",
    "data-focal": frame?.focus ? "" : undefined,
    style: {
      "--a": media.width / media.height,
      "--px": parseFloat(px) / 100,
      "--py": parseFloat(py) / 100,
      "--z": frame?.zoom ?? 1,
      ...(frame?.focus ? { "--fx": frame.focus[0], "--fy": frame.focus[1] } : {}),
    },
  };
}
