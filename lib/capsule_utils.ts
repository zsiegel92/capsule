export const palette = [
	'#ffadad',
	'#ffd6a5',
	'#fdffb6',
	'#caffbf',
	'#9bf6ff',
	'#a0c4ff',
	'#bdb2ff',
	'#ffc6ff',
	// '#fffffc',
]

export const randColor = () => palette[Math.floor(Math.random() * palette.length)]
export const randRotate = () => Math.random() * 360