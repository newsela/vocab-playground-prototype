/**
 * Google Apps Script — Vocab Playground Feedback Collector
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet
 * 2. Add these headers in Row 1:
 *      A: Timestamp | B: Context Clue Sleuth | C: Hot or Not? | D: Intensity Meter
 *      E: Synonym Swap | F: Passkeys | G: Favorite Game | H: Comments
 * 3. Go to Extensions > Apps Script
 * 4. Delete the default code and paste this entire file
 * 5. Click Deploy > New deployment
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Click Deploy and authorize when prompted
 * 7. Copy the Web app URL — that's your VITE_GOOGLE_SHEET_URL
 * 8. Create a .env file in the prototype/ directory:
 *      VITE_GOOGLE_SHEET_URL=https://script.google.com/macros/s/YOUR_ID/exec
 */

const GAME_LABELS = {
  gameA: 'Context Clue Sleuth',
  gameB: 'Hot or Not?',
  gameC: 'Intensity Meter',
  gameD: 'Synonym Swap',
  gameE: 'Passkeys',
};

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    var row = [
      data.timestamp || new Date().toISOString(),
      data.ratings?.gameA || '',
      data.ratings?.gameB || '',
      data.ratings?.gameC || '',
      data.ratings?.gameD || '',
      data.ratings?.gameE || '',
      GAME_LABELS[data.favorite] || data.favorite || '',
      data.comments || '',
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
