$(document).ready(function () {
  var addButton = $("#addButton");
  var temperatureInput = $("#temp");
  var batteryInput = $("#battery");
  var timeInput = $("#time");
  var domain = location.origin; //"http://localhost:3000";

  const socket = io();

  addButton.click(function (e) {
    e.preventDefault();
    socket.emit("newAdded", "updateTable");
    var newEntry = {
      temperature: temperatureInput.val(),
      batteryLevel: batteryInput.val(),
      timeStamp: timeInput.val(),
    };
    $.post(
      `    ${domain}
/insertData`,
      newEntry,
      function (data, status, jqXHR) {
        console.log("status: " + status + ", data: " + data);
      }
    );
  });
});
