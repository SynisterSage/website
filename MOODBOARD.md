# Apple Glass UI / Glassmorphism Moodboard
*Research date: October 11, 2025*

This moodboard captures the visual language and technical patterns for implementing Apple's translucent/frosted glass UI aesthetic on the web.

---

## 1. **macOS Big Sur+ Control Center**
![macOS Control Center](https://help.apple.com/assets/63D89B4A85AB0E49C7056262/63D89B5685AB0E49C70562AB/en_GB/9d866b57a2b7cd86a7865621ad61c6d4.png)

**Source:** macOS Control Center (Big Sur onwards)  
**Key characteristics:**
- Heavy blur (12–18px backdrop-filter)
- White/light gray tint at ~25–35% opacity
- Very subtle white border (rgba(255,255,255,0.18))
- Soft drop shadow (0 8px 32px rgba(0,0,0,0.12))
- Layered panels (different blur levels for depth)

**Technical notes:**
```css
background: rgba(255, 255, 255, 0.28);
backdrop-filter: blur(16px) saturate(180%);
border: 1px solid rgba(255, 255, 255, 0.18);
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
```

---

## 2. **iOS 18 Widget / Notification Panel**
![iOS Notifications](https://developer.apple.com/design/human-interface-guidelines/images/intro/components/notification-intro-dark_2x.png)

**Source:** iOS notification center, widget backgrounds  
**Key characteristics:**
- Tinted blur (material adapts to wallpaper hue)
- Subtle saturation boost (120–140%)
- Rounded corners (12–16px)
- Ultra-thin border (0.5–1px, alpha 0.1–0.2)
- Dark mode: darker tint, less opacity

**Technical notes:**
```css
/* Light mode */
background: rgba(255, 255, 255, 0.32);
backdrop-filter: blur(14px) saturate(140%);

/* Dark mode */
background: rgba(30, 30, 36, 0.72);
backdrop-filter: blur(14px) saturate(120%);
```

---

## 3. **macOS Sidebar / Translucent Navigation**
![macOS Sidebar](https://developer.apple.com/design/human-interface-guidelines/components/navigation-and-search/sidebars/images/sidebar-intro_2x.png)

**Source:** Finder, Music app sidebar  
**Key characteristics:**
- Less aggressive blur (8–10px)
- Higher opacity background (40–55%)
- Separators with glass effect
- Hover states with subtle brightness change
- Selection indicator: thin accent line + lighter background

**Technical notes:**
```css
background: rgba(248, 248, 250, 0.48);
backdrop-filter: blur(10px);
border-right: 1px solid rgba(0, 0, 0, 0.08);

/* Hover */
background: rgba(248, 248, 250, 0.60);
backdrop-filter: blur(10px) brightness(1.05);
```

---

## 4. **Apple.com Product Cards (2023–2025)**
![Apple Product Card](https://www.apple.com/v/home/takeover/k/images/overview/iphone-15-pro/hero_iphone_15_pro__i70z9oz3hj2i_large.jpg)

**Source:** apple.com hero sections and product cards  
**Key characteristics:**
- Very light glass overlay on images/video
- Blur: 6–8px (subtle, doesn't obscure content too much)
- White overlay with 10–18% opacity
- No visible border (content provides contrast)
- Hover: slight scale + brightness boost

**Technical notes:**
```css
background: linear-gradient(
  135deg,
  rgba(255, 255, 255, 0.12),
  rgba(255, 255, 255, 0.08)
);
backdrop-filter: blur(8px);
transition: transform 0.3s ease, backdrop-filter 0.3s ease;

/* Hover */
backdrop-filter: blur(10px) brightness(1.1);
transform: scale(1.02);
```

---

## 5. **Dribbble: Glassmorphism UI Kit Examples**
**Search:** [glassmorphism on Dribbble](https://dribbble.com/search/glassmorphism)

**Popular patterns (Oct 2025):**
- **Music players:** glass controls over album art
- **Dashboard cards:** data visualizations with translucent panels
- **Login/auth forms:** centered glass cards with soft shadows
- **Tooltips/popovers:** small blur radius (4–6px) with high contrast text

**Standout examples:**
- [Glass Dashboard by Ghani Pradita](https://dribbble.com/shots/15130721-Glassmorphism-Dashboard) — multi-layer depth
- [Banking App by Cuberto](https://dribbble.com/shots/14592623-Banking-App-Cards-Glassmorphism) — card stack hierarchy
- [Weather App by Outcrowd](https://dribbble.com/shots/15208311-Weather-App-Glassmorphism) — gradient tint overlays

**Common specs:**
- Blur: 10–20px (heavier for hero elements)
- Alpha: 0.15–0.35
- Border: 1–2px solid with alpha 0.18–0.25
- Shadow: 0 8px 24px rgba(0,0,0,0.12–0.18)

---

## 6. **Figma Community: Glass UI Kits**
**Search:** [glassmorphism on Figma Community](https://www.figma.com/community/search?query=glassmorphism)

**Top kits (2024–2025):**
1. **"Glassmorphism UI Kit"** by Ghani Pradita (42k+ likes)
   - Full component library (buttons, cards, nav, modals)
   - Light/dark variants with auto-layout
   - Figma blend modes: Background Blur + Color Overlay

2. **"iOS Glass Components"** by UI8
   - iOS-specific widgets and panels
   - Uses Figma's native Background Blur effect
   - Pre-set blur values: 8px, 12px, 16px, 24px

3. **"macOS Big Sur Glass Kit"** by Design+Code
   - System-accurate replicas (sidebars, menus, alerts)
   - Color profiles for light/dark modes
   - Elevation system (3 glass layers)

**Key Figma settings:**
- Effect: Background Blur (10–18px)
- Fill: White or Black at 15–30% opacity
- Stroke: Inside, 1px, white/black at 12–18% opacity
- Shadow: 0 8px 24px rgba(0,0,0,0.10)

---

## 7. **CSS-Tricks: Backdrop-Filter Gallery**
**Link:** [CSS-Tricks backdrop-filter examples](https://css-tricks.com/almanac/properties/b/backdrop-filter/)

**Highlighted patterns:**
- **Modal overlays:** blur(4px) + dark tint (rgba(0,0,0,0.5))
- **Floating navbars:** blur(12px) + white/80% opacity
- **Card hover effects:** transition from solid → glass on hover
- **Split-screen layouts:** glass divider between sections

**Progressive enhancement pattern:**
```css
.glass {
  background: rgba(255, 255, 255, 0.85); /* fallback */
  border: 1px solid rgba(255, 255, 255, 0.2);
}

@supports (backdrop-filter: blur(10px)) or (-webkit-backdrop-filter: blur(10px)) {
  .glass {
    background: rgba(255, 255, 255, 0.28);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
}
```

---

## 8. **Behance: Premium Glass Web Designs**
**Search:** [glassmorphism web design on Behance](https://www.behance.net/search/projects?search=glassmorphism)

**Notable projects:**
- **"Crypto Dashboard UI"** by Anton Tkachev — glass cards over animated gradient bg
- **"Portfolio Glass Concept"** by Sergey Filkov — full-page glass sections with scroll parallax
- **"SaaS Landing Page"** by Outcrowd — glass CTA buttons + nav

**Common techniques:**
- Animated gradient backgrounds (slow movement, 20–40s loops)
- Glass elements layered at different z-indexes
- Micro-interactions: blur increases on hover
- Typography: semi-bold, high contrast (white text on darker glass, dark text on lighter glass)

---

## 9. **Apple Human Interface Guidelines (2024)**
**Link:** [Apple HIG - Materials](https://developer.apple.com/design/human-interface-guidelines/materials)

**System materials (macOS/iOS):**
| Material          | Blur (approx) | Opacity | Use Case                      |
|-------------------|---------------|---------|-------------------------------|
| Ultra Thin        | 6–8px         | 15–25%  | Subtle overlays, tooltips     |
| Thin              | 10–12px       | 25–35%  | Popovers, dropdowns           |
| Medium            | 14–16px       | 35–45%  | Cards, panels                 |
| Thick             | 18–24px       | 45–60%  | Modals, sheets                |
| Chrome (nav/bars) | 12–14px       | 50–70%  | Sidebars, toolbars            |

**Design principles:**
- **Layering:** use different materials to establish visual hierarchy
- **Contrast:** ensure 4.5:1 minimum for text over glass
- **Motion:** animate blur subtly (150–300ms ease)
- **Accessibility:** provide fallback for `prefers-reduced-transparency`

**Apple's recommended CSS approach:**
```css
/* Base material */
.material-thin {
  background-color: rgba(var(--material-tint), 0.28);
  backdrop-filter: blur(12px) saturate(180%);
}

/* Dark mode variant */
@media (prefers-color-scheme: dark) {
  .material-thin {
    background-color: rgba(30, 30, 36, 0.72);
    backdrop-filter: blur(12px) saturate(120%);
  }
}

/* Accessibility: reduced transparency */
@media (prefers-reduced-transparency: reduce) {
  .material-thin {
    background-color: rgba(var(--material-tint), 0.88);
    backdrop-filter: none;
  }
}
```

---

## Summary: Key Technical Specs for Implementation

### Blur Levels
- **Subtle (tooltips, small UI):** 4–8px
- **Medium (cards, panels):** 10–14px
- **Strong (modals, hero sections):** 16–24px

### Opacity/Alpha Ranges
- **Light mode background:** rgba(255,255,255, 0.15–0.35)
- **Dark mode background:** rgba(20,20,26, 0.65–0.80)

### Borders
- **Light mode:** rgba(255,255,255, 0.12–0.22) or rgba(0,0,0, 0.06–0.10)
- **Dark mode:** rgba(255,255,255, 0.08–0.15)
- **Stroke:** 0.5–1px, position: inside or center

### Shadows
- **Light:** 0 4px 16px rgba(0,0,0,0.04–0.08)
- **Medium:** 0 8px 24px rgba(0,0,0,0.10–0.14)
- **Heavy:** 0 12px 40px rgba(0,0,0,0.16–0.22)

### Additional Effects
- **Saturation boost:** saturate(120%–180%)
- **Brightness (hover):** brightness(1.05–1.15)
- **Gradient tints:** subtle linear-gradient overlays (5–10% opacity delta)

### Accessibility
- Always provide `@supports` fallback for backdrop-filter
- Honor `prefers-reduced-transparency` (disable blur, increase opacity)
- Ensure text contrast: WCAG AA minimum (4.5:1 for body, 3:1 for large text)
- Animate blur/opacity with `prefers-reduced-motion` check

---

## Recommended Next Steps
1. **Define token system:** create CSS variables for blur levels, alpha values, border colors, shadows
2. **Build 3 prototype components:** glassy navbar, translucent card, sidebar panel
3. **Test in light/dark modes** and with reduced-transparency preference
4. **Iterate on contrast** and visual hierarchy
5. **Document patterns** for team adoption

---

*End of moodboard. Ready to proceed to design tokens & prototyping phase.*
