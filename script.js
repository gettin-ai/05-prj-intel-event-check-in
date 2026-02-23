// Get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

// Track attendance
let count = 0;
const maxCount = 50;

// Function to save data to localStorage
function saveToLocalStorage() {
  const waterCount = document.getElementById("waterCount").textContent;
  const zeroCount = document.getElementById("zeroCount").textContent;
  const powerCount = document.getElementById("powerCount").textContent;

  const waterList = Array.from(
    document.getElementById("waterList").children,
  ).map(function (li) {
    return li.textContent;
  });
  const zeroList = Array.from(document.getElementById("zeroList").children).map(
    function (li) {
      return li.textContent;
    },
  );
  const powerList = Array.from(
    document.getElementById("powerList").children,
  ).map(function (li) {
    return li.textContent;
  });

  const data = {
    count: count,
    waterCount: waterCount,
    zeroCount: zeroCount,
    powerCount: powerCount,
    waterList: waterList,
    zeroList: zeroList,
    powerList: powerList,
  };

  localStorage.setItem("attendanceData", JSON.stringify(data));
}

// Function to load data from localStorage
function loadFromLocalStorage() {
  const savedData = localStorage.getItem("attendanceData");

  if (savedData) {
    const data = JSON.parse(savedData);

    // Restore count
    count = data.count || 0;
    document.getElementById("attendeeCount").textContent = count;

    // Restore team counts
    document.getElementById("waterCount").textContent = data.waterCount || 0;
    document.getElementById("zeroCount").textContent = data.zeroCount || 0;
    document.getElementById("powerCount").textContent = data.powerCount || 0;

    // Restore progress bar
    const percentage = Math.round((count / maxCount) * 100) + "%";
    document.getElementById("progressBar").style.width = percentage;

    // Restore attendee lists
    const waterListElement = document.getElementById("waterList");
    const zeroListElement = document.getElementById("zeroList");
    const powerListElement = document.getElementById("powerList");

    if (data.waterList) {
      data.waterList.forEach(function (name) {
        const li = document.createElement("li");
        li.textContent = name;
        waterListElement.appendChild(li);
      });
    }

    if (data.zeroList) {
      data.zeroList.forEach(function (name) {
        const li = document.createElement("li");
        li.textContent = name;
        zeroListElement.appendChild(li);
      });
    }

    if (data.powerList) {
      data.powerList.forEach(function (name) {
        const li = document.createElement("li");
        li.textContent = name;
        powerListElement.appendChild(li);
      });
    }
  }
}

// Load saved data when page loads
loadFromLocalStorage();

// Place test code for the celebration message here

// Handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form from submitting normally

  // Get form values
  const name = nameInput.value.trim();
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  console.log(name, teamName);

  // Increment count
  count++;
  console.log("Total check-ins: ", count);

  // Update the attendance count display
  const attendeeCount = document.getElementById("attendeeCount");
  attendeeCount.textContent = count;

  // Update progress bar
  const percentage = Math.round((count / maxCount) * 100) + "%";
  console.log(`Progress: ${percentage}`);
  const progressBar = document.getElementById("progressBar");
  progressBar.style.width = percentage;

  // Update the team counter
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

  // Add attendee name to the team list
  const teamList = document.getElementById(team + "List");
  const listItem = document.createElement("li");
  listItem.textContent = name;
  teamList.appendChild(listItem);

  // Save to localStorage
  saveToLocalStorage();

  // Check if attendance goal is reached
  if (count === maxCount) {
    // Get all team counts
    const waterCount = parseInt(
      document.getElementById("waterCount").textContent,
    );
    const zeroCount = parseInt(
      document.getElementById("zeroCount").textContent,
    );
    const powerCount = parseInt(
      document.getElementById("powerCount").textContent,
    );

    // Determine winning team
    let winningTeam = "";
    let teamLogo = "";
    let maxTeamCount = Math.max(waterCount, zeroCount, powerCount);

    if (waterCount === maxTeamCount) {
      winningTeam = "Team Water Wise";
      teamLogo = "🌊";
    } else if (zeroCount === maxTeamCount) {
      winningTeam = "Team Net Zero";
      teamLogo = "🌿";
    } else if (powerCount === maxTeamCount) {
      winningTeam = "Team Renewables";
      teamLogo = "⚡";
    }

    // Show celebration message
    const celebrationMessage = `🎉 Attendance goal reached! Congratulations to <span style="display: block; text-align: center; background-color: #e8f4fc; padding: 20px; margin: 10px 0; border-radius: 5px; font-weight: bold;">${winningTeam}<br><span style="font-size: 80px; display: block; margin-top: 15px; animation: bounce 2s ease-in-out;">${teamLogo}</span></span> for leading the way!`;
    const greeting = document.getElementById("greeting");
    greeting.innerHTML = celebrationMessage;
    greeting.style.display = "block";
    greeting.className = "success-message";
  } else {
    // Show welcome message
    const message = `🥳 Welcome, ${name} from ${teamName}`;
    console.log(message);
    const greeting = document.getElementById("greeting");
    greeting.textContent = message;
    greeting.style.display = "block";
    greeting.className = "success-message";
  }

  form.reset(); // Reset the form after submission
});
