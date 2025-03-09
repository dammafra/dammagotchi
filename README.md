# 🥚 Dammagotchi

![](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![](https://img.shields.io/badge/ThreeJs-black?style=for-the-badge&logo=three.js&logoColor=white)
![](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

> Try it live here 👉 [dammagotchi.vercel.app](https://dammagotchi.vercel.app)

I grew up with Tamagotchi and wanted to faithfully recreate the original experience. My goal is to replicate how the classic virtual pet was, complete with its life cycle, care mechanics, and pixelated charm.

## Features

### Life Cycle

The pet follows a full life cycle, starting as an egg and evolving into different forms. Over time, it grows, matures, and reaches the end of its lifespan.

| Egg                                                        |                                                                | Baby                                                     |
| ---------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------- |
| <img src="./screens/life-cycle/egg.png" alt="Egg"  >       | <img src="./screens/life-cycle/hatching.png" alt="Hatching"  > | <img src="./screens/life-cycle/baby.png" alt="Baby"  >   |
| Child                                                      | Teen                                                           | Adult                                                    |
| <img src="./screens/life-cycle/child.png" alt="Child"  >   | <img src="./screens/life-cycle/teen.png" alt="Teen"  >         | <img src="./screens/life-cycle/adult.png" alt="Adult"  > |
| Senior                                                     | Death                                                          |
| <img src="./screens/life-cycle/senior.png" alt="Senior"  > | <img src="./screens/life-cycle/death.png" alt="Death"  >       |

### Needs Management System

Your pet has various needs that must be managed, including hunger, happiness, sleep, cleanliness, illness, and discipline. Ignoring these factors can lead to negative consequences, affecting the pet’s well-being.

| Feed                                              | Sleep                                               | Illness                                                 |
| ------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------- |
| <img src="./screens/needs/feed.png" alt="Feed"  > | <img src="./screens/needs/sleep.png" alt="Sleep"  > | <img src="./screens/needs/illness.png" alt="Illness"  > |
| Toilet                                            |                                                     |                                                         |
| <img src="./screens/needs/mess.png" alt="Mess"  > | <img src="./screens/needs/clean.png" alt="Clean"  > | <img src="./screens/needs/toilet.png" alt="Toilet"  >   |

### Game: Jumping Obstacles

A built-in mini-game challenges the pet to jump over obstacles, providing an interactive way to keep it entertained. Performing well in the game can increase the pet's happiness and engagement.

|                                                    |                                              |                                                  |                                                  |
| -------------------------------------------------- | -------------------------------------------- | ------------------------------------------------ | ------------------------------------------------ |
| <img src="./screens/game/ready.png" alt="Ready"  > | <img src="./screens/game/go.png" alt="Go"  > | <img src="./screens/game/jump.png" alt="Jump"  > | <img src="./screens/game/fail.png" alt="Fail"  > |

### Customizable Device Appearance

Users can personalize the look of their virtual Tamagotchi by changing the device color. These changes dynamically update across the UI for a cohesive visual experience.

<img src="./screens/customization.gif" alt="Customization"  >

### Adjustable Time Speed

Players can control the simulation speed, adjusting how quickly time passes to fit their preferred pace of interaction. This allows for a more relaxed or more fast-paced experience depending on user preference.

### State Persistence & Local Storage

The game automatically saves the pet’s progress and status using local storage. This ensures that users can continue where they left off, even after closing the browser or refreshing the page.

### Reset with Countdown

Just like the original Tamagotchi, there is a reset button on the back of the device, that allows to start over with a new pet. To prevent accidental resets, the button must be held down for a few seconds while a countdown confirms the action. This ensures that users don't lose progress unintentionally.

<img src="./screens/reset.gif" alt="Reset"  >

### Tutorial Introduction

A built-in tutorial guides new users through the basic interactions and mechanics, making the experience accessible for those who have never played with a Tamagotchi before.

## Technologies Used

- **Three.js** (3D rendering)
- **three-bvh-csg** (3D modeling)
- Tailwindcss
- Tweakpane
- shepherd.js (tutorial)
- camera-controls
- @jaames/iro (colors customization)

## Setup

```bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:5173
npm run dev

# Build for production in the dist/ directory
npm run build
```

## html2png

Using `html2canvas-pro` i created a little tool that captures HTML elements and converts them into square textures. I used it for generating menu textures and the battery plastic strip one.

<img src="./screens/html2png.png" alt="html2png"  >

```bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:5174
npm run html2png
```

## Credits

Check out the credits section in the project for a full list of resources used

## Feedback & Contributions

If you have any suggestions, feel free to reach out!

Hope you enjoy it!
