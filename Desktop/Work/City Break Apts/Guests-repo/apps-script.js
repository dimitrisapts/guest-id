/**
 * Guest Registration — Google Apps Script
 * Triggers on form submission, writes guest rows to Sheet3,
 * and sends a confirmation email.
 *
 * Install: see deployment instructions at the bottom of this file.
 */

var SPREADSHEET_ID = '1xq3SR2c4l7MLDQwTqT4BbBcu9j0FjmIFOOJf0tdEmpU';
var SHEET_NAME = 'Sheet 3';
var NOTIFY_EMAIL = 'dimitriscitybreakapts@gmail.com';
var FORM_ID = '1bVXUpy_i9YyK2u49k38iT4HTR-RaoLPFiU3YhX0dGdE';

function onFormSubmit() {
  // Acquire script-wide lock to prevent simultaneous executions
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) {
    Logger.log('LOCK FAILED: another execution is in progress, exiting');
    return;
  }

  try {
    _processFormSubmission();
  } finally {
    lock.releaseLock();
  }
}

function _processFormSubmission() {
  // Get the latest form response directly (works for standalone scripts)
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

  // Open spreadsheet — needed early for duplicate check
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    Logger.log('ERROR: Sheet "' + SHEET_NAME + '" not found. Available sheets: ' +
      ss.getSheets().map(function(s) { return s.getName(); }).join(', '));
    throw new Error('Sheet "' + SHEET_NAME + '" not found in spreadsheet. Check SHEET_NAME constant.');
  }

  // Duplicate check: skip if a row with the same Guest 1 name and check-in date
  // was written in the last 60 seconds (catches rapid re-fires of the same submission)
  var guest1Name = guests[0].name;
  var lastRow = sheet.getLastRow();
  if (lastRow >= 2) {
    var now = new Date();
    var existing = sheet.getRange('C2:E' + lastRow).getValues(); // cols C(name), D(nat), E(checkin)
    for (var d = existing.length - 1; d >= 0; d--) {
      var rowName = existing[d][0];
      var rowCheckin = existing[d][2];
      if (rowName === guest1Name && rowCheckin === checkinFormatted) {
        // Check if this row's timestamp (column A, row d+2) is within 60s
        var rowTimestamp = sheet.getRange(d + 2, 1).getValue();
        if (rowTimestamp instanceof Date) {
          var ageMs = now.getTime() - rowTimestamp.getTime();
          if (ageMs >= 0 && ageMs < 60000) {
            Logger.log('DUPLICATE DETECTED: ' + guest1Name + ' / ' + checkinFormatted + ' written ' + ageMs + 'ms ago');
            return;
          }
        }
        // No timestamp — fall back to treating matching name+checkin as duplicate
        Logger.log('DUPLICATE SKIPPED (exact match): ' + apartment + ' / ' + checkinFormatted + ' / ' + guest1Name);
        return;
      }
    }
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

  // Append one row per guest — write to columns A:H
  var writeTimestamp = new Date();
  for (var g = 0; g < guests.length; g++) {
    var targetRow = lastDataRow + 1 + g;
    var row = [
      writeTimestamp,                        // A — write timestamp (for duplicate detection)
      g === 0 ? apartment : '',              // B — APT (first row only)
      guests[g].name,                        // C — Name
      guests[g].nationality,                 // D — Nationality
      checkinFormatted,                      // E — Check-in date
      '',                                    // F — blank
      g === 0 ? nextNo : '',                 // G — No (first row only)
      guests[g].id                           // H — ID/Passport
    ];
    sheet.getRange(targetRow, 1, 1, 8).setValues([row]); // cols A(1) through H(8)
  }

  // Send confirmation email
  sendNotification(apartment, checkinFormatted, guests);
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
