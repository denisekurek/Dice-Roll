const results = document.getElementById("results");
const hideAllButton = document.getElementById("hideAllButton");
const backButton = document.getElementById("backButton");

hideAllButton.addEventListener("click", () => {
  results.querySelectorAll("[data-giftee-toggle]").forEach((button) => {
    const gifteeList = document.getElementById(button.getAttribute("aria-controls"));
    gifteeList.hidden = true;
    button.setAttribute("aria-expanded", "false");
  });
});

backButton.addEventListener("click", () => {
  sessionStorage.removeItem("secretSantaAssignments");
  window.location.assign("/");
});

let assignments;
try {
  assignments = JSON.parse(sessionStorage.getItem("secretSantaAssignments"));
} catch {
  assignments = null;
}

if (!Array.isArray(assignments) || assignments.length === 0) {
  results.textContent = "No assignments found. Return to the main screen to create them.";
} else {
  assignments.forEach(({ gifter, giftees }, index) => {
    const assignment = document.createElement("section");
    const gifterButton = document.createElement("button");
    const gifteeList = document.createElement("ul");
    const gifteeListId = `giftee-list-${index}`;

    gifterButton.type = "button";
    gifterButton.textContent = gifter;
    gifterButton.setAttribute("data-giftee-toggle", "");
    gifterButton.setAttribute("aria-controls", gifteeListId);
    gifterButton.setAttribute("aria-expanded", "false");

    gifteeList.id = gifteeListId;
    gifteeList.hidden = true;
    giftees.forEach((giftee) => {
      const item = document.createElement("li");
      item.textContent = giftee;
      gifteeList.append(item);
    });

    gifterButton.addEventListener("click", () => {
      gifteeList.hidden = !gifteeList.hidden;
      gifterButton.setAttribute("aria-expanded", String(!gifteeList.hidden));
    });

    assignment.append(gifterButton, gifteeList);
    results.append(assignment);
  });
  hideAllButton.hidden = false;
}
