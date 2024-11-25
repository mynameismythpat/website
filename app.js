const apiUrl = "https://api.jsonbin.io/v3/b/67444b94acd3cb34a8ae6f15"; // Replace with your JSON Bin ID
const config = {
  secretKey: "$2a$10$rNHDuZNJxWbOAyxSfXtqvO73Lo1aWRWT8CzQZNblUX0xuOlLbYQoG", // Replace with your JSON Bin Secret Key
};

const popup = document.getElementById("popup");
const createButton = document.getElementById("createButton");
const closePopup = document.getElementById("closePopup");
const confirmButton = document.getElementById("confirmButton");
const textContainer = document.getElementById("textContainer");
const errorMessage = document.getElementById("errorMessage");

createButton.addEventListener("click", () => popup.style.display = "flex");
closePopup.addEventListener("click", () => popup.style.display = "none");

popup.addEventListener("click", (e) => {
  if (e.target === popup) popup.style.display = "none";
});

confirmButton.addEventListener("click", async () => {
  const texttoadd = document.getElementById("texttoadd").value.trim();
  const password = document.getElementById("password").value;

  if (password !== "3.14") {
    errorMessage.classList.remove("hidden");
    return;
  }

  errorMessage.classList.add("hidden");
  popup.style.display = "none";

  const existingData = await fetch(apiUrl, {
    headers: { "X-Master-Key": config.secretKey },
  }).then((res) => res.json());

  const updatedData = [...(existingData.record || []), texttoadd];

  await fetch(apiUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": config.secretKey,
    },
    body: JSON.stringify(updatedData),
  });

  fetchTexts();
});

async function fetchTexts() {
  const response = await fetch(apiUrl, {
    headers: { "X-Master-Key": config.secretKey },
  });
  const data = await response.json();

  textContainer.innerHTML = "";
  (data.record || []).forEach((text, index) => {
    const box = document.createElement("div");
    box.className = "textBox";

    const content = document.createElement("span");
    content.textContent = text;

    const deleteButton = document.createElement("i");
    deleteButton.className = "fas fa-trash delete";
    deleteButton.addEventListener("click", async () => {
      const updatedData = [...data.record];
      updatedData.splice(index, 1);

      await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": config.secretKey,
        },
        body: JSON.stringify(updatedData),
      });

      fetchTexts();
    });

    box.appendChild(content);
    box.appendChild(deleteButton);

    // Copy to clipboard on left click
    box.addEventListener("click", () => {
      navigator.clipboard.writeText(text).then(() => {
        box.classList.add("copiedAnimation");
        setTimeout(() => box.classList.remove("copiedAnimation"), 2000); // Reset animation after 2s
      }).catch(err => {
        console.error("Failed to copy text.", err);
      });
    });

    // Add the animation for outline expansion
    box.classList.add("outlineAnim");

    textContainer.appendChild(box);
  });
}

fetchTexts();