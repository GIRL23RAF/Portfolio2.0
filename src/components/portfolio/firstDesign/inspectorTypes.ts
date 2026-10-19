export type InspectorFrameId = "onboarding" | "session-setup" | "session-active" | "coming-2";

export interface SpecAnnotation {
  id: string;
  /** Hotspot anchor as percentage of the 402×874 screen box */
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
  annotations?: SpecAnnotation[];
}

export const INSPECTOR_FRAMES: InspectorFrame[] = [
  {
    id: "onboarding",
    label: "Onboarding",
    kind: "hero",
    annotations: [
      {
        id: "primary-cta",
        hotspot: { x: 50, y: 89 },
        toast: { side: "right", top: 58 },
        category: "+ Button",
        element: "Primary Action Button",
        target: "Onboarding Flow / Session Launch",
        accessibleName: '"Begin Session"',
        description:
          "Initializes session, saves user parameters to local storage, and transitions frame to active timer state.",
      },
      {
        id: "app-mark",
        hotspot: { x: 50, y: 16 },
        toast: { side: "left", top: 8 },
        category: "+ Icon",
        element: "Product Mark / List Badge",
        target: "Onboarding Flow / Brand Anchor",
        accessibleName: "Productive list mark",
        description:
          "Three-bar list icon encodes category colors used across session states and notifications.",
      },
      {
        id: "headline",
        hotspot: { x: 50, y: 46 },
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
  },
  {
    id: "session-active",
    label: "Session active",
    kind: "coming-soon",
  },
  {
    id: "coming-2",
    label: "Insights",
    kind: "coming-soon",
  },
];
