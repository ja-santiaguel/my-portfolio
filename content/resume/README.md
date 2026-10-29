# Résumé

`resume.html` is the source: one Letter page in the portfolio's type and layout (Oswald titles, Helvetica Neue text from `public/fonts`, uppercase labels, "[ … ]" links, fine rules). Edit it, then print it to PDF with Chrome:

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=8000 --print-to-pdf="C:\Users\jasan\Documents\portfolio\my-portfolio-clean\content\resume\jonathan-santiaguel-resume.pdf" "file:///C:/Users/jasan/Documents/portfolio/my-portfolio-clean/content/resume/resume.html"
```

Check that it's still one page after any edit, then copy the PDF to `public/jonathan-santiaguel-resume.pdf`: the navbar, the menu and the footer link there (`profile.resume`). Every fact comes from the 9-23-26 résumé or the case studies; don't add any that aren't confirmed.
