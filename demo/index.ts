import Position from "./../src";

const positionDemoElements = (referenceSelector, targetSelector, placement) => {
	const position = new Position();

	const reference = document.querySelector<HTMLElement>(referenceSelector);
	const target = document.querySelector<HTMLElement>(targetSelector);

	const pos = position.findPosition(reference, target, placement);

	position.setElement(target, pos);
};

positionDemoElements(".ref0", ".tar0", "right");
positionDemoElements(".ref1", ".tar1", "right");
positionDemoElements(".ref2", ".tar2", "right");
positionDemoElements(".ref3", ".tar3", "bottom");
positionDemoElements(".ref4", ".tar4", "right");
positionDemoElements(".ref5", ".tar5", "right");
positionDemoElements(".ref6", ".tar6", "right");
