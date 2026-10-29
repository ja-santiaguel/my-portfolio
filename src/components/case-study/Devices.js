import Image from "next/image";
import styles from "./Devices.module.css";

// Screen displays for case studies (2026-10-17): flat desktop screens and a
// current iPhone frame, straight on the page (brand-colour panels were tried
// and reverted, 2026-10-18). Built in CSS around the real screenshots, so
// they stay sharp at any density.
//
// Flat screens keep the site's sharp corners (no rounded UI surfaces); only
// the phone, a physical object, is rounded.

// A layout cell for the displays; no backing.
// Each cell enters like the text (data-media, see globals.css); `delay` (ms)
// staggers the second of a pair.
export function Panel({ children, className = "", delay = 0 }) {
  return (
    <div className={`${styles.panel} ${className}`} data-media="" data-trigger="" style={delay ? { "--d": `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}

// A desktop screenshot, flat, with a hairline edge.
export function Screen({ image, sizes = "(min-width: 1024px) 70vw, 100vw" }) {
  return (
    <div className={styles.screen}>
      <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes={sizes} className={styles.screenImage} />
    </div>
  );
}

// iPhone 16 Pro proportions: 393 x 852 pt display (55 pt corner radius),
// Dynamic Island 126 x 37 pt, 11 pt from the top; status bar 54 pt. The
// screenshot (a 390 x 844 capture) starts under the status bar, which takes
// the page's own top colour (statusBg) and a light or dark tone.
//
// fit="screen" (2026-10-19, Aether): the capture is a whole app screen,
// status-bar area included, so it fills the display behind the drawn status
// bar, anchored to the bottom so the app's navigation bar always shows (any
// excess is cropped from the empty top).
export function Phone({ image, statusBg = "#ffffff", tone = "dark", fit, sizes = "(min-width: 1024px) 20vw, 50vw" }) {
  return (
    <div className={styles.phone} data-tone={tone} data-fit={fit}>
      <span className={styles.button} data-side="left" data-n="1" aria-hidden="true" />
      <span className={styles.button} data-side="left" data-n="2" aria-hidden="true" />
      <span className={styles.button} data-side="left" data-n="3" aria-hidden="true" />
      <span className={styles.button} data-side="right" aria-hidden="true" />
      <div className={styles.display}>
        <div className={styles.status} style={{ background: statusBg }} aria-hidden="true">
          <span>9:41</span>
          <span className={styles.icons}>
            <svg viewBox="0 0 17 11"><rect x="0" y="7" width="3" height="4" rx="1" /><rect x="4.6" y="5" width="3" height="6" rx="1" /><rect x="9.2" y="2.5" width="3" height="8.5" rx="1" /><rect x="13.8" y="0" width="3" height="11" rx="1" /></svg>
            <svg viewBox="0 0 26 12"><rect x="0.5" y="0.5" width="22" height="11" rx="3.5" fill="none" stroke="currentColor" strokeOpacity=".4" /><rect x="2" y="2" width="19" height="8" rx="2" /></svg>
          </span>
        </div>
        <div className={styles.page}>
          <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes={sizes} className={styles.pageImage} />
        </div>
        <span className={styles.island} aria-hidden="true" />
      </div>
    </div>
  );
}
