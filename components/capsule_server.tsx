'use server'
import { Capsule } from "@/components/capsule";
import { randRotate, randColor } from "@/lib/capsule_utils";

export async function CapsuleServer({ useRandRotate, useRandColor, ...rest }: {
	useRandRotate?: boolean,
	useRandColor?: boolean,
	[key: string]: any,
}) {
	if (useRandColor) {
		rest.primary = randColor()
	}
	if (useRandRotate) {
		rest.rotation = randRotate()
	}
	return (
		<Capsule
			{...rest}
		/>
	)
}
