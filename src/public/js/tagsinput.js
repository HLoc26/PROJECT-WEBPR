document.addEventListener("DOMContentLoaded", async function () {
	// Replace the original input with our custom tags input
	const originalInput = document.getElementById("tags-input");
	const hiddenInput = document.getElementById("tags-hidden");
	const wrapper = document.createElement("div");
	wrapper.className = "tags-input-wrapper";

	const input = document.createElement("input");
	input.type = "text";
	input.className = "tags-input";
	input.placeholder = "Input tag...";

	const suggestionsContainer = document.createElement("div");
	suggestionsContainer.className = "suggestions-container";

	// Insert the new elements
	originalInput.parentNode.replaceChild(wrapper, originalInput);
	wrapper.appendChild(input);
	wrapper.appendChild(suggestionsContainer);

	let tags = [];
	let allTags = [];
	let suggestedTags = [];
	let selectedSuggestionIndex = -1;

	// Fetch all tags from the API
	const response = await fetch("/api/tags", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	const result = await response.json();

	allTags = result.data.map((tag) => tag.tag_name); // Get an array of tag names

	// console.log(result);
	// console.log(allTags);

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

	function updateSuggestions(value) {
		if (!value.trim()) {
			suggestionsContainer.style.display = "none";
			suggestedTags = [];
			return;
		}

		// Filter tags based on input
		suggestedTags = allTags.filter((tag) => tag.toLowerCase().includes(value.toLowerCase()) && !tags.includes(tag));

		// Update suggestions UI
		suggestionsContainer.innerHTML = "";
		suggestedTags.forEach((tag, index) => {
			const div = document.createElement("div");
			div.className = "suggestion-item";
			div.textContent = tag;
			div.addEventListener("click", () => {
				if (!tags.includes(tag)) {
					addTagToDOM(tag);
					tags.push(tag);
					updateHiddenInput();
					input.value = "";
					suggestionsContainer.style.display = "none";
				}
			});
			suggestionsContainer.appendChild(div);
		});

		suggestionsContainer.style.display = suggestedTags.length ? "block" : "none";
		selectedSuggestionIndex = -1;
	}

	function handleKeyNavigation(e) {
		const suggestionItems = suggestionsContainer.querySelectorAll(".suggestion-item");

		if (e.key === "ArrowDown") {
			e.preventDefault();
			selectedSuggestionIndex = Math.min(selectedSuggestionIndex + 1, suggestionItems.length - 1);
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			selectedSuggestionIndex = Math.max(selectedSuggestionIndex - 1, -1);
		}

		// Update selected item visual
		suggestionItems.forEach((item, index) => {
			item.classList.toggle("selected", index === selectedSuggestionIndex);
		});

		// Update input value if item selected
		if (selectedSuggestionIndex >= 0) {
			input.value = suggestedTags[selectedSuggestionIndex];
		}
	}

	function addTag(e) {
		let value = e.target.value.trim();

		// Prevent form submission if Enter is pressed
		if (e.key === "Enter") {
			e.preventDefault(); // Prevent form submission
		}

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

		if (["ArrowUp", "ArrowDown"].includes(e.key)) {
			handleKeyNavigation(e);
			return;
		}

		if (e.key === ",") {
			e.preventDefault();
			value = value.replace(/,/g, "").trim();
		}

		if ((e.key === "," || e.key === "Enter") && value !== "") {
			if (selectedSuggestionIndex >= 0) {
				value = suggestedTags[selectedSuggestionIndex];
			}

			if (tags.includes(value)) {
				flashDuplicateTag(value);
			} else {
				addTagToDOM(value);
				tags.push(value);
				updateHiddenInput();
			}
			input.value = "";
			suggestionsContainer.style.display = "none";
			selectedSuggestionIndex = -1;
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

	// Event listeners
	input.addEventListener("keydown", addTag);
	input.addEventListener("input", (e) => updateSuggestions(e.target.value));
	wrapper.addEventListener("click", removeTag);

	// Close suggestions when clicking outside
	document.addEventListener("click", (e) => {
		if (!wrapper.contains(e.target)) {
			suggestionsContainer.style.display = "none";
		}
	});
});
