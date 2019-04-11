import Position, { position } from "./index";

describe("position", () => {

	beforeAll(() => {
		const style = document.createElement("style");
		style.innerHTML = `
			* {
				box-sizing: border-box;
			}

			.reference {
				width: 100px;
				height: 100px;
				border: 1px solid blue;
			}

			.target {
				width: 100px;
				height: 50px;
				border: 1px solid gray;
				position: absolute;
			}
		`;
		document.head.appendChild(style);
	});

	let container: Element;
	let target: Element;
	let reference: Element;

	beforeEach(() => {
		container = document.createElement("div");
		reference = document.createElement("div");
		reference.textContent = "reference element";
		reference.classList.add("reference");
		target = document.createElement("div");
		target.textContent = "target element";
		target.classList.add("target");
		container.appendChild(reference);
		container.appendChild(target);
		document.body.appendChild(container);
	});

	afterEach(() => {
		document.body.removeChild(container);
	});

	it("should provide an instance of Position", () => {
		expect(position instanceof Position).toBe(true);
	});

	// a bit of meta testing here
	it("should have an environment", () => {
		expect(target).toBeDefined();
		expect(reference).toBeDefined();
		expect(target.classList).toContain("target");
		expect(reference.classList).toContain("reference");
	});

	it("should position an element to the bottom", () => {
		const pos = position.findPosition(reference, target, "bottom");

		position.setElement(target, pos);
		expect(reference.getBoundingClientRect().bottom).toEqual(target.getBoundingClientRect().top);
	});

	it("should position an element to the left", () => {
		const pos = position.findPosition(reference, target, "left");

		position.setElement(target, pos);
		expect(reference.getBoundingClientRect().left).toEqual(target.getBoundingClientRect().right);
	});

	it("should position an element to the right", () => {
		const pos = position.findPosition(reference, target, "right");

		position.setElement(target, pos);
		expect(reference.getBoundingClientRect().right).toEqual(target.getBoundingClientRect().left);
	});

	it("should position an element to the top", () => {
		const pos = position.findPosition(reference, target, "top");

		position.setElement(target, pos);
		expect(reference.getBoundingClientRect().top).toEqual(target.getBoundingClientRect().bottom);
	});

	it("should add a custom placement", () => {
		const instance = new Position({
			"custom": (referenceOffset, target, referenceRect) => ({
				top: 42,
				left: 42
			})
		});

		const pos = instance.findPosition(reference, target, "custom");

		expect(pos).toEqual({top: 42, left: 42});
	});

	it("should position an element to the top of a given point", () => {
		const pos = position.findPositionAt({top: 100, left: 100}, target, "top");

		position.setElement(target, pos);
		expect(target.getBoundingClientRect().bottom).toEqual(100);
	});

	it("should position an element to the left of a given point", () => {
		const pos = position.findPositionAt({ top: 100, left: 100 }, target, "left");

		position.setElement(target, pos);
		expect(target.getBoundingClientRect().right).toEqual(100);
	});

	it("should position an element to the right of a given point", () => {
		const pos = position.findPositionAt({ top: 100, left: 100 }, target, "right");

		position.setElement(target, pos);
		expect(target.getBoundingClientRect().left).toEqual(100);
	});

	it("should position an element to the bottom of a given point", () => {
		const pos = position.findPositionAt({ top: 100, left: 100 }, target, "bottom");

		position.setElement(target, pos);
		expect(target.getBoundingClientRect().top).toEqual(100);
	});
});
