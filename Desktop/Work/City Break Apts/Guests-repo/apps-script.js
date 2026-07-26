/**
 * Guest Registration — Google Apps Script
 * Triggers on form submission, writes guest rows to Sheet3,
 * and sends a confirmation email.
 *
 * Duplicate cleanup runs separately via a time-based trigger (every 5 min).
 *
 * Install: see deployment instructions at the bottom of this file.
 */

var SPREADSHEET_ID = '1xq3SR2c4l7MLDQwTqT4BbBcu9j0FjmIFOOJf0tdEmpU';
var SHEET_NAME = 'Sheet 3';
var NOTIFY_EMAIL = 'dimitriscitybreakapts@gmail.com';
var FORM_ID = '1bVXUpy_i9YyK2u49k38iT4HTR-RaoLPFiU3YhX0dGdE';

function onFormSubmit() {
  var form = FormApp.openById(FORM_ID);
  var allResponses = form.getResponses();
  var latest = allResponses[allResponses.length - 1];

  var responses = latest.getItemResponses();

  // Extract form values by title (position-independent)
  var fieldMap = {};
  var guestFields = [];
  for (var r = 0; r < responses.length; r++) {
    var title = responses[r].getItem().getTitle();
    if (title === 'Apartment') {
      fieldMap['Apartment'] = responses[r].getResponse();
    } else if (title === 'Check-in Date') {
      fieldMap['Check-in Date'] = responses[r].getResponse();
    } else {
      guestFields.push(responses[r]);
    }
  }
  var apartment = fieldMap['Apartment'] || '';
  var checkinRaw = fieldMap['Check-in Date'] || '';

  // Format check-in date as dd/mm/yyyy
  var checkinFormatted = formatDate(checkinRaw);

  // Build guest list — 4 slots, 3 fields each (name, nationality, id)
  var guests = [];
  for (var i = 0; i < 4; i++) {
    var offset = i * 3;
    var name = (offset < guestFields.length) ? guestFields[offset].getResponse().trim() : '';
    var nationality = (offset + 1 < guestFields.length) ? guestFields[offset + 1].getResponse().trim() : '';
    var id = (offset + 2 < guestFields.length) ? guestFields[offset + 2].getResponse().trim() : '';

    // Skip if both name AND id are blank
    if (name === '' && id === '') continue;

    guests.push({ name: name, nationality: nationality, id: id });
  }

  if (guests.length === 0) return;

  // Open spreadsheet
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    Logger.log('ERROR: Sheet "' + SHEET_NAME + '" not found. Available sheets: ' +
      ss.getSheets().map(function(s) { return s.getName(); }).join(', '));
    throw new Error('Sheet "' + SHEET_NAME + '" not found in spreadsheet. Check SHEET_NAME constant.');
  }

  // Get next "No" — check both Sheet2 (historical) and Sheet3 (new intake)
  var maxNo = 0;
  var sheet2 = ss.getSheetByName('Sheet2');
  if (sheet2) maxNo = getMaxNoFromSheet(sheet2);
  var sheet3Max = getMaxNoFromSheet(sheet);
  if (sheet3Max > maxNo) maxNo = sheet3Max;
  var nextNo = maxNo + 1;

  // Find last occupied row by checking column C (Name)
  var lastDataRow = getLastRowInColC(sheet);

  // Append one row per guest — write to columns B:H (skip col A which has a formula)
  for (var g = 0; g < guests.length; g++) {
    var targetRow = lastDataRow + 1 + g;
    var row = [
      g === 0 ? apartment : '',              // B — APT (first row only)
      guests[g].name,                        // C — Name
      guests[g].nationality,                 // D — Nationality
      checkinFormatted,                      // E — Check-in date
      '',                                    // F — blank
      g === 0 ? nextNo : '',                 // G — No (first row only)
      guests[g].id                           // H — ID/Passport
    ];
    sheet.getRange(targetRow, 2, 1, 7).setValues([row]); // cols B(2) through H(8)
  }

  // Send confirmation email
  sendNotification(apartment, checkinFormatted, guests);
}

/**
 * Removes duplicate rows from Sheet3.
 * A duplicate is a row with the same APT (col B) + Guest 1 name (col C) +
 * Check-in date (col E) that appears more than once.
 * When duplicates are found, the FIRST occurrence is kept and later ones
 * are deleted. Only rows whose "No" values (col G) are within 2 of each
 * other are considered duplicates (to avoid deleting legitimate repeat guests).
 *
 * Run via a time-based trigger every 5 minutes.
 */
