import type { FaqEntry } from "@/lib/json-ld";

export const TOOL_FAQ: Record<string, FaqEntry[]> = {
  "/ab-test-calculator": [
    { q: "What does the A/B test calculator tell me?", a: "It calculates statistical significance for your experiment: whether the difference between variant A and variant B is likely real or due to chance. Enter your control and variant visitors and conversions to get a p-value, confidence level, and relative lift." },
    { q: "What p-value should I target for a valid A/B test?", a: "Most practitioners use p ≤ 0.05 (95% confidence) as the minimum bar. High-stakes decisions (pricing, checkout) often require p ≤ 0.01 (99%). The calculator shows both." },
    { q: "How do I use the sample size planner?", a: "Enter your current baseline conversion rate, the minimum detectable effect (the smallest lift you care about), and your desired confidence level. The planner returns the number of visitors each variant needs before you can trust the result." },
    { q: "Is my test data sent to a server?", a: "No. All calculations run client-side in your browser. Paste sensitive conversion data without concern." },
    { q: "Can I run it with just visitors and conversions?", a: "Yes. The Results tab accepts visitors + conversions for control and variant. The Sample Size tab works from baseline rate + MDE alone." },
  ],

  "/aeo-readiness-scorer": [
    { q: "What is AEO readiness and why does it matter?", a: "Answer Engine Optimization (AEO) is about making your content easy for AI search systems (ChatGPT, Gemini, Perplexity, Google AI Overviews) to extract and cite. The scorer checks twelve structural signals those systems rely on — schema markup, clear headings, FAQ sections, author signals, and more." },
    { q: "Does the scorer crawl my live website?", a: "The scorer is an offline Python script you run locally. Paste your page URL or HTML, and it scores the signals it finds. Nothing is sent to a third-party service." },
    { q: "What are the twelve signals it checks?", a: "Structured data (JSON-LD), heading hierarchy, FAQ markup, author/byline, date freshness, meta description quality, internal linking depth, image alt text, canonical tag, robots.txt, llms.txt presence, and speakable CSS selectors." },
    { q: "How do I improve my AEO score?", a: "Start with the signals marked red in your report. Adding a FAQPage schema and a clear heading hierarchy typically give the biggest immediate lift. The tool links to fix-it guidance for each signal." },
  ],

  "/base64": [
    { q: "What is Base64 and when do I need to encode something?", a: "Base64 converts binary data (images, files, arbitrary bytes) into ASCII characters safe to transmit in text fields, data URIs, or HTTP headers. Common uses: embedding images in CSS/HTML, encoding API credentials, email MIME attachments." },
    { q: "Can I encode or decode a file (not just text)?", a: "Yes. Drop any file in the file tab to get its Base64 representation, or paste a Base64 string to download the decoded binary." },
    { q: "Is my data uploaded anywhere?", a: "No. Encoding and decoding happen entirely in your browser using the Web Crypto and FileReader APIs. No data leaves your machine." },
    { q: "What is the difference between standard Base64 and URL-safe Base64?", a: "Standard Base64 uses + and / characters that break in URLs. URL-safe Base64 replaces them with - and _ so the encoded string works in query parameters and JWT tokens." },
  ],

  "/border-radius": [
    { q: "What does the border-radius visualizer do?", a: "It lets you drag handles on a preview box to set all four corner radii independently, then copies the exact CSS border-radius shorthand to your clipboard." },
    { q: "Can I create asymmetric (squircle-like) shapes?", a: "Yes. Unlock the corners and drag each radius independently. You can also enter the horizontal and vertical radius separately for each corner using the full 8-value syntax." },
    { q: "Does it output the full border-radius CSS?", a: "Yes. The generated code includes the full shorthand, the verbose four-corner form, and — where different — the horizontal/vertical split form (e.g., 10px 20px / 30px 40px)." },
    { q: "Does it work on mobile?", a: "Yes. Use your finger to drag the corner handles on the preview. The code output updates in real time." },
  ],

  "/box-shadow": [
    { q: "What controls does the box shadow designer give me?", a: "Horizontal offset, vertical offset, blur radius, spread radius, color (with opacity), inset toggle, and a multi-layer shadow stack. Each layer can be toggled on/off individually." },
    { q: "Can I create layered box shadows?", a: "Yes. Click 'Add layer' to stack multiple shadow layers. Layered shadows are the technique behind soft neumorphic effects and Material Design elevation." },
    { q: "Does it generate inset shadows?", a: "Yes. Toggle the Inset switch to create inner shadows for pressed-state buttons, embossed text fields, or sunken card effects." },
    { q: "Is the output valid CSS?", a: "Yes. The output is a ready-to-paste CSS box-shadow declaration, including the comma-separated multi-layer form when applicable." },
  ],

  "/caffeine": [
    { q: "How does the Caffeine Clock calculate when coffee wears off?", a: "Caffeine has a half-life of about 5–6 hours in healthy adults. The clock tracks how much caffeine remains in your system over time based on your intake time, dose, and personal sensitivity." },
    { q: "Can I enter multiple coffees or other drinks?", a: "Yes. Add each drink with its time and caffeine content. The clock sums their curves and shows when your combined caffeine load drops below a threshold you choose." },
    { q: "Is the result medically accurate?", a: "It's a useful approximation based on standard pharmacokinetic models, but individual metabolism varies by liver enzymes, age, and medications. Treat it as a guide, not a prescription." },
    { q: "Does it consider espresso vs. drip vs. energy drinks?", a: "Yes. The intake form includes preset caffeine amounts for common drinks (espresso ~65 mg, drip ~100 mg, energy drink ~80–150 mg) and lets you enter a custom amount." },
  ],

  "/case-converter": [
    { q: "Which cases does the converter support?", a: "Title Case, UPPER CASE, lower case, camelCase, PascalCase (UpperCamelCase), snake_case, SCREAMING_SNAKE_CASE, kebab-case, COBOL-CASE, dot.case, and Sentence case." },
    { q: "Does it handle multiple words and punctuation correctly?", a: "Yes. The converter detects word boundaries across spaces, hyphens, underscores, and mixed-case runs, so pasting a camelCase identifier or a multi-word phrase both convert correctly." },
    { q: "Can I convert a large block of text?", a: "Yes. Paste any length of text. The conversion applies to the full input." },
    { q: "Is it useful for renaming code identifiers?", a: "Yes. Paste a variable name from one language convention and convert it to another — for example, turning a Python snake_case name into a Java camelCase name." },
  ],

  "/character-counter": [
    { q: "What does the character counter track?", a: "Characters (with and without spaces), words, sentences, paragraphs, unique words, and estimated reading time at 200 wpm." },
    { q: "Is there a live character limit warning?", a: "Yes. Set a limit (e.g., 280 for Twitter/X, 160 for SMS) and the counter turns red as you approach it." },
    { q: "Can I analyze text I paste in rather than type?", a: "Yes. Paste any text and all counts update instantly." },
    { q: "Does the reading time estimate account for complexity?", a: "The estimate uses a standard 200-wpm baseline. Complex technical text is read more slowly; simple prose more quickly. Use the estimate as a ballpark, not a guarantee." },
  ],

  "/clipboard-manager": [
    { q: "What does the clipboard manager store?", a: "Text clips you save manually by clicking 'Save clip'. It does NOT silently monitor your system clipboard — you control what gets saved." },
    { q: "Where is my data stored?", a: "In your browser's localStorage. Clips persist across page reloads in the same browser profile but are not synced to the cloud or any server." },
    { q: "Can I search my saved clips?", a: "Yes. The search bar filters clips by content in real time as you type." },
    { q: "Is there a clip limit?", a: "localStorage caps vary by browser (typically 5–10 MB). In practice you can store thousands of typical text clips before hitting any limit." },
  ],

  "/color-converter": [
    { q: "Which color formats does it convert between?", a: "HEX (#rrggbb / #rgb), RGB (0–255), RGBA (with alpha), HSL, HSLA, HSV, HWB, and OKLCH. Enter any format and get all others instantly." },
    { q: "Does it support opacity and alpha channels?", a: "Yes. RGBA and HSLA include an alpha slider. The output updates all formats that support alpha." },
    { q: "Can I pick a color visually instead of entering values?", a: "Yes. Click the color swatch to open the native browser color picker, then convert from there." },
    { q: "Why do I need OKLCH?", a: "OKLCH is a perceptually uniform color space used in modern CSS (color: oklch(...)). It makes it easier to create consistent-looking palettes by adjusting lightness and chroma predictably." },
  ],

  "/comparison-table": [
    { q: "What can I use the comparison table builder for?", a: "Building competitor feature tables, pricing plan comparisons, technical spec sheets, or any side-by-side evaluation. Common in sales decks, landing pages, and product docs." },
    { q: "What export formats are available?", a: "HTML (embeddable), Markdown, PNG (screenshot), and CSV. Use HTML for landing pages, Markdown for docs, PNG for decks." },
    { q: "Can I add a 'best' highlight to a column?", a: "Yes. Mark any column as the recommended option and it renders with a highlighted header style." },
    { q: "Is there a row limit?", a: "No hard limit. Add as many features and columns as you need; the preview scrolls." },
  ],

  "/content-brief-builder": [
    { q: "What goes into a content brief?", a: "Target keyword and intent, audience persona, article goal, required sections/outline, word count target, SEO guidance (H1, meta description), internal link targets, and writer notes. The builder guides you through each field." },
    { q: "Can I export the brief for a writer?", a: "Yes. Export as a formatted Markdown file or copy as plain text to paste into a doc or ticket." },
    { q: "Is the brief format SEO-team-ready?", a: "Yes. The output structure matches what most SEO and content teams expect: intent, keyword targets, outline, and success criteria." },
    { q: "Does it suggest keywords or headings?", a: "The builder does not crawl the web for keyword suggestions — it helps you structure the brief you define. Pair it with your keyword research tool of choice." },
  ],

  "/contrast": [
    { q: "What WCAG levels does the contrast checker test?", a: "WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large text) and AAA (7:1 for normal text, 4.5:1 for large text). It shows pass/fail for both levels simultaneously." },
    { q: "Can I test text on a semi-transparent background?", a: "Yes. Set the alpha channel on either color to simulate layered UI transparency, and the checker calculates the blended contrast ratio." },
    { q: "Does it work for UI components and icons, not just text?", a: "WCAG 3:1 applies to non-text elements like icons and input borders. The checker flags component-level contrast separately from text." },
    { q: "Can I simulate color blindness?", a: "Yes. Toggle deuteranopia, protanopia, and tritanopia simulations to see how your color pair looks to colorblind users." },
  ],

  "/cron-builder": [
    { q: "What is a cron expression and why is it hard to write by hand?", a: "A cron expression is a five or six-field string (minute, hour, day-of-month, month, day-of-week, optional second) that defines a schedule for automated jobs. The syntax has edge cases — step values, last-day-of-month, weekday nearest a date — that are easy to get wrong." },
    { q: "Does the builder validate my expression in real time?", a: "Yes. As you type or click, the builder shows the next five scheduled run times so you can verify the schedule before copying it." },
    { q: "What cron flavors does it support?", a: "Standard Unix cron (five fields), extended cron with seconds (six fields), and AWS EventBridge / CloudWatch cron (which uses a different day-of-week numbering)." },
    { q: "Can I start from a natural language schedule?", a: "Yes. Type a description like 'every weekday at 9am' and the builder fills in the expression." },
  ],

  "/easing-editor": [
    { q: "What easing types can I design?", a: "Cubic-bezier (CSS transition-timing-function), spring (for JavaScript animation libraries that accept stiffness/damping/mass), and linear() (the new CSS easing function for multi-stop custom curves)." },
    { q: "How do I use the output in CSS?", a: "Copy the generated value directly into a transition or animation-timing-function property. Example: transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)." },
    { q: "Can I preview the easing on a real element?", a: "Yes. The editor shows a live animation preview on a box that plays back every time you change a handle — no guessing required." },
    { q: "What spring easing output does it give?", a: "For Framer Motion: { type: 'spring', stiffness: X, damping: Y, mass: Z }. For GSAP: { ease: 'elastic.out(X, Y)' }. Output adapts to the library you select." },
  ],

  "/email-signature": [
    { q: "What does the email signature generator produce?", a: "An HTML email signature with your name, title, company, contact details, and optional social links — formatted for copy-paste into Gmail, Outlook, Apple Mail, or any mail client that accepts HTML signatures." },
    { q: "Can I share my signature with others?", a: "Yes. The generator encodes your signature data in the URL so you can share a link that re-populates the form with your details." },
    { q: "Does it support custom logos or profile photos?", a: "Yes. Paste an image URL or upload an image for a headshot or company logo in the signature." },
    { q: "Will the signature render correctly in Outlook?", a: "The generator outputs table-based HTML which is the most compatible format for email clients including Outlook. Inline CSS is used where required." },
  ],

  "/favicon": [
    { q: "What inputs can I use to generate a favicon?", a: "Text or emoji (rendered with a background color of your choice), or an uploaded image (PNG, SVG, JPG). The generator produces .ico, 16×16 PNG, 32×32 PNG, 180×180 Apple Touch Icon, and 192×192 Android icon." },
    { q: "Do I need all those sizes?", a: "For basic browser tab support, .ico and 32×32 PNG are enough. For full PWA and mobile home-screen support, also include the Apple Touch Icon and 192×192." },
    { q: "Can I download everything as a zip?", a: "Yes. Click 'Download all' to get a zip containing all generated sizes plus a snippet of the <link> tags to add to your <head>." },
    { q: "Does it generate an SVG favicon?", a: "Yes. Modern browsers (Chrome, Firefox, Safari 15+) support SVG favicons which scale perfectly at any size. The generator produces an SVG version alongside the raster files." },
  ],

  "/feature-benefit-mapper": [
    { q: "What is the feature-benefit mapper for?", a: "Catching feature-speak in product copy. Enter a feature and the tool prompts you to articulate the customer benefit — what the feature actually does for the user, not just what it is. Essential for landing pages, sales decks, and release notes." },
    { q: "How does it differ from just writing copy?", a: "It forces a structured answer to 'so what?' for every feature. The output separates feature (what it is), benefit (what it does), and proof point (why to believe it)." },
    { q: "Can I export the output?", a: "Yes. Export as a Markdown table or copy as plain text to paste into a doc, Notion, or Figma." },
    { q: "Is it useful for competitive positioning?", a: "Yes. Map your features to benefits, then map competitor features to benefits. Gaps in their benefit column are your differentiation opportunities." },
  ],

  "/file-converter": [
    { q: "What file types can I convert?", a: "Images (PNG, JPG, WebP, GIF, BMP), documents (Markdown ↔ HTML, JSON ↔ CSV for flat arrays), and text encodings. The available conversions depend on the file type you upload." },
    { q: "Are files uploaded to a server?", a: "No. All conversions use browser APIs (Canvas, FileReader, Web Workers). Your files never leave your machine." },
    { q: "Is there a file size limit?", a: "Large files may be slow or cause memory pressure in the browser tab, but there is no artificial cap. For files above 50 MB, a dedicated desktop converter may be faster." },
    { q: "Can I batch convert multiple files?", a: "Yes. Drop multiple files at once to convert them all to the same target format." },
  ],

  "/find-replace": [
    { q: "Does the find-and-replace tool support regular expressions?", a: "Yes. Toggle the Regex switch to use full JavaScript regex syntax — including capture groups, backreferences, and flags (case-insensitive, multiline, global)." },
    { q: "Can I do case-insensitive search without regex?", a: "Yes. Toggle the 'Aa' button for case-insensitive plain text search — no regex needed." },
    { q: "Does it show a preview before replacing?", a: "Yes. Matches are highlighted in the input pane before you commit the replacement, so you can verify what will change." },
    { q: "Is there undo?", a: "Yes. Cmd+Z / Ctrl+Z restores the previous state of the text, including before any replacements." },
  ],

  "/flexbox": [
    { q: "What is the Flexbox Playground for?", a: "Learning and experimenting with CSS Flexbox interactively. Adjust flex-direction, justify-content, align-items, flex-wrap, gap, and individual item flex values via controls and see the result update live." },
    { q: "Can I add and remove flex items in the playground?", a: "Yes. Add up to 12 items and control each item's flex-grow, flex-shrink, flex-basis, align-self, and order independently." },
    { q: "Does it output CSS I can copy?", a: "Yes. The current layout configuration generates the full CSS for the container and each item class, ready to paste into your project." },
    { q: "Is there a visual guide to each property?", a: "Each control includes a one-line description of what the property does, so it doubles as an interactive Flexbox reference." },
  ],

  "/flow": [
    { q: "What is the Decision Flow tool for?", a: "Building yes/no troubleshooting trees and decision guides that can be shared as a link or embedded. Useful for support runbooks, onboarding guides, and diagnostic flows." },
    { q: "Can I share my flow with someone who doesn't have an account?", a: "Yes. The flow data is encoded in the URL. Anyone with the link can view and walk through the flow without logging in." },
    { q: "How many branches can a flow have?", a: "There is no enforced limit. Each node can branch into two outcomes (yes/no). Deeply nested trees work fine for flows with 20–30 decision points." },
    { q: "Can I embed the flow on another website?", a: "Yes. Copy the embed snippet to drop the flow into any page as an iframe." },
  ],

  "/glassmorphism": [
    { q: "What is glassmorphism and how does this tool help?", a: "Glassmorphism is a CSS UI style using backdrop blur, semi-transparent backgrounds, and subtle borders to create frosted-glass card effects. The generator lets you tune blur, opacity, and border settings and copies the CSS." },
    { q: "Which CSS properties does it generate?", a: "backdrop-filter: blur(...), background: rgba(...), border: 1px solid rgba(...), and border-radius. Some configurations also include a -webkit-backdrop-filter fallback for older Safari." },
    { q: "Does backdrop-filter work in all browsers?", a: "backdrop-filter is supported in all modern browsers including Safari. Internet Explorer does not support it. The generator notes browser support for each setting." },
    { q: "Can I preview on a custom background?", a: "Yes. Change the preview background to a solid color, gradient, or custom image URL to see how the glass effect will look over your actual content." },
  ],

  "/gradient": [
    { q: "What gradient types can I create?", a: "Linear, radial, and conic gradients with up to 10 color stops. Each stop is independently positioned and can have its own opacity." },
    { q: "Can I generate a gradient from an image?", a: "Yes. Upload an image and the tool extracts dominant colors to suggest a matching gradient palette." },
    { q: "Does it output the CSS background property?", a: "Yes. The output includes the full background or background-image CSS declaration, including vendor-prefixed -webkit- fallbacks." },
    { q: "Can I import gradients from popular design tools?", a: "You can paste hex values from Figma or Sketch. Direct Figma import requires manual entry, but the multi-stop color picker makes recreation fast." },
  ],

  "/grid": [
    { q: "What does the CSS Grid builder let me do?", a: "Define grid-template-columns and grid-template-rows visually with drag-resize tracks, set gap, and place items by dragging. The generated CSS updates live." },
    { q: "Does it support fr units, repeat(), and auto-fill?", a: "Yes. Toggle between px, %, fr, auto, minmax(), and repeat() for each track. Shorthand notations like repeat(3, 1fr) are reflected in the output." },
    { q: "Can I place grid items manually?", a: "Yes. Click any item to set its grid-column and grid-row start/end values, giving you named-line and span-based placement." },
    { q: "Is the output production-ready CSS?", a: "Yes. Copy the container and items CSS directly. The output includes all placed items with their grid-column and grid-row values." },
  ],

  "/hash-generator": [
    { q: "Which hash algorithms are supported?", a: "MD5, SHA-1, SHA-256, SHA-384, and SHA-512. Use SHA-256 or better for any security-sensitive purpose; MD5 and SHA-1 are included for legacy compatibility only." },
    { q: "Can I hash a file rather than text?", a: "Yes. Drop any file to compute its hash for integrity verification — useful for checking download authenticity." },
    { q: "Is the hashing done in the browser?", a: "Yes. SHA-256, SHA-384, and SHA-512 use the browser's native Web Crypto API. MD5 and SHA-1 use a JavaScript implementation. Nothing is sent to a server." },
    { q: "Why are MD5 and SHA-1 labeled 'legacy'?", a: "Both algorithms have known collision vulnerabilities that make them unsuitable for cryptographic security. They are still useful for non-security checksums and legacy system compatibility." },
  ],

  "/headline-analyzer": [
    { q: "What does the headline analyzer score?", a: "Power words, emotional value (positive/negative/neutral), word count, character count, reading grade level, and an overall score out of 100 based on click-potential factors." },
    { q: "What makes a high-scoring headline?", a: "Power words, an emotional trigger, a specific number or data point, clarity (under 70 characters for SEO), and a match between the headline type (list, how-to, question) and reader intent." },
    { q: "Is the scoring model based on research?", a: "The scoring heuristics are derived from published copywriting frameworks (AIDA, CoSchedule methodology). It's a directional tool, not a statistical predictor of CTR." },
    { q: "Can I compare multiple headline variants?", a: "Yes. Enter multiple headlines and the analyzer scores each so you can pick the strongest option." },
  ],

  "/image-converter": [
    { q: "Which image formats can I convert between?", a: "PNG, JPG/JPEG, WebP, GIF (static), and BMP. Drop an image and select the target format." },
    { q: "Does converting to WebP reduce file size?", a: "Typically yes — WebP is 25–35% smaller than equivalent-quality JPG and significantly smaller than PNG for photos. The tool lets you adjust quality before converting." },
    { q: "Are images uploaded to a server?", a: "No. Conversion uses the browser's Canvas API. Your images stay on your machine." },
    { q: "Can I batch convert a folder of images?", a: "Yes. Drop multiple files to convert them all to the same target format in one go." },
  ],

  "/invoice-generator": [
    { q: "What does the invoice generator include?", a: "Your name/company, client details, line items with quantity and rate, subtotal, tax rate, total, due date, payment terms, and a notes field. All are editable." },
    { q: "Can I save invoices for later?", a: "Invoices are saved in your browser's localStorage. They persist across page loads in the same browser profile. You can also export to PDF and save the file." },
    { q: "Does it export to PDF?", a: "Yes. Click 'Download PDF' to generate a print-ready PDF using your browser's print engine." },
    { q: "Can I add a logo?", a: "Yes. Upload a logo image (PNG or SVG recommended) and it appears in the invoice header." },
    { q: "Is there invoice numbering?", a: "Yes. The invoice number field auto-increments with each new invoice but you can override it manually." },
  ],

  "/json-formatter": [
    { q: "What does the JSON formatter do?", a: "Pretty-prints minified or compact JSON with configurable indentation (2 spaces, 4 spaces, or tab), validates syntax and reports errors with line numbers, and can sort keys alphabetically." },
    { q: "Is my JSON sent anywhere?", a: "No. Formatting runs entirely in your browser. Paste sensitive API responses, tokens, or configuration without concern." },
    { q: "Can it convert JSON to other formats?", a: "Yes. Convert JSON to YAML, CSV (for flat arrays of objects), or TypeScript interface definitions." },
    { q: "Can it minify JSON?", a: "Yes. Use the Minify tab to compress formatted JSON into a single line — useful before embedding in environment variables or HTTP requests." },
    { q: "Does it validate JSON Schema?", a: "No — it validates that the input is syntactically valid JSON, not that it conforms to a specific schema." },
  ],

  "/jwt-decoder": [
    { q: "What does the JWT decoder show?", a: "The decoded header (algorithm, token type), payload (all claims with human-readable timestamps), and the signature. It color-codes standard claims like exp, iat, sub, and iss." },
    { q: "Does it verify the signature?", a: "No. Signature verification requires the secret or public key, which the decoder does not accept. Use it to inspect token contents, not to validate tokens." },
    { q: "Is my token sent to a server?", a: "No. The decoder runs client-side. Never paste production tokens into third-party online tools — this one keeps everything in your browser." },
    { q: "Why is my exp claim showing as a timestamp number?", a: "JWT exp claims are Unix timestamps (seconds since epoch). The decoder automatically converts them to human-readable date-time strings next to the raw number." },
  ],

  "/keyframe-animator": [
    { q: "What is the keyframe animator?", a: "A visual CSS @keyframes editor with a timeline. Add keyframe stops at percentage points and set CSS properties at each stop. The generated @keyframes block and animation shorthand copy to your clipboard." },
    { q: "Which CSS properties can I animate?", a: "Transform (translate, rotate, scale), opacity, color, background-color, border-radius, and filter. These are the GPU-composited properties that animate smoothly in the browser." },
    { q: "Can I preview the animation on a real element?", a: "Yes. The preview area shows your animation playing on a box in real time as you edit keyframes." },
    { q: "Can I use a custom easing between keyframe stops?", a: "Yes. Each keyframe stop accepts an animation-timing-function override so you can mix linear, ease-in-out, and custom cubic-bezier curves within a single animation." },
  ],

  "/link-in-bio": [
    { q: "What does the link-in-bio builder create?", a: "A simple landing page with your name, bio, and a list of links — the kind used in Instagram and TikTok bios. Choose a theme and customize colors." },
    { q: "Can I share the page as a live URL?", a: "Yes. Your link-in-bio configuration is encoded in the URL, so sharing the link gives the recipient a live, rendered version of your page." },
    { q: "Do I need to sign up or pay to share?", a: "No. The tool is entirely free and requires no account. The URL itself carries your data." },
    { q: "How many links can I add?", a: "Up to 20 links. Each has a label, URL, and optional icon." },
  ],

  "/lorem-ipsum": [
    { q: "What output modes does the Lorem Ipsum generator have?", a: "Paragraphs, sentences, words, or lists. Set the exact count and click Generate." },
    { q: "Can it generate text in formats other than plain Latin?", a: "Yes. Toggle between classic Lorem Ipsum, completely random lorem-like Latin, and a 'hipster ipsum' variant with modern vocabulary." },
    { q: "Does it wrap the output in HTML paragraph tags?", a: "Yes. Toggle the 'Wrap in <p> tags' option to get ready-to-paste HTML." },
    { q: "Can I start with 'Lorem ipsum dolor sit amet...'?", a: "Yes. The 'Start with Lorem ipsum' option ensures the first sentence is the traditional opening." },
  ],

  "/markdown-editor": [
    { q: "What does the Markdown editor support?", a: "Full CommonMark Markdown including headings, bold, italic, links, images, code blocks (with syntax highlighting), tables, blockquotes, and task lists." },
    { q: "Can I export to HTML or PDF?", a: "Yes. Export the rendered output as HTML, or use the browser's print dialog to save as PDF from the Preview pane." },
    { q: "Is there a live preview?", a: "Yes. Split-pane mode shows the Markdown source on the left and the rendered HTML preview on the right, updating as you type." },
    { q: "Does it support GitHub Flavored Markdown (GFM)?", a: "Yes. Tables, strikethrough, and task lists are all GFM extensions that the editor renders correctly." },
  ],

  "/meta-tag-generator": [
    { q: "What meta tags does the generator produce?", a: "Title tag, meta description, canonical URL, Open Graph (og:title, og:description, og:image, og:url, og:type), Twitter Card (twitter:card, twitter:title, twitter:description, twitter:image), and robots directives." },
    { q: "Does it show a live SERP preview?", a: "Yes. The generator renders a real-time preview of how your title and description will appear in Google search results, including truncation at the character limit." },
    { q: "Does it preview the OG card on social?", a: "Yes. Switch between Google, Facebook/LinkedIn, and Twitter/X preview modes to see how the card will render on each platform." },
    { q: "Is there character count guidance?", a: "Yes. Title and description fields show current/maximum characters with color-coded feedback (green = good, orange = borderline, red = too long)." },
  ],

  "/og-image": [
    { q: "What can I create with the OG image generator?", a: "Open Graph images for social sharing — the 1200×630px images that appear when your URL is shared on Twitter/X, LinkedIn, Slack, and iMessage. Customize text, background, colors, and layout." },
    { q: "What export size does it produce?", a: "1200×630px PNG — the standard OG image dimension. The generator enforces this size to ensure correct rendering across all platforms." },
    { q: "Can I use a custom background image?", a: "Yes. Upload an image as the background, or choose a gradient or solid color." },
    { q: "Does it support my brand fonts?", a: "You can select from a set of preloaded Google Fonts. Custom font upload is not currently supported." },
  ],

  "/outside": [
    { q: "What does 'How's Outside?' do?", a: "It gives you a qualitative weather read — warmer or cooler than yesterday, whether it's a good day for a run, a walk, or staying in — without overwhelming you with numbers." },
    { q: "How does it get weather data?", a: "It uses your device's location (with your permission) to fetch current conditions from a public weather API. No account or API key needed." },
    { q: "Does it store my location?", a: "No. Your coordinates are used only to fetch the current weather in that session. They are not stored or sent to any database." },
    { q: "Why 'without the numbers'?", a: "Most weather apps optimize for data density. Outside optimizes for a quick gut-check: is it a day to be outside or not?" },
  ],

  "/palette": [
    { q: "What harmony rules does the palette generator support?", a: "Complementary, split-complementary, triadic, tetradic, analogous, and monochromatic. Pick any base color and instantly see a palette built on the chosen harmony." },
    { q: "Can I export the palette for Figma or CSS?", a: "Yes. Export as CSS custom properties (--color-*), JSON, a Figma-compatible palette file, or copy hex values." },
    { q: "Can I lock one color and regenerate the rest?", a: "Yes. Click the lock icon on any swatch to pin it while the other swatches regenerate on each shuffle." },
    { q: "Does it generate accessible contrast-checked palettes?", a: "The generator shows contrast ratios between swatches so you can identify which combinations meet WCAG AA/AAA. It does not auto-filter to only accessible pairs." },
  ],

  "/passage-audit": [
    { q: "What is a passage audit?", a: "Modern AI search (Google AI Overviews, Perplexity, ChatGPT) retrieves content at the passage level — individual paragraphs or sentences, not whole pages. A passage audit scores each passage on your page for how retrievable and citable it is by those systems." },
    { q: "What signals does the audit score?", a: "Specificity (does the passage make a concrete claim?), entity density, question-answer structure, length (too short or too long), and whether the passage can stand alone without surrounding context." },
    { q: "How do I use the results?", a: "Passages marked red are thin, generic, or context-dependent. Rewrite them to be specific, self-contained, and factual. Passages marked green are already passage-retrieval-ready." },
    { q: "What URL or input does the tool accept?", a: "Paste any block of text or a URL. For URL input, the tool fetches and extracts the main content before scoring." },
  ],

  "/pdf-compress": [
    { q: "How does PDF compression work in the browser?", a: "The tool re-renders each PDF page at a reduced resolution using browser canvas APIs and repackages the result. Image-heavy PDFs see the largest reduction; text-only PDFs compress minimally." },
    { q: "Are my PDFs uploaded to a server?", a: "No. Compression runs 100% client-side. Your documents never leave your machine." },
    { q: "How much will my PDF shrink?", a: "Photo-heavy PDFs typically shrink 40–70%. Text-only or vector PDFs may shrink 10–30%. The tool shows before/after file size." },
    { q: "Does compression reduce quality?", a: "Yes, slightly. The quality slider lets you balance file size against visual fidelity. At high quality settings the difference is invisible on screen." },
  ],

  "/pdf-merge": [
    { q: "How do I merge multiple PDFs?", a: "Drop two or more PDF files into the tool, drag to reorder them if needed, then click Merge. The combined PDF downloads to your machine." },
    { q: "Are my PDFs uploaded?", a: "No. Merging runs in your browser using pdf-lib. Your files stay on your machine." },
    { q: "Is there a file count or size limit?", a: "No enforced limit. Very large files (100 MB+) may be slow in older browsers due to memory constraints." },
    { q: "Does it preserve bookmarks and links?", a: "Internal bookmarks and hyperlinks are preserved. Cross-document internal links (linking from one PDF to an anchor in another) will not resolve in the merged output." },
  ],

  "/pdf-split": [
    { q: "How do I extract specific pages from a PDF?", a: "Upload the PDF, select the pages or page ranges you want (e.g., 1–3, 5, 8–10), and click Extract. You get a new PDF with only those pages." },
    { q: "Can I split a PDF into individual pages?", a: "Yes. Use the 'Split all pages' mode to extract every page as a separate PDF file, then download them as a zip." },
    { q: "Are my files uploaded to a server?", a: "No. Splitting uses pdf-lib in the browser. Your documents stay on your machine." },
    { q: "Can I reorder pages while splitting?", a: "Yes. After selecting pages, drag them to reorder before extracting." },
  ],

  "/positioning-builder": [
    { q: "What positioning frameworks does the builder support?", a: "April Dunford's Obviously Awesome frame (market category + best-fit customers + unique attributes + value for attributes + alternatives), Geoffrey Moore's Crossing the Chasm template, and a minimal one-liner template." },
    { q: "What is a positioning statement?", a: "A positioning statement defines who the product is for, what category it belongs to, how it is different from alternatives, and why that difference matters. It is internal strategy, not a tagline." },
    { q: "Can I export the statement?", a: "Yes. Export as plain text or Markdown to paste into a brand doc, PRD, or sales deck." },
    { q: "Is there guidance on filling in each field?", a: "Yes. Each field has a tooltip explaining what to enter and an example from a well-known product." },
  ],

  "/qr-code": [
    { q: "What can I encode in a QR code?", a: "URLs, plain text, email addresses (mailto:), phone numbers (tel:), WiFi credentials (WIFI:S:...;T:WPA;P:...;;), SMS, and vCard contact info." },
    { q: "Can I customize the QR code colors?", a: "Yes. Set a custom foreground and background color. Make sure the contrast ratio is high enough for scanners to read the code reliably." },
    { q: "What download formats are available?", a: "PNG (for print and web), SVG (vector, scalable to any size), and WebP. SVG is recommended for print and large-format use." },
    { q: "Is there an error correction level setting?", a: "Yes. Higher error correction (Level H) lets the QR code be read even when 30% of it is obscured — useful if you plan to add a logo in the center." },
  ],

  "/readability-scorer": [
    { q: "Which readability formulas does it calculate?", a: "Flesch Reading Ease, Flesch-Kincaid Grade Level, Gunning Fog Index, SMOG Index, Coleman-Liau Index, and Automated Readability Index (ARI)." },
    { q: "What grade level should I target?", a: "For general web content: Grade 6–8 (Flesch-Kincaid). For technical documentation: Grade 10–12. For academic writing: Grade 12+. The Flesch Reading Ease score inverts this — higher is easier." },
    { q: "Does it explain which sentences are too complex?", a: "Yes. Toggle the sentence-level view to highlight sentences that exceed your target complexity level, so you know exactly what to rewrite." },
    { q: "Is my text sent anywhere?", a: "No. All scoring runs client-side in your browser." },
  ],

  "/real-age": [
    { q: "What is 'Life in Numbers'?", a: "It shows your age in units that feel more real than years: heartbeats, breaths, days alive, hours of sleep, and more. Enter your birth date for a personalized breakdown." },
    { q: "How are the estimates calculated?", a: "Using average physiological rates (e.g., resting heart rate 70 bpm, 12–20 breaths per minute) multiplied by your exact age in seconds. Individual variation is not accounted for." },
    { q: "Does it need my personal health data?", a: "No. Only your birth date is used. No health metrics are collected." },
    { q: "Is the tool useful for anything beyond curiosity?", a: "Some people find it useful for perspective — understanding how much time has passed at the level of individual heartbeats can shift how you think about daily decisions." },
  ],

  "/regex-tester": [
    { q: "What regex flavor does the tester use?", a: "JavaScript regex (ECMAScript 2018+), which includes named capture groups, lookbehind assertions, and Unicode property escapes. The tester runs in the browser, so the behavior exactly matches what you'd get in a JS app." },
    { q: "Does it highlight all matches in real time?", a: "Yes. Matches are highlighted in the test string as you type the pattern, with separate colors for groups." },
    { q: "Can I test global, case-insensitive, and multiline flags?", a: "Yes. Toggle g, i, m, s (dotAll), u (Unicode), and y (sticky) flags with dedicated buttons." },
    { q: "Does it show capture groups?", a: "Yes. Named and numbered capture groups are listed below the match highlights with their matched values." },
  ],

  "/release-notes-formatter": [
    { q: "What does the release notes formatter do?", a: "Converts a raw list of changelog bullets into categorized, formatted release notes. It groups entries into New Features, Improvements, Bug Fixes, and Deprecations, then formats the output for your target audience." },
    { q: "What export formats are available?", a: "Markdown, HTML, and plain text. Use Markdown for GitHub releases, HTML for in-app changelogs, plain text for email or Slack." },
    { q: "Can it clean up developer-written bullets?", a: "Yes. The formatter strips commit-style prefixes (feat:, fix:, chore:) and rewrites bullets in a user-facing voice." },
    { q: "Can I version-stamp the release notes?", a: "Yes. Enter the version number and release date and they appear in the header of the formatted output." },
  ],

  "/rice-calculator": [
    { q: "What is the RICE framework?", a: "RICE stands for Reach, Impact, Confidence, and Effort. Score each potential feature on these four dimensions and calculate a priority score: (Reach × Impact × Confidence) ÷ Effort. Higher scores get prioritized first." },
    { q: "What units does each dimension use?", a: "Reach: users per time period. Impact: 3 (massive), 2 (high), 1 (medium), 0.5 (low), 0.25 (minimal). Confidence: percentage (100% = fully confident). Effort: person-months." },
    { q: "Can I compare multiple features in one session?", a: "Yes. Add up to 20 items, score each, and the calculator ranks them by RICE score in real time." },
    { q: "Can I export the prioritized list?", a: "Yes. Export as CSV to paste into a Jira backlog, Notion table, or product roadmap doc." },
  ],

  "/schema-generator": [
    { q: "What schema types does the generator support?", a: "Article, BlogPosting, FAQPage, HowTo, Product, Review, AggregateRating, Event, Person, Organization, BreadcrumbList, and WebSite." },
    { q: "What format does it output?", a: "JSON-LD in a <script type='application/ld+json'> tag — the format Google recommends for structured data." },
    { q: "How do I add the output to my page?", a: "Paste the <script> tag into your HTML <head>. In WordPress, use a plugin like RankMath or Yoast, or a custom header code field." },
    { q: "Can I validate the output?", a: "Yes. After generating, click 'Test in Google Rich Results' to open your schema in Google's Rich Results Test tool." },
  ],

  "/screenshot-beautifier": [
    { q: "What does the screenshot beautifier add to my image?", a: "Background (solid color, gradient, or mesh), drop shadow, window chrome (macOS or browser frame), rounded corners, and padding. The result looks like a polished product screenshot." },
    { q: "What export size does it produce?", a: "The output matches your chosen canvas size. Common presets: Twitter/X (1200×675), 16:9 presentation (1920×1080), and square (1080×1080)." },
    { q: "Can I adjust the padding and scale of my screenshot?", a: "Yes. Use the scale and padding sliders to control how much of the canvas the screenshot occupies." },
    { q: "Does it add a macOS or browser window frame?", a: "Yes. Toggle the window chrome option to add a realistic macOS menu bar + traffic lights or a browser chrome — useful for product marketing assets." },
  ],

  "/scroll-animation": [
    { q: "What is a scroll-driven CSS animation?", a: "A CSS animation that's tied to the scroll position of the page rather than playing on a timer. As the user scrolls, elements fade in, slide, or scale — without any JavaScript." },
    { q: "What browser support does scroll-driven animation have?", a: "Chrome 115+, Edge 115+, Opera 101+. Firefox and Safari support is limited as of 2025 — the generator adds a @supports check and a fallback for unsupported browsers." },
    { q: "What animation effects can I generate?", a: "Fade in, slide up/down/left/right, scale in, rotate in, and blur in. Each has configurable duration, delay, and easing." },
    { q: "Can I preview the animation in the tool?", a: "Yes. A live preview shows the animation triggered by scrolling within the tool's preview area before you copy the CSS." },
  ],

  "/seo-content-analyzer": [
    { q: "What does the SEO content analyzer check?", a: "Keyword density and distribution, heading hierarchy (H1–H4), internal and external link counts, meta tag presence, paragraph length, sentence complexity, estimated reading time, and an overall SEO score." },
    { q: "Does it require my target keyword?", a: "Yes. Enter your primary keyword so the analyzer can calculate density and flag overuse (keyword stuffing) or underuse." },
    { q: "Does it analyze live URLs or just pasted text?", a: "Both. Paste your content or enter a URL. For URL input, the tool fetches and extracts the main content before analysis." },
    { q: "Does it give specific suggestions for improvement?", a: "Yes. Each flagged issue includes a one-line fix description — e.g., 'Add an H2 above this section' or 'Keyword density is 0.3% — target 1–2%'." },
  ],

  "/text-cleaner": [
    { q: "What does the text cleaner remove?", a: "Extra whitespace, duplicate blank lines, Windows-style line endings (\\r\\n → \\n), zero-width characters, smart quotes (converting to straight quotes), non-breaking spaces, and leading/trailing whitespace per line." },
    { q: "Can I remove only specific things?", a: "Yes. Toggle each cleaning operation independently — for example, strip smart quotes without changing line endings." },
    { q: "Is it useful for cleaning up text copied from PDFs or Word docs?", a: "Yes. PDFs and Word often include invisible formatting characters, non-breaking spaces, and inconsistent line endings. The cleaner handles all of these." },
    { q: "Does it have an undo?", a: "Yes. Cmd+Z / Ctrl+Z restores the original input." },
  ],

  "/text-diff": [
    { q: "What does the text diff tool show?", a: "A character-level and line-level diff of two text inputs, with additions highlighted in green, deletions in red, and unchanged lines in neutral. Toggle between inline and side-by-side views." },
    { q: "Is it useful for comparing document versions?", a: "Yes. Paste the old version on the left and the new version on the right to see exactly what changed." },
    { q: "Does it ignore whitespace differences?", a: "Toggle 'Ignore whitespace' to skip differences that are only indentation or trailing spaces." },
    { q: "Can I download the diff?", a: "Yes. Export as a unified diff (.diff) file or copy the highlighted output as HTML." },
  ],

  "/timestamp": [
    { q: "What does the timestamp converter do?", a: "Converts Unix timestamps (seconds or milliseconds since epoch) to human-readable date-times, and converts date-times back to Unix timestamps. Shows the result in UTC and your local timezone simultaneously." },
    { q: "Does it support millisecond timestamps?", a: "Yes. Auto-detects whether the input is seconds (10 digits) or milliseconds (13 digits) and converts accordingly." },
    { q: "Can I convert a date I type to a timestamp?", a: "Yes. Enter any date-time string (ISO 8601 or natural language like 'Jan 1, 2025 12:00 PM') and get the Unix timestamp." },
    { q: "Why do different systems use different timestamp formats?", a: "Unix time counts seconds since 1970-01-01T00:00:00Z. JavaScript Date, Java, and some APIs use milliseconds. Some databases use microseconds. The converter handles all three." },
  ],

  "/url-encoder": [
    { q: "What does URL encoding do?", a: "Converts characters that are not safe in a URL — spaces, special characters, non-ASCII — into percent-encoded form (e.g., space becomes %20). Required for query parameter values, form submissions, and API calls." },
    { q: "What is the difference between encodeURI and encodeURIComponent?", a: "encodeURI encodes a full URL and preserves characters with structural meaning like / and ?. encodeURIComponent encodes a value intended for a query parameter and encodes / and ? too. Use encodeURIComponent for values, encodeURI for complete URLs." },
    { q: "Can I parse and encode individual query parameters?", a: "Yes. The tool parses a URL and lets you inspect and edit individual query parameters, then reconstructs the properly encoded URL." },
    { q: "Is my URL sent to a server?", a: "No. Encoding and decoding run client-side." },
  ],

  "/utm-builder": [
    { q: "What UTM parameters does the builder support?", a: "utm_source, utm_medium, utm_campaign, utm_term, utm_content, and optionally utm_id. All five core GA4 parameters are generated correctly." },
    { q: "Does it validate the URL I enter?", a: "Yes. The base URL is validated before appending parameters, and it warns you if the URL already contains a UTM query string that would be overwritten." },
    { q: "Can I generate UTM links in bulk?", a: "Yes. Bulk mode accepts a CSV of campaigns or ad variants and generates a UTM URL for each row." },
    { q: "Does it save my common sources and mediums as presets?", a: "Yes. Save frequently used source/medium/campaign combinations as presets so you can reuse them without re-entering each time." },
  ],

  "/uuid-generator": [
    { q: "What identifier types can I generate?", a: "UUID v4 (random), UUID v1 (time-based, deprecated for new use), UUID v7 (time-ordered, recommended for database primary keys), and ULID (Universally Unique Lexicographically Sortable Identifier)." },
    { q: "What is the difference between UUID v4 and ULID?", a: "UUID v4 is fully random and doesn't sort by creation time. ULID starts with a time component so records created close together sort adjacent — useful for database indexes that benefit from sequential insertion order." },
    { q: "Can I generate UUIDs in bulk?", a: "Yes. Set the count (up to 1000) and click Generate to get a list you can copy or download as a text file." },
    { q: "Are the generated UUIDs cryptographically random?", a: "Yes. UUID v4 uses the browser's crypto.getRandomValues(), not Math.random()." },
  ],

  "/video-converter": [
    { q: "Which video formats does it convert between?", a: "MP4 (H.264) to WebM (VP8/VP9), and WebM to MP4. These are the two formats needed for universal browser video support." },
    { q: "Is video processing done in the browser?", a: "Yes. The converter uses FFmpeg compiled to WebAssembly. Your video files never leave your machine." },
    { q: "How long does conversion take?", a: "Conversion is CPU-bound and depends on video length and resolution. A 1080p 5-minute video takes roughly 2–5 minutes in the browser." },
    { q: "Is there a file size or length limit?", a: "No enforced limit, but very large files (1 GB+) may exhaust browser memory. For large files, a desktop tool like Handbrake will be more reliable." },
  ],

  "/word-frequency": [
    { q: "What does the word frequency analyzer show?", a: "The count of each unique word in your text, sorted by frequency, displayed as a ranked list and optionally as a bar chart. Common stop words (the, a, is) can be filtered out." },
    { q: "Is it useful for SEO keyword analysis?", a: "Yes. Paste your content to see which terms appear most often — a quick check for keyword focus before publishing." },
    { q: "Can I exclude specific words?", a: "Yes. Add custom words to the ignore list alongside the built-in stop word filter." },
    { q: "Can I export the frequency data?", a: "Yes. Download as CSV for further analysis in a spreadsheet." },
  ],

  "/year-progress": [
    { q: "What does the Year Progress tool show?", a: "How far through the current year you are — as a percentage, a progress bar, and days remaining — with editorial commentary about what that means." },
    { q: "Does the progress bar count leap years?", a: "Yes. The calculation uses the actual number of days in the current year." },
    { q: "What does 'with opinions' mean?", a: "The tool adds honest, occasionally uncomfortable editorial notes about the year's progress — not just the number." },
    { q: "Does it track quarterly or monthly progress?", a: "Yes. Toggle between yearly, quarterly, and monthly views to see where you are within each period." },
  ],

};
