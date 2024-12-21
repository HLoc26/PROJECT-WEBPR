document.addEventListener("DOMContentLoaded", function () {
	// Replace the original input with our custom tags input
	const originalInput = document.getElementById("tags-input");
	const hiddenInput = document.getElementById("tags-hidden");
	const wrapper = document.createElement("div");
	wrapper.className = "tags-input-wrapper";

	const input = document.createElement("input");
	input.type = "text";
	input.className = "tags-input";
	input.placeholder = "Input tag...";

	// Insert the new elements
	originalInput.parentNode.replaceChild(wrapper, originalInput);
	wrapper.appendChild(input);

	let tags = [];

	// Initialize with existing tags if any
	if (hiddenInput.value) {
		const existingTags = hiddenInput.value.split(",");
		existingTags.forEach((tag) => {
			if (tag.trim()) {
				addTagToDOM(tag.trim());
				tags.push(tag.trim());
			}
		});
	}

	function createTag(label) {
		const div = document.createElement("div");
		div.setAttribute("class", "tag");
		const span = document.createElement("span");
		span.innerHTML = label;
		const closeBtn = document.createElement("span");
		closeBtn.setAttribute("class", "tag-close");
		closeBtn.innerHTML = "&times;";

		div.appendChild(span);
		div.appendChild(closeBtn);

		return div;
	}

	function updateHiddenInput() {
		hiddenInput.value = tags.join(",");
	}

	function flashDuplicateTag(duplicateText) {
		const allTags = wrapper.querySelectorAll(".tag");
		allTags.forEach((tag) => {
			const tagText = tag.querySelector("span").innerHTML;
			if (tagText === duplicateText) {
				tag.classList.add("duplicate");
				setTimeout(() => {
					tag.classList.remove("duplicate");
				}, 1000);
			}
		});
	}

	function addTagToDOM(tagText) {
		const tag = createTag(tagText);
		wrapper.insertBefore(tag, input);
	}

	function addTag(e) {
		let value = e.target.value.trim();

		if (e.key === "Backspace" && value === "") {
			if (tags.length > 0) {
				const lastTag = wrapper.querySelector(".tag:last-of-type");
				if (lastTag) {
					const tagText = lastTag.querySelector("span").innerHTML;
					tags = tags.filter((t) => t !== tagText);
					wrapper.removeChild(lastTag);
					updateHiddenInput();
				}
			}
			return;
		}

		if (e.key === ",") {
			e.preventDefault();
			value = value.replace(/,/g, "").trim();
		}

		if ((e.key === "," || e.key === "Enter") && value !== "") {
			if (tags.includes(value)) {
				flashDuplicateTag(value);
			} else {
				addTagToDOM(value);
				tags.push(value);
				updateHiddenInput();
			}
			e.target.value = "";
		}
	}

	function removeTag(e) {
		if (e.target.classList.contains("tag-close")) {
			const tag = e.target.parentElement;
			const tagText = tag.querySelector("span").innerHTML;
			tags = tags.filter((t) => t !== tagText);
			wrapper.removeChild(tag);
			updateHiddenInput();
		}
	}

	input.addEventListener("keydown", addTag);
	wrapper.addEventListener("click", removeTag);
});
