$(document).ready(function () {
  var getDataButton = $("#submit");
  var startDate = $("#start");
  var endDate = $("#end");
  var tableBody = document.getElementsByTagName("tbody");
  var domain = location.origin; //"http://localhost:3000";

  getDataButton.click(function () {
    $.get(
      `    ${domain}
/getDataInRange?dateStart=${startDate.val()}&dateEnd=${endDate.val()}`,
      function (response) {
        console.log(response);
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
  });

  function createTableRow(keys, data) {
    for (var i = data.length - 1; i >= 0; i--) {
      var tableRow = document.createElement("tr");
      for (var j = 0; j < 4; j++) {
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
