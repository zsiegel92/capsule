"use client";
import { useState, useEffect } from "react";

import { palette, randColor, randRotate } from "@/lib/capsule_utils";
import "@/styles/capsule.css";

export function Capsule({
  primary = palette[0],
  secondary = "white",
  stroke = "black",
  size = 1,
  useRandColor = false,
  rotation = 0,
  useRandRotate = false,
  show = true,
}: {
  primary?: string;
  secondary?: string;
  stroke?: string;
  size?: number;
  useRandColor?: boolean;
  rotation?: number;
  useRandRotate?: boolean;
  show?: boolean;
}) {
  const [showing, setShowing] = useState(show);
  const [primaryColor, setPrimaryColor] = useState(
    useRandColor ? randColor() : primary
  );
  const [rotate, setRotate] = useState(useRandRotate ? randRotate() : rotation);
  const height = 25 * size;
  const width = 100 * size;
  const strokeWidth = 2 * size;
  const marginAndPadding = 10 * size;
  return (
    <div
      style={{
        width: `${width + 2 * marginAndPadding}px`,
        height: `${height + 2 * marginAndPadding}px`,
        display: showing ? "inline-block" : "none",
      }}
      // className='capsule'
      className="capsuleParent"
      suppressHydrationWarning
    >
      <svg
        viewBox={`${-marginAndPadding} ${-marginAndPadding} ${
          width + 2 * marginAndPadding
        } ${height + 2 * marginAndPadding}`}
        xmlns="http://www.w3.org/2000/svg"
        transform={`rotate(${rotate})`}
        //@ts-ignore
        suppressHydrationWarning
      >
        <a className="capsule" suppressHydrationWarning>
          <ellipse
            cx={width / 4}
            cy={height / 2}
            rx={height / 2}
            ry={height / 2}
            style={{
              fill: primaryColor,
              stroke: stroke,
              strokeWidth: strokeWidth,
            }}
            //@ts-ignore
            suppressHydrationWarning
          />
          <rect
            x={width / 4}
            y={0}
            width={width / 4}
            height={height}
            style={{
              fill: primaryColor,
              stroke: stroke,
              strokeWidth: strokeWidth,
            }}
            //@ts-ignore
            suppressHydrationWarning
          />
          <rect
            x={width / 4 - strokeWidth / 4}
            y={strokeWidth}
            width={width / 4 + strokeWidth / 2}
            height={height - 2 * strokeWidth}
            style={{
              fill: primaryColor,
              stroke: primaryColor,
              strokeWidth: strokeWidth,
            }}
            //@ts-ignore
            suppressHydrationWarning
          />

          <rect
            x={width / 2}
            y={0}
            width={width / 4}
            height={height}
            style={{
              fill: secondary,
              stroke: stroke,
              strokeWidth: strokeWidth,
            }}
            //@ts-ignore
            suppressHydrationWarning
          />
          <ellipse
            cx={(3 * width) / 4}
            cy={height / 2}
            rx={height / 2}
            ry={height / 2}
            style={{
              fill: secondary,
              stroke: stroke,
              strokeWidth: strokeWidth,
            }}
            //@ts-ignore
            suppressHydrationWarning
          />
          <rect
            x={width / 2}
            y={strokeWidth}
            width={width / 4}
            height={height - 2 * strokeWidth}
            style={{
              fill: secondary,
              stroke: secondary,
              strokeWidth: strokeWidth,
            }}
            //@ts-ignore
            suppressHydrationWarning
          />
        </a>
      </svg>
    </div>
  );
}
