export function toPureJson(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

export function exportTableToExcel(tableID: string, filename = '') {
  var downloadLink;
  var dataType = 'application/vnd.ms-excel';
  var tableSelect = document.getElementById(tableID);
  var tableHTML = tableSelect?.outerHTML.replace(/ /g, '%20');

  // Specify file name
  filename = filename ? filename + '.xls' : 'excel_data.xls';

  // Create download link element
  downloadLink = document.createElement('a');

  document.body.appendChild(downloadLink);

  //@ts-ignore
  if (navigator.msSaveOrOpenBlob) {
    if (tableHTML) {
      var blob = new Blob(['\ufeff', tableHTML], {
        type: dataType,
      });
      //@ts-ignore
      navigator.msSaveOrOpenBlob(blob, filename);
    }
  } else {
    // Create a link to the file
    downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

    // Setting the file name
    downloadLink.download = filename;

    //triggering the function
    downloadLink.click();
  }
}

// export function exportTableToExcel() {
//   var uri = `'data:application/vnd.ms-excel;base64,'
//       , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office"
//       xmlns:x="urn:schemas-microsoft-com:office:excel"
//       xmlns="http://www.w3.org/TR/REC-html40"><head>
//       <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets>
//       <x:ExcelWorksheet><x:Name>{worksheet}</x:Name>
//       <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
//       </x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook>
//       </xml><![endif]--></head><body>
//       <table>{table}</table></body></html>'
//       , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
//       , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
//       return function (table, name) {
//       if (!table.nodeType) table = document.getElementById(table)
//       var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
//       window.location.href = uri + base64(format(template, ctx))`;
//   return uri;
// }

export function generateArrayRange(size: number, startAt = 0) {
  return [...Array(size).keys()].map((i) => i + startAt);
}

export function getObjectFromLocalStrg(localStorageObject: any) {
  //check if the object has keys
  if (Object.keys(localStorageObject).length > 0) {
    return localStorageObject;
  } else return null;
}
