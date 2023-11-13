import { useState } from 'react'
import { palette, randColor } from '@/lib/colors'

export function Capsule({
	primary = palette[0],
	secondary = 'white',
	stroke = 'black',
	height = 25,
	width = 100,
	strokeWidth = 2,
	marginAndPadding = 10,
	useRandColor = false,
	rotation = 0,
	useRandRotate = false,
}: {
	primary?: string,
	secondary?: string,
	stroke?: string,
	height?: number,
	width?: number,
	strokeWidth?: number,
	marginAndPadding?: number,
	useRandColor?: boolean,
	rotation?: number,
	useRandRotate?: boolean,
}) {
	const [primaryColor, setPrimaryColor] = useState(useRandColor ? randColor() : primary)
	const [rotate, setRotate] = useState(useRandRotate ? Math.random() * 360 : rotation)

	return (
		<svg viewBox={`${-marginAndPadding} ${-marginAndPadding} ${width + 2 * marginAndPadding} ${height + 2 * marginAndPadding}`} xmlns="http://www.w3.org/2000/svg" transform={`rotate(${rotate})`}>

			<ellipse cx={width / 4} cy={height / 2} rx={height / 2} ry={height / 2} style={{
				fill: primaryColor,
				stroke: stroke,
				strokeWidth: strokeWidth,
			}}
			/>
			<rect x={width / 4} y={0} width={width / 4} height={height}
				style={{
					fill: primaryColor,
					stroke: stroke,
					strokeWidth: strokeWidth,
				}}
			/>
			<rect x={(width / 4) - (strokeWidth / 4)} y={strokeWidth} width={(width / 4) + (strokeWidth / 2)} height={height - 2 * strokeWidth}
				style={{
					fill: primaryColor,
					stroke: primaryColor,
					strokeWidth: strokeWidth,
				}}
			/>

			<rect x={width / 2} y={0} width={width / 4} height={height}
				style={{
					fill: secondary,
					stroke: stroke,
					strokeWidth: strokeWidth,
				}} />
			<ellipse cx={3 * width / 4} cy={height / 2} rx={height / 2} ry={height / 2}
				style={{
					fill: secondary,
					stroke: stroke,
					strokeWidth: strokeWidth,

				}}
			/>
			<rect x={width / 2} y={strokeWidth} width={(width / 4)} height={height - 2 * strokeWidth}
				style={{
					fill: secondary,
					stroke: secondary,
					strokeWidth: strokeWidth,
				}}
			/>
		</svg>
	)
}