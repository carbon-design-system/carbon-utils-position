/**
 * Utilites to manipulate the position of elements relative to other elements
 */

export interface AbsolutePosition {
	top: number;
	left: number;
	position?: AbsolutePosition;
}

export type Offset = { top: number, left: number };

export type Positions = {
	[key: string]: (referenceOffset: Offset, target: HTMLElement, referenceRect: ClientRect | DOMRect) => AbsolutePosition
};

export const defaultPositions: Positions = {
	"left": (referenceOffset: Offset, target: HTMLElement, referenceRect: ClientRect | DOMRect): AbsolutePosition => ({
		top: referenceOffset.top - Math.round(target.offsetHeight / 2) + Math.round(referenceRect.height / 2),
		left: Math.round(referenceOffset.left - target.offsetWidth)
	}),
	"right": (referenceOffset: Offset, target: HTMLElement, referenceRect: ClientRect | DOMRect): AbsolutePosition => ({
		top: referenceOffset.top - Math.round(target.offsetHeight / 2) + Math.round(referenceRect.height / 2),
		left: Math.round(referenceOffset.left + referenceRect.width)
	}),
	"top": (referenceOffset: Offset, target: HTMLElement, referenceRect: ClientRect | DOMRect): AbsolutePosition => ({
		top: Math.round(referenceOffset.top - target.offsetHeight),
		left: referenceOffset.left - Math.round(target.offsetWidth / 2) + Math.round(referenceRect.width / 2)
	}),
	"bottom": (referenceOffset: Offset, target: HTMLElement, referenceRect: ClientRect | DOMRect): AbsolutePosition => ({
		top: Math.round(referenceOffset.top + referenceRect.height),
		left: referenceOffset.left - Math.round(target.offsetWidth / 2) + Math.round(referenceRect.width / 2)
	})
};

export default class Position {
	protected positions = defaultPositions;

	constructor(positions: Positions = {}) {
		Object.assign({}, defaultPositions, positions);
	}

	getRelativeOffset(target: HTMLElement): Offset {
		// start with the initial element offsets
		let offsets = {
			left: target.offsetLeft,
			top: target.offsetTop
		};
		// get each static (i.e. not absolute or relative) offsetParent and sum the left/right offsets
		while (target.offsetParent && getComputedStyle(target.offsetParent).position === "static") {
			offsets.left += target.offsetLeft;
			offsets.top += target.offsetTop;
			target = target.offsetParent as HTMLElement;
		}
		return offsets;
	}

	getAbsoluteOffset(target: HTMLElement): Offset {
		let currentNode = target;
		let margins = {
			top: 0,
			left: 0
		};

		// searches for containing elements with additional margins
		while (currentNode.offsetParent) {
			const computed = getComputedStyle(currentNode.offsetParent);
			// find static elements with additional margins
			// since they tend to throw off our positioning
			// (usually this is just the body)
			if (
				computed.position === "static" &&
				computed.marginLeft &&
				computed.marginTop
			) {
				if (parseInt(computed.marginTop, 10)) {
					margins.top += parseInt(computed.marginTop, 10);
				}
				if (parseInt(computed.marginLeft, 10)) {
					margins.left += parseInt(computed.marginLeft, 10);
				}
			}

			currentNode = currentNode.offsetParent as HTMLElement;
		}

		const targetRect = target.getBoundingClientRect();
		const relativeRect = document.body.getBoundingClientRect();
		return {
			top: targetRect.top - relativeRect.top + margins.top,
			left: targetRect.left - relativeRect.left + margins.left
		};
	}

	// finds the position relative to the `reference` element
	findRelative(reference: HTMLElement, target: HTMLElement, placement: string): AbsolutePosition {
		const referenceOffset = this.getRelativeOffset(reference);
		return this.calculatePosition(referenceOffset, reference, target, placement);
	}

	findAbsolute(reference: HTMLElement, target: HTMLElement, placement: string): AbsolutePosition {
		const referenceOffset = this.getAbsoluteOffset(reference);
		return this.calculatePosition(referenceOffset, reference, target, placement);
	}

	findPosition(reference: HTMLElement,
		target: HTMLElement,
		placement: string,
		offsetFunction = this.getAbsoluteOffset): AbsolutePosition {
		const referenceOffset = offsetFunction(reference);
		return this.calculatePosition(referenceOffset, reference, target, placement);
	}

	/**
	 * Get the dimensions of an element from an AbsolutePosition and a reference element
	 */
	getPlacementBox(target: HTMLElement, position: AbsolutePosition) {
		const targetBottom = target.offsetHeight + position.top;
		const targetRight = target.offsetWidth + position.left;

		return {
			top: position.top,
			bottom: targetBottom,
			left: position.left,
			right: targetRight
		};
	}

	addOffset(position: AbsolutePosition, top = 0, left = 0): AbsolutePosition {
		return Object.assign({}, position, {
			top: position.top + top,
			left: position.left + left
		});
	}

	setElement(element: HTMLElement, position: AbsolutePosition): void {
		element.style.top = `${position.top}px`;
		element.style.left = `${position.left}px`;
	}

	findBestPlacement(reference: HTMLElement, target: HTMLElement, placements: string[]) {
		/**
		 * map over the array of placements and weight them based on the percentage of visible area
		 * where visible area is defined as the area not obscured by the window borders
		 */
		const weightedPlacements = placements.map(placement => {
			const pos = this.findPosition(reference, target, placement);
			let box = this.getPlacementBox(target, pos);
			let hiddenHeight = box.bottom - window.innerHeight - window.scrollY;
			let hiddenWidth = box.right - window.innerWidth - window.scrollX;
			// if the hiddenHeight or hiddenWidth is negative, reset to offsetHeight or offsetWidth
			hiddenHeight = hiddenHeight < 0 ? target.offsetHeight : hiddenHeight;
			hiddenWidth = hiddenWidth < 0 ? target.offsetWidth : hiddenWidth;
			const area = target.offsetHeight * target.offsetWidth;
			const hiddenArea = hiddenHeight * hiddenWidth;
			let visibleArea = area - hiddenArea;
			// if the visibleArea is 0 set it back to area (to calculate the percentage in a useful way)
			visibleArea = visibleArea === 0 ? area : visibleArea;
			const visiblePercent = visibleArea / area;
			return {
				placement,
				weight: visiblePercent
			};
		});

		// sort the placements from best to worst
		weightedPlacements.sort((a, b) => b.weight - a.weight);
		// pick the best!
		return weightedPlacements[0].placement;
	}

	private calculatePosition(referenceOffset: Offset, reference: HTMLElement, target: HTMLElement, placement: string): AbsolutePosition {
		// calculate offsets for a given position
		const referenceRect = reference.getBoundingClientRect();

		if (this.positions[placement]) {
			return this.positions[placement](referenceOffset, target, referenceRect);
		}
		console.error("No function found for placement, defaulting to 0,0");
		return { left: 0, top: 0 };
	}
}

export const position = new Position();