function removeDuplicates() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return;

  var lastRow = sheet.getLastRow();
  if (lastRow < 3) return; // need at least 2 data rows to have duplicates

  // Read cols B:G (indices: 0=B/apt, 1=C/name, 2=D/nat, 3=E/checkin, 4=F, 5=G/no)
  var data = sheet.getRange(2, 2, lastRow - 1, 6).getValues();

  // Build a map of signature → first row index
  // Signature = APT + "|" + Guest1Name + "|" + CheckinDate
  var seen = {};       // signature → { row: dataIndex, no: number }
  var rowsToDelete = []; // sheet row numbers (1-based) to delete

  for (var i = 0; i < data.length; i++) {
    var apt = String(data[i][0]).trim();
    var name = String(data[i][1]).trim();
    var checkin = String(data[i][3]).trim();
    var no = Number(data[i][5]);

    // Skip rows without a name (secondary guest rows or empty rows)
    if (name === '') continue;
    // Skip rows without an apartment (secondary guest rows)
    if (apt === '') continue;

    var sig = apt + '|' + name + '|' + checkin;

    if (seen[sig]) {
      // Check if the "No" values are close (within 2) — confirms same submission batch
      var firstNo = seen[sig].no;
      if (!isNaN(no) && !isNaN(firstNo) && Math.abs(no - firstNo) <= 2) {
        // This is a duplicate — mark the later row for deletion
        var sheetRow = i + 2; // data index 0 = sheet row 2
        rowsToDelete.push(sheetRow);
        Logger.log('DUPLICATE FOUND row ' + sheetRow + ': ' + sig + ' (No ' + no + ' vs ' + firstNo + ')');

        // Also delete any secondary guest rows that follow this duplicate
        for (var j = i + 1; j < data.length; j++) {
          var nextApt = String(data[j][0]).trim();
          var nextName = String(data[j][1]).trim();
          if (nextApt !== '' || nextName === '') break; // reached next group or empty
          rowsToDelete.push(j + 2);
        }
      }
    } else {
      seen[sig] = { row: i, no: no };
    }
  }

  // Delete from bottom to top so row numbers stay valid
  rowsToDelete.sort(function(a, b) { return b - a; });
  for (var k = 0; k < rowsToDelete.length; k++) {
    sheet.deleteRow(rowsToDelete[k]);
  }

  if (rowsToDelete.length > 0) {
    Logger.log('removeDuplicates: deleted ' + rowsToDelete.length + ' duplicate row(s)');
  }
}

/**
 * One-time setup: creates the time-based trigger for removeDuplicates.
 * Run this function manually once from the Apps Script editor.
 * It removes any existing removeDuplicates triggers first to avoid stacking.
 */
function installCleanupTrigger() {
  // Remove existing removeDuplicates triggers
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'removeDuplicates') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }

  // Create new time-based trigger — every 5 minutes
  ScriptApp.newTrigger('removeDuplicates')
    .timeBased()
    .everyMinutes(5)
    .create();

  Logger.log('installCleanupTrigger: removeDuplicates trigger created (every 5 min)');
}

function formatDate(dateStr) {
  // Google Forms date response is typically "YYYY-MM-DD"
  // Convert to dd/mm/yyyy
  var parts = dateStr.split('-');
  if (parts.length === 3) {
    return parts[2] + '/' + parts[1] + '/' + parts[0];
  }
  // Fallback: try to parse as Date object
  var d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    var day = ('0' + d.getDate()).slice(-2);
    var month = ('0' + (d.getMonth() + 1)).slice(-2);
    var year = d.getFullYear();
    return day + '/' + month + '/' + year;
  }
  return dateStr;
}

function getLastRowInColC(sheet) {
  var colC = sheet.getRange('C:C').getValues();
  for (var i = colC.length - 1; i >= 0; i--) {
    if (colC[i][0] !== '') return i + 1;
  }
  return 1; // only header exists
}

function getMaxNoFromSheet(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;

  var colG = sheet.getRange('G2:G' + lastRow).getValues();
  var max = 0;
  for (var i = 0; i < colG.length; i++) {
    var val = Number(colG[i][0]);
    if (!isNaN(val) && val > max) max = val;
  }
  return max;
}

function sendNotification(apartment, checkin, guests) {
  var guestList = '';
  for (var i = 0; i < guests.length; i++) {
    guestList += '  ' + (i + 1) + '. ' + guests[i].name + ' (' + guests[i].nationality + ')\n';
  }

  var subject = 'Guest Registration — ' + apartment + ' — ' + checkin;
  var body = 'New guest registration received.\n\n'
    + 'Apartment: ' + apartment + '\n'
    + 'Check-in: ' + checkin + '\n'
    + 'Guests registered: ' + guests.length + '\n\n'
    + guestList;

  MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
}
