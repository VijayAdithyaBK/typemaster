# TypeMaster: The Boring Office Typewriter

An immersive, skeuomorphic typing simulator that transforms your browser into a mechanical office typewriter. TypeMaster prioritizes tactile feedback, physical machine aesthetics, and literary immersion through classic novel excerpts.

## Key Features

- **Tactile Typewriter Experience**: Full-screen skeuomorphic design featuring a physical machine base and responsive paper feed.
- **Mechanical Audio Engine**: Low-latency synthetic keystroke "clacks" and carriage return "dings" generated via the Web Audio API.
- **Literary Content**: Randomly selected opening paragraphs from classic literature (e.g., *Moby Dick*, *The Great Gatsby*, *1984*).
- **Mechanical Controls**: A physical "Difficulty Lever" to toggle between Easy, Medium, and Hard modes.
- **Office Analytics**: Real-time WPM (Words Per Minute) and Accuracy tracking with "ink smear" effects for typos.
- **Session Logs**: A persistent logbook to track your historical typing performance.

## Tech Stack

- **Framework**: [React 18](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Audio Engine**: [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) (No external audio assets required)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Typography**: [Google Fonts](https://fonts.google.com/) (Courier Prime & Special Elite)
- **Deployment**: [GitHub Pages](https://pages.github.com/)

## Prerequisites

- **Node.js**: v18.0 or higher
- **npm**: v9.0 or higher (or yarn/pnpm)
- **Browser**: Modern browser with Web Audio API support (Chrome/Edge recommended for best audio performance)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/VijayAdithyaBK/typemaster.git
cd typemaster
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173/typemaster/](http://localhost:5173/typemaster/) in your browser.

## Architecture

### Directory Structure

```
├── src/
│   ├── components/
│   │   └── TypingInterface.tsx   # Core "Boring Office" UI & logic
│   ├── hooks/
│   │   └── useTypewriterSounds.ts # Synthetic Audio Engine
│   ├── App.tsx                    # Entry layout
│   ├── index.css                  # Skeuomorphic CSS & Design Tokens
│   └── main.tsx                   # React DOM initialization
├── index.html                     # Global font loading & base meta
├── tailwind.config.js             # Theme & font definitions
└── vite.config.ts                 # Base path for GitHub Pages
```

### The Mechanical Sound Engine (`src/hooks/`)

TypeMaster uses the **Web Audio API** to generate sounds programmatically. This ensures zero latency and removes the need for loading bulky `.mp3` files.
- **Key Clacks**: A combination of a low-frequency `sine` oscillator and a white-noise burst.
- **Carriage Ding**: A high-frequency `sine` oscillator at 880Hz (A5) with a long exponential decay.

### Design System (`src/index.css`)

The UI follows "Boring Office" skeuomorphism:
- **The Machine**: Fixed-bottom container with gradients and inner shadows to simulate a heavy metal chassis.
- **The Paper**: A dynamic "sheet" using `radial-gradient` and `linear-gradient` to create a subtle parchment/grid texture.
- **Ink Effect**: Typos are rendered with a "smear" (red glow and wavy strikethrough) to mimic real ink errors.

## Configuration

Settings are persistent across sessions via `localStorage`:

| Option | Description | Effect |
| --- | --- | --- |
| **Audio Feedback** | Toggles keystroke sounds | Enables/Disables AudioContext output |
| **Visual Smear** | Typos bleed into paper | Adds red box-shadow to incorrect characters |

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Compiles the project for production (dist folder) |
| `npm run deploy` | Deploys the build to GitHub Pages via `gh-pages` |
| `npm run lint` | Runs ESLint for code quality checks |

## Troubleshooting

### Audio Not Playing
Most browsers block `AudioContext` until the user interacts with the page.
- **Fix**: Click anywhere on the "Paper" or "Machine" to initialize the audio engine.

### Layout Squishing
TypeMaster is designed for a full-screen desktop experience.
- **Fix**: If elements overlap, ensure your browser window is at least 1024px wide.

## Deployment

To deploy your own version to GitHub Pages:

1. Update `homepage` in `package.json` to your URL.
2. Ensure `base` in `vite.config.ts` matches your repository name.
3. Run:
   ```bash
   npm run deploy
   ```

---

Created with ☕ in the Boring Office.