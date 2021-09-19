$(document).ready(function () {
  var tableBody = document.getElementsByTagName("tbody");
  const socket = io();
  var domain = location.origin; //"http://localhost:3000";

  loadLatestData();
  var intervalID = "";

  socket.on("startLiveData", (message) => {
    console.log(message);
    intervalID = setInterval(function () {
      var temperatureRandom = Math.round(Math.random() * (50 - 20) + 20);
      var batteryRandom = Math.round(Math.random() * (99 - 10) + 10);
      const curDate = new Date().toISOString().split("T")[0];
      var newEntry = {
        temperature: temperatureRandom,
        batteryLevel: batteryRandom,
        timeStamp: curDate,
      };
      $.post(
        `    ${domain}
/insertData`,
        newEntry,
        function (data, status, jqXHR) {
          socket.emit("newAdded", "updateTable");
        }
      );
    }, 5000);
  });
  socket.on("updateTable", (message) => {
    console.log(message);
    loadLatestData();
  });

  function loadLatestData() {
    $.get(
      `    ${domain}
/getData`,
      function (response) {
        var tableRows = document.getElementsByClassName("data-row");
        [...tableRows].forEach((element) => tableBody[0].removeChild(element));
        if (response.length > 0) {
          var keys = Object.keys(response[0]);
          createTableRow(keys, response);
        } else {
          alert("No Data Found!");
        }
      }
    );
  }

  function createTableRow(keys, data) {
    for (var i = data.length - 1; i >= data.length - 20; i--) {
      var tableRow = document.createElement("tr");
      for (var j = 0; j < keys.length; j++) {
        var tableData = document.createElement("td");
        tableData.className = "column" + (j + 1);
        tableData.innerHTML = data[i][keys[j]];
        tableRow.append(tableData);
      }
      tableRow.className = "data-row";
      tableBody[0].append(tableRow);
    }
  }
});
