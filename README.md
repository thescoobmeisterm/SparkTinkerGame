# Who's That Robot Part?

Play online: https://thescoobmeisterm.github.io/SparkTinkerGame/

Hosted with GitHub Pages from the root of the `main` branch. Pushing updates to `main` republishes the game.

Open `index.html` in a modern browser. Keep `game.js` and `effects.js` beside it. No installation or build step is needed. The game works offline; optional Google Fonts fall back to system fonts.

For a local preview, run `python3 -m http.server 4173` in this folder and open http://localhost:4173.

- Five random, non-repeating components per game
- Four randomized choices; eight seconds to answer each question
- Correct answer and a short fact shown for 2.2 seconds
- Score screen resets after 15 seconds, or tap **Next tinkerer**
- Touch/mouse support; keyboard keys 1–4 select answers, Escape returns home
- Fullscreen button for the table display
- Synthesized arcade sounds, final-three-second beeps, and a persistent sound toggle
- Confetti for correct answers and the finale; playful explosions for misses/timeouts
- Effects respect reduced-motion preferences and never block answer buttons
- Leaving the tab resets an unattended game

The eight hand-drawn SVG components are servo motor, Arduino Uno, Raspberry Pi, stepper motor, 3D printer extruder, ultrasonic sensor, breadboard, and DC motor. Edit the `parts` array in `game.js` to add components or update illustrations and facts. Avoid overlapping options such as “circuit board” versus “Arduino Uno,” since both could describe the same image.

Run the game-flow checks with `node test-game.cjs`.

## Home Screen icon

The site includes a custom robot icon with a question-mark antenna, matching the game's lime and forest-green palette. `icons/app-icon.svg` is the editable source; PNG exports include iPhone/iPad Apple touch icons (180, 167, and 152 pixels), browser/manifest icons, and a 1024-pixel master.

After publishing, open the site in Safari on iPhone or iPad, choose **Share → Add to Home Screen**, and save it as **Robot Parts**. If an older shortcut retains its previous icon, remove it and add it again. Paths are relative so the icons also work under the GitHub Pages project subdirectory. The manifest requests standalone display; this does not add offline caching.
