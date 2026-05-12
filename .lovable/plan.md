## Problem

The header logo currently uses the PNG with `h-7 w-7 rounded-full object-cover`, which crops a non-square asset into a circle and squashes the mark. It looks broken at small size on the dark glass pill.

## Fix

Mirror the approach from the Healthful Path Conference project:

1. **Create `src/components/landing/IndigoLogo.tsx`** — a small SVG component (violet circle, white "IL" wordmark, Comfortaa-style), sized via a `size` prop, themed via design tokens (use `--primary` / a new `--brand-indigo` token in `oklch` rather than the raw HSL from the source project so it fits the ultra-dark INDIGO palette).
2. **Update `SiteHeader.tsx`**:
   - Replace the `<img>` + cropped circle with `<IndigoLogo size={32} />`.
   - Render the wordmark next to it: `Indigo Lab` in the brand display style, plus the muted `· Психология бизнеса` tagline kept as-is.
   - Keep the glass pill, spacing, and nav untouched.
3. **Remove** the now-unused `import logo from "@/assets/indigo-logo.png"` from the header (leave the asset file in place for OG/other uses).

No changes to other sections, routing, or styles beyond optionally adding one token in `src/styles.css` if the violet needs a dedicated variable.

## Files touched

- `src/components/landing/IndigoLogo.tsx` (new)
- `src/components/landing/SiteHeader.tsx` (edit)
- `src/styles.css` (optional: add `--brand-indigo` token)
