import type { Metadata } from "next";
import { VisualizerContent } from "@/features/public/content/visualizer";
export const metadata: Metadata = { title: "Living Space Visualizer" };
export default function VisualizerPage() {
  return <VisualizerContent />;
}
