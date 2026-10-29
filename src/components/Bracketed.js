// Every "[ … ]" label goes through this: Helvetica's brackets hang below the
// baseline, so they are raised onto the capitals' centre (.bracket in
// globals.css). Pass `icon` to put an icon just inside the opening bracket.

// The text inside "[ … ]", or null when the label has no brackets.
export function splitBrackets(label) {
  const match = typeof label === "string" ? /^\[\s*(.*?)\s*\]$/.exec(label) : null;
  return match ? match[1] : null;
}

export default function Bracketed({ children, icon = null }) {
  const inner = splitBrackets(children);
  if (inner === null) return children;
  return (
    <>
      <span className="bracket bracket-open">[</span>{" "}
      {icon && <>{icon}{" "}</>}
      {inner}{" "}
      <span className="bracket bracket-close">]</span>
    </>
  );
}
