/**
 * Content configuration
 * Each item adds one layer to the scroll
 * 
 * Required fields:
 * - type: "image", "text", or "video"
 * - speed: parallax speed (0.5 = slower, 1 = normal, 1.2 = faster)
 * 
 * Optional positioning (if not specified, auto-generated):
 * - x: horizontal position in px
 * - y: vertical position in px
 * 
 * For images:
 * - src: path to image file
 * - width, height: dimensions
 * - rotate (optional): rotation in degrees
 * - frames (optional): array of frame filenames for animation
 * - fps (optional): animation speed
 * 
 * For text:
 * - content: text to display
 * 
 * For video:
 * - src: video file path
 * - poster: poster image path
 * 
 * EXAMPLE - Manual positioning:
 * {
 *   type: "image",
 *   src: "assets/my.svg",
 *   class: "tile big",
 *   speed: 0.7,
 *   width: 420,
 *   height: 420,
 *   x: 1200,  // Set to fixed position
 *   y: 150,   // Set to fixed position
 * }
 */

export const LAYERS = [
  // Wall image (starting point of scroll)
  {
    type: "image",
    src: "assets/wall-1.svg",
    class: "wall",
    speed: 0.9,
    width: 520,
    height: 720,
    x: 1060,  // Manual horizontal position
    y: 40,   // Manual vertical position
  },

  // Big tile + label
  {
    type: "image",
    src: "assets/tile-1.svg",
    class: "tile big",
    speed: 0.55,
    width: 420,
    height: 420,
    x: 1620,
    y: 120,
  },
  {
    type: "text",
    content: "CLEAR IDEAS",
    class: "label",
    speed: 0.75,
    x: 1860,
    y: 180,
  },
  {
    type: "text",
    content: "Say hi",
    class: "note",
    speed: 0.9,
    x: 2100,
    y: 60,
  },

  // Spinning tile
  {
    type: "image",
    src: "assets/tile-2.svg",
    class: "tile spin",
    speed: 1.1,
    width: 320,
    height: 320,
    rotate: 540,
    x: 2380,
    y: 120,
  },

  // Animated frames
  {
    type: "image",
    src: "assets/frame-1.svg",
    class: "tile frames",
    speed: 0.95,
    width: 320,
    height: 320,
    frames: ["frame-1.svg", "frame-2.svg", "frame-3.svg"],
    fps: 5,
    x: 3120,
    y: 380,
  },

  // Copy text
  {
    type: "text",
    content: "Transforming vision into impact through bold design.",
    class: "copy",
    speed: 0.65,
    x: 3180,
    y: 60,
  },

  // Video placeholder
  {
    type: "video",
    src: "",
    poster: "assets/video-poster.svg",
    class: "tile video",
    speed: 0.85,
    width: 420,
    height: 260,
    x: 3500,
    y: 490,
  },

  // Tall tile
  {
    type: "image",
    src: "assets/tile-3.svg",
    class: "tile tall",
    speed: 0.7,
    width: 280,
    height: 520,
    x: 3780,
    y: 220,
  },

  // Wide strip
  {
    type: "image",
    src: "assets/strip-1.svg",
    class: "tile wide",
    speed: 0.45,
    width: 520,
    height: 260,
    x: 3600,
    y: 390,
  },

  // Big poster
  {
    type: "image",
    src: "assets/poster-1.svg",
    class: "tile big",
    speed: 0.9,
    width: 420,
    height: 420,
    x: 4600,
    y: 320,
  },

  // Label
  {
    type: "text",
    content: "CREATIVE WORK",
    class: "label thin",
    speed: 0.55,
    x: 4000,
    y: 140,
  },

  // Round badge
  {
    type: "image",
    src: "assets/badge-1.svg",
    class: "tile round",
    speed: 1.15,
    width: 260,
    height: 260,
    rotate: 360,
    x: 4800,
    y: 200,
  },

  // Small copy
  {
    type: "text",
    content: "Strategy, design, and digital experiences for brands.",
    class: "copy small",
    speed: 0.7,
    x: 4880,
    y: 240,
  },

  // Tag
  {
    type: "text",
    content: "INNOVATIONS",
    class: "tag",
    speed: 1.2,
    x: 4320,
    y: 380,
  },

  // Another tile
  {
    type: "image",
    src: "assets/tile-2.svg",
    class: "tile",
    speed: 0.6,
    width: 320,
    height: 320,
    x: 5400,
    y: 440,
  },

  // Tag alt
  {
    type: "text",
    content: "GET STARTED",
    class: "tag alt",
    speed: 0.8,
    x: 5240,
    y: 720,
  },
];

/**
 * Layer spacing configuration
 * Controls vertical spacing between consecutive layers (in px)
 * Adjust to compress or expand the layout
 */
export const SPACING = {
  vertical: 120, // base Y offset between elements
  horizontal: 380, // base X offset between elements (adjusted per speed)
  startOffset: 800, // delay before first element appears (in px, ~0.5 screen)
  verticalMin: 60, // minimum Y position
  verticalMax: 600, // maximum Y position (adjust based on viewport height)
  verticalWave: 240, // amplitude of vertical wave distribution
};
