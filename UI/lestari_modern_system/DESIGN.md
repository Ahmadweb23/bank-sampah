---
name: Lestari Modern System
colors:
  surface: '#f9f9ff'
  surface-dim: '#d0daf0'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d9e3f9'
  on-surface: '#121c2c'
  on-surface-variant: '#3f4947'
  inverse-surface: '#273141'
  inverse-on-surface: '#ebf1ff'
  outline: '#6f7977'
  outline-variant: '#bfc9c6'
  surface-tint: '#246862'
  primary: '#003a36'
  on-primary: '#ffffff'
  primary-container: '#00534d'
  on-primary-container: '#83c5bd'
  inverse-primary: '#91d3ca'
  secondary: '#0a45e6'
  on-secondary: '#ffffff'
  secondary-container: '#3862ff'
  on-secondary-container: '#f9f7ff'
  tertiary: '#3a3225'
  on-tertiary: '#ffffff'
  tertiary-container: '#52483a'
  on-tertiary-container: '#c5b7a5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#acefe6'
  primary-fixed-dim: '#91d3ca'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#00504a'
  secondary-fixed: '#dde1ff'
  secondary-fixed-dim: '#b8c3ff'
  on-secondary-fixed: '#001355'
  on-secondary-fixed-variant: '#0035bd'
  tertiary-fixed: '#efe0cd'
  tertiary-fixed-dim: '#d3c4b2'
  on-tertiary-fixed: '#221a0f'
  on-tertiary-fixed-variant: '#4f4537'
  background: '#f9f9ff'
  on-background: '#121c2c'
  surface-variant: '#d9e3f9'
typography:
  display-currency:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding: 20px
  gutter: 16px
  stack-sm: 4px
  stack-md: 12px
  stack-lg: 24px
  section-gap: 32px
---

## Brand & Style

The design system is crafted for a forward-looking environmental financial service. It balances the ecological roots of waste management with the precision of a 2026 fintech application. The personality is **Professional**, **Community-Oriented**, and **Trustworthy**, avoiding the "gritty" stereotypes of waste management in favor of a polished, high-tech banking experience.

The visual style is a hybrid of **Modern Minimalism** and **Glassmorphism**, characterized by:
- **Warm Cleanliness:** Using a soft cream base to feel more approachable and organic than clinical white.
- **Depth through Softness:** Utilizing elevation and subtle shadows rather than harsh lines to define the interface.
- **Financial Clarity:** Highlighting monetary values with high-contrast, vibrant accents to instill confidence in the user's growing balance.
- **Community Warmth:** Soft edges and generous whitespace that make the app feel accessible to users of all ages within the community.

## Colors

The palette is designed to evoke both sustainability and financial reliability.

- **Primary (Deep Teal):** Represents the core identity of "Bank Sampah." It is used for primary buttons, navigation headers, and successful transaction states.
- **Secondary (Royal Blue):** Reserved exclusively for financial indicators—balances, savings growth, and "Tarik Tunai" actions—to separate money-related data from general app navigation.
- **Background & Surfaces:** The `Soft Cream` background provides a gentle, non-glare canvas that makes `Pure White` surfaces "pop" with clean distinction.
- **Support Accent (Beige):** Used for subtle dividers, inactive states, or secondary badge backgrounds to maintain a warm tonal range.
- **Text (Charcoal):** Provides high legibility against cream and white surfaces without the harshness of pure black.

## Typography

The typography system uses **Inter** for its exceptional clarity in data-heavy environments. 

- **Financial Focus:** `display-currency` is the hero style, used for the main balance (e.g., "Rp 150.000"). It uses a tighter letter-spacing and bold weight to feel impactful.
- **Information Hierarchy:** Headers use Medium to Bold weights (600-700) to ensure clear sectioning on mobile devices.
- **Language Support:** All labels and instructions are optimized for **Bahasa Indonesia**, ensuring that longer words common in the language (e.g., "Pertanggungjawaban") don't break the layout.
- **Readability:** Body text maintains a generous line height to ensure high legibility for community members reading transaction histories.

## Layout & Spacing

This design system follows a **Fluid Grid** philosophy with a focus on mobile-first interaction.

- **Margins:** A standard `20px` horizontal margin is used for mobile containers to allow the soft shadows of cards to be visible without being clipped by the screen edge.
- **Vertical Rhythm:** A base-8 spacing system ensures consistency. Sections (like "Kategori Sampah" vs "Riwayat") are separated by `32px` to provide breathing room.
- **Responsive Behavior:** 
  - **Mobile:** 1-column layout for cards. 
  - **Tablet/Desktop:** Content is centered in a max-width container (768px for tablet, 1140px for desktop) with multi-column card grids (2 or 3 columns).
- **Safe Areas:** All interactive elements maintain a minimum 44px hit target, regardless of their visual size.

## Elevation & Depth

To maintain a modern and friendly aesthetic, the design system avoids borders entirely, relying on **Ambient Shadows** and **Tonal Layering**.

- **Surface Layering:** White cards sit atop the Soft Cream background.
- **The "Soft Float" Shadow:** Use a very diffused, low-opacity shadow for cards: `0px 10px 30px rgba(0, 83, 77, 0.06)`. Note the subtle Deep Teal tint in the shadow to keep it "organic" rather than grey.
- **Active State:** When a user taps a card or button, the shadow should decrease in blur and the element should scale slightly (98%), giving a tactile "pressed" feel.
- **Navigation Depth:** The bottom navigation bar uses a background blur (Backdrop Filter: 20px) and a subtle top-shadow to feel like it is floating above the content.

## Shapes

The shape language is defined by **Large, Welcoming Curves**.

- **Primary Containers:** Cards and main sections use `rounded-2xl` (1.5rem / 24px) to create a friendly, non-intimidating appearance.
- **Interactive Elements:** Buttons and input fields use `rounded-xl` (1rem / 16px).
- **Selection Indicators:** Small badges or chips (e.g., status "Selesai") use a full-pill radius for maximum distinction from square-ish text blocks.
- **Visual Consistency:** Icons must follow the same rounded aesthetic—avoid sharp corners in iconography; use "Rounded" or "Duotone" icon sets.

## Components

### Buttons
- **Primary:** Deep Teal background, white text, `rounded-xl`. High-elevation shadow.
- **Secondary (Financial):** Royal Blue background, white text. Used for "Tukar Poin" or "Tarik Saldo".
- **Ghost:** No background, Deep Teal text. Used for "Lihat Semua" or "Batal".

### Cards (Kartu Transaksi)
- Pure white background, `rounded-2xl`, soft ambient shadow.
- Internally, use `stack-md` (12px) for spacing between the icon, label, and value.
- No borders; use the Cream background as the natural separator.

### Input Fields (Formulir)
- Background: Soft Cream or a very light Beige.
- `rounded-xl`, 16px horizontal padding.
- On focus: Background turns white and gains a soft Deep Teal outer glow (shadow).

### Chips (Label Kategori)
- Used for waste types (e.g., "Plastik", "Kertas").
- Background: 10% opacity of the category color; Text: 100% opacity of the same color.
- Fully rounded (Pill-shaped).

### Lists (Daftar Riwayat)
- Interactive list items should have a transparent background that shifts to a subtle Beige on press.
- Use a small `8px` gap between list items rather than a divider line.

### Progress Bars
- Background: Beige.
- Fill: Deep Teal (for general goals) or Royal Blue (for financial goals).
- Height: 8px, fully rounded.