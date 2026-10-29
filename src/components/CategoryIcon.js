import { CiMobile3, CiMonitor, CiPen } from "react-icons/ci";

// The three work categories and their icons, from Circum (the same family as
// the header and contact icons). Keep to these three; new work maps onto one.
export const CATEGORIES = {
  website: { label: "Website", Icon: CiMonitor },
  mobile: { label: "Mobile", Icon: CiMobile3 },
  // The pen nib (2026-10-26, Jonathan's pick; before it the framed image,
  // the palette and the bezier pen).
  creative: { label: "Creative", Icon: CiPen },
};

// Decorative icon; the visible or visually-hidden category text carries the meaning.
export default function CategoryIcon({ category, size = 16, className }) {
  const entry = CATEGORIES[category];
  if (!entry) return null;
  const { Icon } = entry;
  return <Icon size={size} className={className} aria-hidden="true" focusable="false" />;
}
