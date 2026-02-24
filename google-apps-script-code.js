// ==============================================
// CODE À COLLER DANS GOOGLE APPS SCRIPT
// (Extensions → Apps Script dans ton Google Sheet)
// ==============================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    var date = e.parameter.date || '';
    var heure = e.parameter.heure || '';
    var email = e.parameter.email || '';
    var telephone = e.parameter.telephone || '';
    var page = e.parameter.page || '';

    sheet.appendRow([date, heure, email, telephone, page]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
