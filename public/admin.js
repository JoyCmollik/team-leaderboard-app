const socket = io();
const addPlayerForm = document.getElementById("addPlayerForm");
const playerNameInput = document.getElementById("playerName");
const playerListTable = document.getElementById("playerList");

addPlayerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const playerName = playerNameInput.value;
    if (playerName) {
        socket.emit("addPlayer", { name: playerName });
        playerNameInput.value = "";
    }
});

socket.on("updateLeaderboard", updatePlayerList);

function updatePlayerList() {
    fetch("/players")
        .then((response) => response.json())
        .then((players) => {
            // Clear the list
            while (playerListTable.firstChild) {
                playerListTable.firstChild.remove();
            }

            // Add the players to the list
            players.forEach((player) => {
                let tr = document.createElement("tr");

                let tdName = document.createElement("td");
                tdName.textContent = player.name;
                tdName.className = "border px-4 py-2";
                tr.appendChild(tdName);

                let tdPoints = document.createElement("td");
                tdPoints.textContent = player.points;
                tdPoints.className = "border px-4 py-2";
                tr.appendChild(tdPoints);

                let tdAddPoints = document.createElement("td");
                tdAddPoints.className = "border px-4 py-2";

                let addPointsInput = document.createElement("input");
                addPointsInput.type = "number";
                addPointsInput.min = "0";
                addPointsInput.placeholder = "Points";
                addPointsInput.className = "border-2 border-gray-200 rounded-lg p-2 mr-2";
                tdAddPoints.appendChild(addPointsInput);

                let addPointsButton = document.createElement("button");
                addPointsButton.textContent = "Add";
                addPointsButton.className = "bg-green-500 text-white rounded-lg p-2 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110";
                addPointsButton.addEventListener("click", () => {
                    let newPoints = parseInt(addPointsInput.value);
                    if (newPoints) {
                        socket.emit("addPoints", { id: player._id, points: newPoints });
                        addPointsInput.value = "";
                    }
                });
                tdAddPoints.appendChild(addPointsButton);
                tr.appendChild(tdAddPoints);

                let tdEdit = document.createElement("td");
                tdEdit.className = "border px-4 py-2";
                let editButton = document.createElement("button");
                editButton.textContent = "Edit";
                editButton.className = "bg-yellow-500 text-white rounded-lg p-2 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110";
                editButton.addEventListener("click", () => {
                    let newName = prompt("Enter new name", player.name);
                    if (newName) {
                        socket.emit("editPlayer", { id: player._id, name: newName });
                    }
                });
                tdEdit.appendChild(editButton);
                tr.appendChild(tdEdit);

                let tdDelete = document.createElement("td");
                tdDelete.className = "border px-4 py-2";
                let deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.className = "bg-red-500 text-white rounded-lg p-2 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110";
                deleteButton.addEventListener("click", () => {
                    socket.emit("deletePlayer", { id: player._id });
                });
                tdDelete.appendChild(deleteButton);
                tr.appendChild(tdDelete);

                playerListTable.appendChild(tr);
            });
        });
}

// Fetch the initial list of players
updatePlayerList();