export type InspectorFrameId = "onboarding" | "session-setup" | "session-active" | "coming-2";

/** Figma 1992:35174 annotation key. */
export type SpecKind =
  | "image"
  | "focus"
  | "link"
  | "font"
  | "reading"
  | "spacing"
  | "button"
  | "padding"
  | "icon"
  | "colour"
  | "toast"
  | "frame";

export interface SpecAnnotation {
  id: string;
  kind: SpecKind;
  /** Hotspot anchor as percentage of the 2238:194780 artboard (303 × 657) */
  hotspot: { x: number; y: number };
  /** Toast placement relative to the device stage */
  toast: { side: "left" | "right"; top: number };
  category: string;
  element: string;
  target: string;
  accessibleName: string;
  description: string;
}

export interface InspectorFrame {
  id: InspectorFrameId;
  label: string;
  kind: "hero" | "coming-soon";
  note: string;
  annotations?: SpecAnnotation[];
}

export const INSPECTOR_FRAMES: InspectorFrame[] = [
  {
    id: "onboarding",
    label: "Onboarding",
    kind: "hero",
    note: "Tap to never look back opens the loop. Begin Session writes the draft locally and advances into the active timer.",
    annotations: [
      {
        id: "primary-cta",
        kind: "button",
        hotspot: { x: 80.6, y: 89.7 },
        toast: { side: "right", top: 58 },
        category: "+ Button",
        element: "Primary Action Button",
        target: "Onboarding Flow / Session Launch",
        accessibleName: '"Begin Session"',
        description:
          "Initialises session, saves user parameters to local storage, and transitions frame to active timer state.",
      },
      {
        id: "app-mark",
        kind: "icon",
        hotspot: { x: 56, y: 18.4 },
        toast: { side: "left", top: 8 },
        category: "+ Icon",
        element: "Product Mark / List Badge",
        target: "Onboarding Flow / Brand Anchor",
        accessibleName: "Productive list mark",
        description:
          "Three-bar list icon encodes category colours used across session states and notifications.",
      },
      {
        id: "headline",
        kind: "font",
        hotspot: { x: 82, y: 47.5 },
        toast: { side: "left", top: 22 },
        category: "+ Text",
        element: "Screen Title",
        target: "Onboarding Flow / Value Prop",
        accessibleName: '"Tap to never look back"',
        description:
          "Emotional hook paired with a single supporting line — one decision, then one primary action.",
      },
    ],
  },
  {
    id: "session-setup",
    label: "Session setup",
    kind: "coming-soon",
    note: "Session type is captured before launch so the timer opens already tuned to deep work, sprint, or review.",
  },
  {
    id: "session-active",
    label: "Session active",
    kind: "coming-soon",
    note: "The live timer is the core loop. Ending a session is the only exit — no competing chrome.",
  },
  {
    id: "coming-2",
    label: "Insights",
    kind: "coming-soon",
    note: "Placeholder frame for wrap-up and insights once the prototype lands.",
  },
];
