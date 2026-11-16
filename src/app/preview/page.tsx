"use client";

import { useState } from "react";
import {
  Smartphone,
  Tablet,
  RotateCw,
  Maximize2,
  ZoomIn,
  ZoomOut,
  ExternalLink,
  Wifi,
  Battery,
} from "lucide-react";

type DeviceType = "iphone" | "galaxy" | "tablet";

interface DeviceSpec {
  name: string;
  type: DeviceType;
  width: number;
  height: number;
  borderRadius: string;
  notch: boolean;
}

const DEVICES: Record<DeviceType, DeviceSpec> = {
  iphone: {
    name: "iPhone 15 Pro",
    type: "iphone",
    width: 393,
    height: 852,
    borderRadius: "rounded-[48px]",
    notch: true,
  },
  galaxy: {
    name: "Samsung Galaxy S24",
    type: "galaxy",
    width: 360,
    height: 780,
    borderRadius: "rounded-[36px]",
    notch: false,
  },
  tablet: {
    name: "Academy Learning Tablet (10\")",
    type: "tablet",
    width: 800,
    height: 1100,
    borderRadius: "rounded-[32px]",
    notch: false,
  },
};

export default function MobileSimulatorPage() {
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>("iphone");
  const [isLandscape, setIsLandscape] = useState(false);
  const [zoom, setZoom] = useState(85);

  const device = DEVICES[selectedDevice];
  const frameWidth = isLandscape ? device.height : device.width;
  const frameHeight = isLandscape ? device.width : device.height;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Simulator Control Toolbar */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-400 bg-indigo-950 px-2.5 py-1 rounded-md border border-indigo-800">
              Live Simulator
            </span>
            <span className="text-sm font-bold text-slate-200">
              Sir Xolo Academy Mobile & Tablet Preview
            </span>
          </div>

          {/* Device Chooser */}
          <div className="flex items-center gap-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setSelectedDevice("iphone")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedDevice === "iphone"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>iPhone</span>
            </button>

            <button
              onClick={() => setSelectedDevice("galaxy")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedDevice === "galaxy"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Galaxy S24</span>
            </button>

            <button
              onClick={() => setSelectedDevice("tablet")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedDevice === "tablet"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>10&quot; Tablet</span>
            </button>
          </div>

          {/* Orientation & Scale */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLandscape(!isLandscape)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-300 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5 text-amber-400" />
              <span>{isLandscape ? "Landscape" : "Portrait"}</span>
            </button>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-xl border border-slate-700 text-xs">
              <button
                onClick={() => setZoom((z) => Math.max(50, z - 10))}
                className="p-1 hover:text-indigo-400 cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold text-slate-300 px-1">{zoom}%</span>
              <button
                onClick={() => setZoom((z) => Math.min(120, z + 10))}
                className="p-1 hover:text-indigo-400 cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors"
              title="Open full page"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Frame Canvas */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "center center",
            transition: "transform 0.2s ease, width 0.3s ease, height 0.3s ease",
          }}
          className={`relative bg-slate-900 border-8 border-slate-800 shadow-2xl p-2 ${device.borderRadius} ring-1 ring-slate-700 flex flex-col`}
        >
          {/* Mock Status Bar */}
          <div className="h-6 w-full flex items-center justify-between px-6 text-[10px] text-slate-400 select-none">
            <span className="font-bold">09:41</span>
            {device.notch && (
              <div className="w-24 h-4 bg-slate-950 rounded-full mx-auto" />
            )}
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Iframe Viewport */}
          <div
            style={{ width: `${frameWidth}px`, height: `${frameHeight}px` }}
            className="bg-white overflow-hidden rounded-[28px] shadow-inner"
          >
            <iframe
              src="/"
              title="Mobile Preview"
              className="w-full h-full border-0 select-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
