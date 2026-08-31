---
name: Workafella Design System
colors:
  surface: '#faf9f7'
  surface-dim: '#dadad8'
  surface-bright: '#faf9f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f1'
  surface-container: '#efeeec'
  surface-container-high: '#e9e8e6'
  surface-container-highest: '#e3e2e0'
  on-surface: '#1a1c1b'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f1ef'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#7b5900'
  on-secondary: '#ffffff'
  secondary-container: '#fdbb12'
  on-secondary-container: '#6c4d00'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#3b0900'
  on-tertiary-container: '#e65127'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#ffdea4'
  secondary-fixed-dim: '#fdbb12'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5d4200'
  tertiary-fixed: '#ffdbd1'
  tertiary-fixed-dim: '#ffb5a1'
  on-tertiary-fixed: '#3b0900'
  on-tertiary-fixed-variant: '#882000'
  background: '#faf9f7'
  on-background: '#1a1c1b'
  surface-variant: '#e3e2e0'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-md:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.4'
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
  kpi-metric:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: -0.03em
spacing:
  unit: 8px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  container-max: 1440px
---

## Brand & Style

The design system is engineered for a premium workspace management experience that bridges the gap between high-end architectural precision and boutique-hotel luxury. The brand personality is authoritative yet welcoming, focusing on "The Cascade" as a central motif to represent progression and structural integrity.

The visual style is **Architectural Minimalism**. It rejects the softness of common SaaS platforms in favor of sharp 0px corners, high-contrast ink-on-canvas surfaces, and tactical use of Signature Gold. The aesthetic prioritizes "Quiet Luxury"—where quality is conveyed through exquisite typography, generous whitespace, and fine geometric linework rather than shadows or decorative gradients.

## Colors

The palette is anchored by **Canvas (#F8F7F5)**, a warm off-white that provides a sophisticated, tactile background reminiscent of high-grade paper. 

- **Ink (#161616)** is used for all primary structural elements, navigation, and core typography to ensure a heavy, grounded feel.
- **Signature Gold (#F5B400)** acts as the functional accent, reserved for primary actions and active state indicators.
- **Ember (#D9481E)** is used with extreme restraint for featured callouts or urgent system notifications.
- **Charcoal (#3A3A3A)** provides the necessary "middle ground" for borders and secondary metadata, ensuring the UI remains legible without breaking the high-contrast architectural intent.

## Typography

This design system utilizes a dual-type approach to balance character with utility. 

**Space Grotesk** is the voice of the brand. Its technical, angular glyphs are used for all display headings and significant metrics. Large numbers (KPIs) should always use Space Grotesk to lean into the architectural aesthetic.

**Inter** handles the functional heavy lifting. It is used for all body copy, data tables, and dense UI components. Its neutral, utilitarian nature ensures that complex workspace data remains clear and accessible.

For mobile, `display-lg` scales down to 32px, while body sizes remain constant to preserve legibility.

## Layout & Spacing

The layout philosophy is a **Structured Fixed Grid**. On desktop, content is housed within a 1440px container using a 12-column system. On mobile, a 4-column system is used with 20px side margins.

The spacing rhythm is strictly based on 8px increments. Generous padding is a hallmark of this design system, intended to evoke the spaciousness of a luxury hotel lobby. Every section should have breathing room, using `margin-desktop` (64px) to separate major content blocks. 

Vertical sequences and progress steps follow "The Cascade" logic: elements are offset by 16px horizontally to create a stepped diagonal flow.

## Elevation & Depth

In this design system, depth is achieved through **Tonal Layering and Geometric Linework** rather than shadows.

- **Level 0 (Base):** Canvas (#F8F7F5).
- **Level 1 (Cards/Panels):** White (#FFFFFF) or Canvas with a 1px Charcoal (#3A3A3A) border.
- **Level 2 (High-Visibility):** Dark textured gradients (Ink #161616 to Charcoal #3A3A3A) used for premium feature cards or header banners.

**The Cascade Motif:** 
Depth is reinforced by "The Cascade"—diagonal, stepped small triangles used as dividers or edge accents. Cards utilize a **clipped top-right corner** at a 45-degree angle (16px clip) to create a "folded flag" appearance, adding a physical, boutique dimension to digital surfaces.

## Shapes

The shape language is strictly **Sharp (0px)**. 

Every button, input field, card, and modal must have 90-degree corners. This reinforces the architectural and structural integrity of the brand. To prevent the UI from feeling "harsh," use the Canvas color and fine Charcoal linework to soften the transitions. 

Small equilateral triangles (8px) are used as functional markers—specifically a Signature Gold triangle for active navigation states, pointing inward toward the content.

## Components

### Buttons
- **Primary:** Solid Signature Gold (#F5B400) fill, Ink (#161616) text. 0px border-radius.
- **Secondary:** Ink (#161616) outline (1px), Ink text, Canvas background.
- **Ghost:** No background, Ink text, 1px gold wedge icon on hover.

### Cards
- Always 0px border-radius.
- Top-right corner is clipped (45-degree angle, 16px depth).
- 1px Charcoal (#3A3A3A) border.

### Active States & Navigation
- Active sidebar items are marked by a Signature Gold triangle ("The Cascade" wedge) aligned to the right edge.
- Selected tabs use a bottom 2px Gold border that extends 8px beyond the text on both sides.

### Input Fields
- Underline-only style or full 1px Charcoal border.
- On focus, the border turns Signature Gold and a small 4px gold triangle appears in the top-left corner.

### Empty States
- Utilize a fine Signature Gold hairline geometric lattice pattern in the background to maintain the premium feel even when content is absent.