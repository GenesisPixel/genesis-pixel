<div align="center">

# <img src="public/svg/svg-8.png" width="35" align="center" /> <img src="public/svg/svg-1.png" width="35" align="center" /> &nbsp; GenesisPixel &nbsp; <img src="public/svg/svg-2.png" width="35" align="center" /> <img src="public/svg/svg-4.png" width="35" align="center" />


<img src="public/img/preview.jpg" alt="GenesisPixel Preview" width="100%" />

<br />


</div>

A comprehensive Spanish-language educational platform for mastering modern web animation and creative coding techniques.


## Overview

GenesisPixel is designed to help developers go from zero to mastery in CSS animations, 3D graphics, and shader programming. The platform features **90 lessons** across **6 structured chapters**, each with hands-on examples, interactive playgrounds, and real-world projects.

## Learning Chapters

| Chapter | Level | Lessons | Topics |
|---------|-------|---------|--------|
| **CSS Transitions** | Beginner | 15 | transition-property, duration, timing-function, delay, shorthand, hover, focus, performance, microinteractions |
| **CSS Transform** | Intermediate | 15 | translate, scale, rotate, skew, transform-origin, 3D transforms, perspective |
| **CSS Keyframes** | Advanced | 15 | @keyframes syntax, timeline, animation properties, fill-mode, play-state, shorthand |
| **Interactions** | Advanced | 15 | Microinteractions, loading states, modals, dropdowns, tooltips, form feedback |
| **Three.js** | Advanced | 15 | Scenes, cameras, renderers, geometries, materials, lights, textures, animations, 3D models |
| **Shaders** | Advanced | 15 | GLSL, vertex/fragment shaders, uniforms, varyings, UV coordinates, noise, procedural effects |

## Key Features

- **Interactive Code Playgrounds** — Live HTML/CSS editors with real-time preview on every lesson
- **Animated Hero** — GSAP-powered character-by-character title reveal with canvas gradient background
- **Floating Navbar** — Pill-shaped navigation with animated indicator, dropdown menu, and mobile sidebar
- **Bento Grid Homepage** — Visual course catalog with level badges and hover effects
- **Code Blocks** — Terminal-style code display with copy functionality and tabbed HTML/CSS views
- **Canvas Backgrounds** — Animated gradient blur and particle effects using custom noise algorithms
- **Responsive Design** — Fully responsive across desktop, tablet, and mobile devices
- **Dark Theme** — Custom dark UI with green accent colors and smooth transitions

## Project Structure

```
src/
├── components/        # 21 Astro components
│   ├── Navbar.astro
│   ├── Hero.astro
│   ├── BentoCards.astro
│   ├── Footer.astro
│   ├── CodeBlock.astro
│   ├── TabbedCodeBlock.astro
│   ├── Playground.astro
│   ├── GradientBlur.astro
│   └── ...
├── layouts/           # 7 layout files
│   ├── Layout.astro
│   ├── CourseLayout.astro
│   ├── TransitionsLayout.astro
│   ├── TransformLayout.astro
│   ├── InteractionsLayout.astro
│   ├── ThreejsLayout.astro
│   └── ShadersLayout.astro
├── pages/             # 12+ page entries (90 lesson pages)
├── styles/            # Global CSS and fonts
├── data/              # Categories, courses, projects
└── scripts/           # Code interaction handlers
```

## Getting Started

```bash
# Clone the repository
git clone https://github.com/GenesisPixel/genesis-pixel.git
cd genesis-pixel

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

> 👥 **Meet the people who make this project possible in our [Contributors file](CONTRIBUTING.md).**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org/)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

<br />

<div align="center">

❤️ Hecho con amor por [Sebastián V.](https://sebas-dev.vercel.app/)

</div>
