import { CiSearch } from "react-icons/ci";
import Bracketed from "./Bracketed";

// "[ View … ]" call to action with a magnifying glass inside the brackets:
// [ (icon) VIEW CASE STUDY ]. The icon is decorative; the text carries the meaning.
export default function ActionLabel({ children }) {
  return (
    <Bracketed icon={<CiSearch className="action-icon" aria-hidden="true" focusable="false" />}>
      {children}
    </Bracketed>
  );
}
