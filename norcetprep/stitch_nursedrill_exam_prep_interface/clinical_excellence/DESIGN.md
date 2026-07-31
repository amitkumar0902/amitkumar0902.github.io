---
name: Clinical Excellence
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#414848'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#717978'
  outline-variant: '#c0c8c7'
  surface-tint: '#406563'
  primary: '#001918'
  on-primary: '#ffffff'
  primary-container: '#042f2e'
  on-primary-container: '#719896'
  inverse-primary: '#a7cecc'
  secondary: '#006b5f'
  on-secondary: '#ffffff'
  secondary-container: '#62fae3'
  on-secondary-container: '#007165'
  tertiary: '#001916'
  on-tertiary: '#ffffff'
  tertiary-container: '#00302a'
  on-tertiary-container: '#00a392'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c2eae8'
  primary-fixed-dim: '#a7cecc'
  on-primary-fixed: '#00201f'
  on-primary-fixed-variant: '#274d4c'
  secondary-fixed: '#62fae3'
  secondary-fixed-dim: '#3cddc7'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005047'
  tertiary-fixed: '#71f8e4'
  tertiary-fixed-dim: '#4fdbc8'
  on-tertiary-fixed: '#00201c'
  on-tertiary-fixed-variant: '#005048'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '800'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '500'
    lineHeight: '1.6'
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  caption:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 48px
  margin-mobile: 16px
---

## Brand & Style
The design system embodies a high-performance clinical environment where precision and prestige are paramount. It targets elite medical professionals and researchers who require data-heavy tools that feel as sophisticated as high-end hardware.

The aesthetic is a fusion of **Modern Corporate** and **Glassmorphism**. It utilizes semi-transparent surfaces, ultra-refined typography, and a deliberate contrast between deep, authoritative tones and vibrant, technical accents. The emotional response is one of total reliability, extreme focus, and a sense of using an expensive, purpose-built professional instrument.

## Colors
The palette is anchored by **Deep Slate Teal**, providing a prestigious, high-contrast foundation for text and navigation. **Electric Mint** serves as the high-performance accent, used sparingly for primary actions, progress indicators, and critical data points to ensure they "pop" against the dark base.

**Studio White** is the mandatory background color to maintain a clinical, sterile environment. Glass-morphic surfaces utilize white with 70-80% opacity, a 12px backdrop blur, and a 1px border in **Surface Border** (#E2E8F0) to define edges without adding visual weight.

## Typography
This design system uses **Manrope** exclusively for its condensed, technical character and geometric clarity. 

High-contrast weights are essential: **ExtraBold (800)** is reserved for primary headlines to establish an authoritative hierarchy, while **Medium (500)** is the standard for body text to maintain legibility in dense data environments. Labels should use **SemiBold (600)** with a slight letter-spacing increase to mimic the look of engraved medical equipment interfaces.

## Layout & Spacing
The layout follows a strict **12-column fluid grid** for desktop, transitioning to a **4-column grid** for mobile. Spacing is based on a **4px base unit** to allow for the extreme precision required by clinical dashboards.

Margins are generous on desktop to create a "gallery" feel for data modules, while gutters remain tight at 24px to keep related diagnostic information visually connected. Modules and glass cards should utilize a consistent padding of 32px to ensure the internal content has "room to breathe" against the thin structural borders.

## Elevation & Depth
Depth is conveyed through a combination of **Glassmorphism** and **Ambient Shadows**. 

1.  **Glass Layers:** Primary containers use semi-transparent backgrounds with a `backdrop-filter: blur(12px)`. This creates a layered stack that feels deep and sophisticated.
2.  **Sprawling Shadows:** Use very low-opacity (4-8%), large-radius (40px+) shadows to lift cards off the Studio White background. The shadows should have a slight teal tint (#042F2E) to stay cohesive with the brand.
3.  **Inner Glow:** Primary buttons and active states feature a 1px inner box-shadow (white at 20% opacity) on the top edge to simulate a beveled, high-end hardware finish.

## Shapes
The shape language is controlled and "Soft-Industrial." Components use a **0.5rem (8px)** base radius. This provides enough softness to feel modern and accessible while maintaining the sharp, disciplined lines of professional medical equipment. Smaller elements like tags and status chips may use a pill-shape to distinguish them from structural UI components.

## Components
-   **Buttons:** Primary buttons use a Deep Slate Teal background with an Electric Mint 2px bottom-border or inner-glow. Text is Medium weight. Secondary buttons are "ghost" style with a 1px Surface Border.
-   **Cards:** All cards must be glass-morphic. Use a 1px border (#E2E8F0) and a sprawling ambient shadow. Backgrounds are `#FFFFFF` at 80% opacity.
-   **Inputs:** Fields are Studio White with a subtle 1px border. On focus, the border transitions to Electric Mint with a 2px outer "glow" (blur) of the same color.
-   **Icons:** Use 2px stroke-width line icons. All line endings and joins must have rounded caps. Icons should be sized to 20px or 24px and rendered in Deep Slate Teal or Electric Mint.
-   **Data Modules:** Utilize "Micro-labels" (10px, All-Caps) for data headers to maximize the vertical space for the primary metrics rendered in ExtraBold.
-   **Status Indicators:** Use Electric Mint for "Normal/Active," a muted Slate for "Inactive," and a crisp Coral for "Critical" alerts to maintain the technical palette.