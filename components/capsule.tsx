"use client";
import { useState, useEffect, MouseEventHandler } from 'react';
// import { MouseEventHandler } from 'dom';
import InfiniteScroll from 'react-infinite-scroller';

import { palette, randColor, randRotate } from '@/lib/capsule_utils';
import '@/styles/capsule.css';
import { useInterval } from '@/lib/hooks';

export function CapsuleSpinner({ size = 0.4 }: { size?: number }) {
    return (
        <Capsule
            size={size}
            useRandColor={true}
            useRandRotate={false}
            useRotateInterval={false}
            useSpinner={true}
        />
    );
}


export function Capsule({
    primary = palette[0],
    secondary = 'white',
    stroke = 'black',
    size = 1,
    useRandColor = false,
    rotation = 0,
    useRandRotate = false,
    useRotateInterval = true,
    useSpinner = false,
    spinnerSlow = false,
    open = false,
    onClick = (e) => {},
    hoverSeparationOffset = 2, // Make it negative to open less than the default
}: {
    primary?: string;
    secondary?: string;
    stroke?: string;
    size?: number;
    useRandColor?: boolean;
    rotation?: number;
    useRandRotate?: boolean;
    useRotateInterval?: boolean;
    useSpinner?: boolean;
    spinnerSlow?: boolean;
    open?: boolean;
    onClick?: MouseEventHandler<SVGAElement>;
    hoverSeparationOffset?: number;
}) {
    const [primaryColor, setPrimaryColor] = useState(
        useRandColor ? randColor() : primary,
    );
    const [rotate, setRotate] = useState(
        useRandRotate ? randRotate() : rotation,
    );
    // const [intervalRotated, setIntervalRotated] = useState(false);
    const [intervalRotationAmount, setIntervalRotationAmount] = useState(0);
    const [rotateInterval, setRotateInterval] = useState(
        useRotateInterval ? exponentialSample(2000) : null,
    );
    const [hoverOpenOffset, setHoverOpenOffset] = useState(0);

    useEffect(() => {
        setPrimaryColor(primary);
    }, [primary]);

    useInterval(() => {
        // setIntervalRotated(!intervalRotated);
        setIntervalRotationAmount(exponentialSample(10));
        setRotateInterval(exponentialSample(2000));
    }, rotateInterval);

    const height = 25 * size;
    const width = 100 * size;
    const strokeWidth = 2 * size;
    const marginAndPadding = 15 * size;
    const openOffset = open ? hoverOpenOffset + marginAndPadding / 2 : 0;
    return (
        <div
            style={{
                width: `${width + 2 * marginAndPadding}px`,
                height: `${height + 2 * marginAndPadding}px`,
                display: 'inline-block',
            }}
            onMouseEnter={() => setHoverOpenOffset(hoverSeparationOffset)}
            onMouseLeave={() => setHoverOpenOffset(0)}
            className={`grow-spin capsuleParent ${
                useSpinner
                    ? spinnerSlow
                        ? 'capsuleSpinnerSlow'
                        : 'capsuleSpinner'
                    : ''
            }`}
            suppressHydrationWarning
        >
            <div
                style={{
                    display: 'inline-block',
                    height: '100%',
                    width: '100%',
                    transform: `rotate(${intervalRotationAmount}deg)`,
                }}
                className="capsuleParentInner"
                suppressHydrationWarning
            >
                <svg
                    viewBox={`${-marginAndPadding} ${-marginAndPadding} ${
                        width + 2 * marginAndPadding
                    } ${height + 2 * marginAndPadding}`}
                    xmlns="http://www.w3.org/2000/svg"
                    // transform={`rotate(${rotate})`}
                    style={{
                        transform: `rotate(${rotate}deg)`,
                    }}
                    // @ts-ignore
                    onClick={onClick}
                    //@ts-ignore
                    suppressHydrationWarning
                >
                    <a className="capsule" suppressHydrationWarning>
                        {open && (
                            <ellipse
                                cx={width / 2}
                                cy={height / 2}
                                rx={height / 2 + marginAndPadding}
                                ry={height / 2 + marginAndPadding}
                                style={{
                                    fill: 'none',
                                    stroke: 'gray',
                                    strokeWidth: strokeWidth / 2,
                                    strokeDasharray: '5,5',
                                }}
                                //@ts-ignore
                                suppressHydrationWarning
                            />
                        )}

                        <ellipse
                            cx={width / 4 - openOffset}
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
                            x={width / 4 - openOffset}
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
                            x={width / 4 - strokeWidth / 4 - openOffset}
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
                            x={width / 2 + openOffset}
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
                            cx={(3 * width) / 4 + openOffset}
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
                            x={width / 2 + openOffset}
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
            }}
            hasMore={true}
            // @ts-ignore
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