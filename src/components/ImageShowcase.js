import styles from "./ImageShowcase.module.css";

export default function ImageShowcase() {
  return (
      <img
        src="./images/portrait_1.png"
        alt="self portrait 1"
        className={styles.image}
      />
  );
}
