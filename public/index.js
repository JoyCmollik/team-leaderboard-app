const socket = io();
const leaderboardTable = document.getElementById('leaderboard');

socket.on('updateLeaderboard', updateLeaderboard);

function updateLeaderboard() {
  fetch('/players')
    .then(response => response.json())
    .then(players => {
      // Clear the table
      while (leaderboardTable.rows.length > 1) {
        leaderboardTable.deleteRow(1);
      }

      // Add the players to the table
      players.forEach(player => {
        let row = leaderboardTable.insertRow();
        let nameCell = row.insertCell();
        let pointsCell = row.insertCell();
        nameCell.textContent = player.name;

        // Animate the points
        anime({
          targets: pointsCell,
          innerHTML: [0, player.points],
          round: 1,
          easing: 'linear',
          duration: 500
        });
      });
    });
}

// Fetch the initial leaderboard
updateLeaderboard();