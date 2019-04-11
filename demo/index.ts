import Position, { position } from "./../src";

const positionDemoElements = (referenceSelector, targetSelector, placement) => {
	const position = new Position();

	const reference = document.querySelector(referenceSelector);
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
positionDemoElements(".ref7", ".tar7", "right");

document.addEventListener("click", (event: MouseEvent) => {
	if (document.querySelector<HTMLInputElement>(".ref8 .demo-enabled").checked) {
		const target = document.querySelector<HTMLElement>(".tar8");
		const pos = position.findPositionAt({top: event.pageY, left: event.pageX}, target, "bottom");

		position.setElement(target, pos);
	}
});

document.addEventListener("mousemove", (event: MouseEvent) => {
	if (document.querySelector<HTMLInputElement>(".ref9 .demo-enabled").checked) {
		const target = document.querySelector<HTMLElement>(".tar9");
		const pos = position.findPositionAt({ top: event.pageY, left: event.pageX }, target, "bottom");

		position.setElement(target, pos);
	}
});

document.addEventListener("keydown", (event: KeyboardEvent) => {
	switch (event.key) {
		case "1": {
				const input = document.querySelector<HTMLInputElement>(".ref8 .demo-enabled");
				input.checked = !input.checked;
				break;
			}
		case "2": {
				const input = document.querySelector<HTMLInputElement>(".ref9 .demo-enabled");
				input.checked = !input.checked;
				break;
			}
		default:
			break;
	}
});
