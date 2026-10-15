const selectButton = document.getElementById("selectButton");
const participantsInput = document.getElementById("participants");
const numGiftsInput = document.getElementById("numGifts");
const status = document.getElementById("status");

selectButton.addEventListener("click", async () => {
  const participants = participantsInput.value
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);
  const numGifts = Number(numGiftsInput.value);

  status.textContent = "";

  if (participants.length < 2) {
    status.textContent = "Enter at least two participant names, separated by commas.";
    return;
  }

  if (!Number.isInteger(numGifts) || numGifts < 1) {
    status.textContent = "Enter a positive whole number of gifts.";
    return;
  }

  selectButton.disabled = true;
  status.textContent = "Creating assignments…";

  try {
    const response = await fetch("/api/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ participants, numGifts }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "The server could not create assignments.");
    }

    sessionStorage.setItem("secretSantaAssignments", JSON.stringify(data.assignments));
    status.textContent = "Assignments created. Opening the results page…";
    window.location.assign("/results");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    status.textContent = `Could not create assignments: ${message}`;
  } finally {
    selectButton.disabled = false;
  }
});
