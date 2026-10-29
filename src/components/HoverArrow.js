import { MdArrowRightAlt } from "react-icons/md";

// Arrow-on-hover label. Put it inside a link or button: on hover (or keyboard
// focus) an arrow slides in just to the left of the label. The arrow takes no
// space and the label never moves. `back` points the arrow the other way
// (previous project).
export default function HoverArrow({ children, back = false }) {
  return (
    <span className={back ? "hover-arrow hover-arrow--back" : "hover-arrow"}>
      <MdArrowRightAlt className="hover-arrow__icon" aria-hidden="true" />
      <span className="hover-arrow__label">{children}</span>
    </span>
  );
}
