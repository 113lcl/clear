import { LAYERS, SPACING } from "./config.js";

const stage = document.getElementById("stage");
const scene = document.getElementById("scene");
const startScreen = document.getElementById("startScreen");
const titleSwap = document.getElementById("titleSwap");
const endScreen = document.getElementById("endScreen");

const state = {
  target: 0,
  current: 0,
  max: 0,
  ease: 0.08,
};

let layers = [];
const frameState = new Map();
const titleFonts = [
  '"Archivo Black", "Impact", sans-serif',
  '"Bungee", "Arial Black", sans-serif',
  '"Unbounded", "Arial", sans-serif',
  '"Syne", "Arial", sans-serif',
  '"Bodoni Moda", "Times New Roman", serif',
];
let lastFontSwap = 0;
let fontIndex = 0;

/**
 * Generate layers from config and inject into DOM
 */
function generateLayers() {
  let autoX = SPACING.startOffset + SPACING.horizontal;
  const maxHeight = window.innerHeight;

  LAYERS.forEach((item, index) => {
    let el;

    if (item.type === "image") {
      el = document.createElement("img");
      el.src = item.src;
      el.alt = "";
    } else if (item.type === "text") {
      el = document.createElement("div");
      el.textContent = item.content;
    } else if (item.type === "video") {
      el = document.createElement("video");
      if (item.src) el.src = item.src;
      if (item.poster) el.poster = item.poster;
      el.muted = true;
      el.autoplay = true;
      el.playsinline = true;
      el.preload = "auto";
      if (item.loop) el.loop = true;
    }

    el.classList.add("layer", ...(item.class ? item.class.split(" ") : []));
    el.dataset.layer = true;
    el.dataset.speed = item.speed || 1;

    // Use manual x/y if provided, otherwise use auto
    if (item.x !== undefined) {
      el.dataset.x = item.x;
    } else {
      el.dataset.x = autoX;
    }

    if (item.y !== undefined) {
      el.dataset.y = Math.max(SPACING.verticalMin, Math.min(item.y, SPACING.verticalMax));
    } else {
      // Auto distribute vertically if y not specified
      const waveValue = Math.sin((index * 0.6) + (autoX * 0.0005)) * 0.5 + 0.5;
      const autoY = SPACING.verticalMin + (SPACING.verticalMax - SPACING.verticalMin) * waveValue;
      el.dataset.y = Math.max(SPACING.verticalMin, Math.min(autoY, SPACING.verticalMax));
    }

    if (item.rotate) el.dataset.rotate = item.rotate;
    if (item.frames) el.dataset.frames = item.frames.join(", ");
    if (item.fps) el.dataset.fps = item.fps;
    if (item.type === "video") el.dataset.scrub = "true";

    scene.appendChild(el);

    // Update position for next layer (only if not manually specified)
    if (item.x === undefined) {
      autoX += SPACING.horizontal * 0.85;
    }
  });

  layers = Array.from(document.querySelectorAll("[data-layer]"));
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function updateBounds() {
  const sceneWidth = scene.getBoundingClientRect().width;
  state.max = Math.max(0, sceneWidth - window.innerWidth);
  state.target = clamp(state.target, 0, state.max);
  state.current = clamp(state.current, 0, state.max);
}

function updateTitle(now, progress) {
  if (!titleSwap) {
    return;
  }

  const isAtStart = progress < 0.03;
  if (isAtStart && now - lastFontSwap > 160) {
    fontIndex = (fontIndex + 1) % titleFonts.length;
    titleSwap.style.fontFamily = titleFonts[fontIndex];
    lastFontSwap = now;
  }

  if (!isAtStart) {
    titleSwap.style.fontFamily = titleFonts[0];
  }
}

function updateFrames(now) {
  layers.forEach((layer) => {
    const frames = layer.dataset.frames;
    if (!frames) {
      return;
    }

    const fps = Number(layer.dataset.fps || "6");
    const list = frames.split(",").map((item) => item.trim());
    const index = Math.floor((now / 1000) * fps) % list.length;
    const prevIndex = frameState.get(layer);

    if (prevIndex === index) {
      return;
    }

    frameState.set(layer, index);
    if (layer.tagName === "IMG") {
      layer.src = `assets/${list[index]}`;
    } else {
      layer.style.backgroundImage = `url(assets/${list[index]})`;
    }
  });
}

function updateVideo(progress) {
  layers.forEach((layer) => {
    if (!(layer instanceof HTMLVideoElement)) {
      return;
    }

    if (!layer.dataset.scrub) {
      return;
    }

    if (layer.readyState < 1 || !layer.duration) {
      return;
    }

    const time = progress * layer.duration;
    layer.currentTime = time;
  });
}

function render(now) {
  state.current += (state.target - state.current) * state.ease;
  if (Math.abs(state.target - state.current) < 0.1) {
    state.current = state.target;
  }

  const progress = state.max ? state.current / state.max : 0;

  layers.forEach((layer) => {
    const speed = Number(layer.dataset.speed || "1");
    const baseX = Number(layer.dataset.x || "0");
    const baseY = Number(layer.dataset.y || "0");
    const offsetX = baseX - state.current * speed;

    // For spinning elements, add continuous rotation based on time
    if (layer.classList.contains("spinning")) {
      const spinRotation = (now / 40) % 360; // Complete rotation every 4 seconds
      layer.style.transform = `translate3d(${offsetX}px, ${baseY}px, 0) rotate(${spinRotation}deg)`;
    } else {
      const rotate = Number(layer.dataset.rotate || "0");
      const rotation = rotate * progress;
      layer.style.transform = `translate3d(${offsetX}px, ${baseY}px, 0) rotate(${rotation}deg)`;
    }
  });

  updateTitle(now, progress);
  updateFrames(now);
  updateVideo(progress);

  if (startScreen) {
    const fade = clamp(1 - progress * 6, 0, 1);
    startScreen.style.opacity = fade.toFixed(3);
  }

  if (endScreen) {
    const start = 0.76;
    const end = 0.94;
    const reveal = clamp((progress - start) / (end - start), 0, 1);
    endScreen.style.opacity = reveal.toFixed(3);
    endScreen.style.pointerEvents = reveal > 0.9 ? "auto" : "none";
  }

  requestAnimationFrame(render);
}

function onWheel(event) {
  event.preventDefault();
  const delta = event.deltaY || event.deltaX;
  state.target = clamp(state.target + delta, 0, state.max);
}

function onKey(event) {
  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    state.target = clamp(state.target + 120, 0, state.max);
  }

  if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    state.target = clamp(state.target - 120, 0, state.max);
  }

}

updateBounds();
generateLayers();
updateBounds(); // Recalculate after layers are added

window.addEventListener("resize", updateBounds);
window.addEventListener("wheel", onWheel, { passive: false });
window.addEventListener("keydown", onKey);
requestAnimationFrame(render);
