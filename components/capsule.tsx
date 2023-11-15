"use client";
import { useState, useEffect } from "react";

import InfiniteScroll from 'react-infinite-scroller';

import { palette, randColor, randRotate } from '@/lib/capsule_utils';
import '@/styles/capsule.css';
import { useInterval } from '@/lib/hooks';

export function Capsule({
    primary = palette[0],
    secondary = 'white',
    stroke = 'black',
    size = 1,
    useRandColor = false,
    rotation = 0,
    useRandRotate = false,
    useRotateInterval = true,
}: {
    primary?: string;
    secondary?: string;
    stroke?: string;
    size?: number;
    useRandColor?: boolean;
    rotation?: number;
    useRandRotate?: boolean;
    useRotateInterval?: boolean;
}) {
    const [primaryColor, setPrimaryColor] = useState(
        useRandColor ? randColor() : primary,
    );
    const [rotate, setRotate] = useState(
        useRandRotate ? randRotate() : rotation,
    );
    const [intervalRotated, setIntervalRotated] = useState(false);
    const [rotateInterval, setRotateInterval] = useState(
        useRotateInterval ? exponentialSample(4000) : null,
    );
    // useEffect(() => {
    //     setTimeout(function () {
    //         setParentInnerClass('capsuleParentInner');
    //     }, exponentialSample(4000));
    // }, []);

    useInterval(() => {
        setIntervalRotated(!intervalRotated);
        setRotateInterval(useRotateInterval ? exponentialSample(4000) : null);
    }, rotateInterval);

    const height = 25 * size;
    const width = 100 * size;
    const strokeWidth = 2 * size;
    const marginAndPadding = 10 * size;
    return (
        <div
            style={{
                width: `${width + 2 * marginAndPadding}px`,
                height: `${height + 2 * marginAndPadding}px`,
                display: 'inline-block',
            }}
            // className='capsule'
            className="capsuleParent"
            suppressHydrationWarning
        >
            <div
                style={{
                    display: 'inline-block',
                    height: '100%',
                    width: '100%',
                    transform: intervalRotated
                        ? 'rotate(10deg)'
                        : 'rotate(0deg)',
                }}
                className="capsuleParentInner"
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
        </div>
    );
}

// rate 1/mean
function exponentialSample(mean: number) {
    return -Math.log(Math.random()) * mean;
}

function getNRandomFunctionCalls(n: number, f: Function) {
    return Array.from(Array(n).keys()).map((i) => f());
}

function getNRandomRotations(n: number) {
    return getNRandomFunctionCalls(n, randRotate);
}

function getNRandomColors(n: number) {
    return getNRandomFunctionCalls(n, randColor);
}

export function InfiniteCapsules({
    baseRows = 5,
    increment = 20,
    nPerRow = 10,
    scrollableTarget,
    ...capsuleProps
}: {
    baseRows: number;
    increment: number;
    scrollableTarget: string;
    [key: string]: any;
}) {
    const [nRows, setNRows] = useState(baseRows);
    const [colors, setColors] = useState(getNRandomColors(baseRows * nPerRow));
    const [rotations, setRotations] = useState(
        getNRandomRotations(baseRows * nPerRow),
    );
    return (
        <InfiniteScroll
            pagestart={0}
            loadMore={() => {
                setColors((old_colors) =>
                    old_colors.concat(getNRandomColors(increment * nPerRow)),
                );
                setRotations((old_rotations) =>
                    old_rotations.concat(
                        getNRandomRotations(increment * nPerRow),
                    ),
                );
                setNRows((old_nRows) => old_nRows + 1);
                // setTimeout(() => {
                //     setColors(colors.concat(getNRandomColors(increment)));
                //     setRotations(
                //         rotations.concat(getNRandomRotations(increment)),
                //     );
                // }, 20);
            }}
            hasMore={true}
            loader="Loading..."
        >
            {Array.from(Array(nRows).keys()).map((i) => (
                <div style={{ display: 'inline-block' }} key={`row-${i}`}>
                    {Array.from(Array(nPerRow).keys()).map((j) => (
                        <div
                            style={{ display: 'inline-block' }}
                            key={`row-${i}-col-${j}`}
                        >
                            <Capsule
                                key={`capsule-${i}-${j}`}
                                primary={colors[i * nPerRow + j]}
                                rotation={rotations[i * nPerRow + j]}
                                {...capsuleProps}
                            />
                        </div>
                    ))}
                </div>
            ))}
        </InfiniteScroll>
    );
}


// {colors.map((color, i) => (
// 	<Capsule
// 		key={`capsule-${i}`}
// 		primary={color}
// 		rotation={rotations[i]}
// 		{...capsuleProps}
// 	/>
// ))}