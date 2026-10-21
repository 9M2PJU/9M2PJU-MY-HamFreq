#!/usr/bin/env node
/**
 * Export the repeater rows in 9M2PJU.csv to OpenRepeater's CSV format.
 */

const fs = require('fs');
const path = require('path');

const inputPath = process.argv[2] || path.join(__dirname, '9M2PJU.csv');
const outputPath = process.argv[3] || path.join(__dirname, 'submission-to-openrepeater.csv');

const outputHeader = [
  'callsign', 'frequency_mhz', 'band', 'mode', 'city', 'country',
  'offset_khz', 'ctcss', 'dcs', 'latitude', 'longitude', 'coverage_km',
  'status', 'owner', 'website'
];

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (char !== '\r') {
      field += char;
    }
  }

  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

function csvToObjects(text) {
  const rows = parseCSV(text);
  if (rows.length < 2) return [];

  const headers = rows[0];
  return rows.slice(1)
    .filter(row => row.length === headers.length)
    .map(row => Object.fromEntries(headers.map((header, index) => [header, row[index]])));
}

function formatDecimal(value, minimumDecimals = 0) {
  const number = Number(value);
  if (!Number.isFinite(number)) return '';

  let result = number.toFixed(6).replace(/0+$/, '').replace(/\.$/, '');
  const decimals = result.includes('.') ? result.split('.')[1].length : 0;
  if (decimals < minimumDecimals) result += (result.includes('.') ? '' : '.') + '0'.repeat(minimumDecimals - decimals);
  return result;
}

function formatFrequency(value) {
  return formatDecimal(value, 3);
}

function formatOffset(row) {
  const offset = Number(row.Offset);
  if (!Number.isFinite(offset) || !['+', '-'].includes(row.Duplex.trim())) return '';
  const signedOffset = offset * 1000 * (row.Duplex.trim() === '-' ? -1 : 1);
  return formatDecimal(signedOffset);
}

function formatCtcss(row) {
  if (!row.Tone.trim()) return '';
  return formatDecimal(row.rToneFreq);
}

function extractCity(row) {
  const comment = row.Comment.trim();
  let match = comment.match(/\bat\s+(.+?)\s*[—–-]/);
  if (match) return match[1].trim();
  match = comment.match(/\bnear\s+(.+?)(?:,\s*None OPEN\b|$)/i);
  if (match) return match[1].trim();

  // These two current source rows share the Penang Hill coordinates but have no comment.
  if (row.Latitude === '5.424' && row.Longitude === '100.269') return 'Penang Hill';
  return row.Name.trim();
}

function csvEscape(value) {
  const text = value == null ? '' : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

const rows = csvToObjects(fs.readFileSync(inputPath, 'utf8'))
  .filter(row => ['+', '-'].includes((row.Duplex || '').trim()));

const outputRows = rows.map(row => {
  const frequency = Number(row.Frequency);
  const band = frequency < 300 ? '2m' : '70cm';

  return [
    row.Name.trim(),
    formatFrequency(row.Frequency),
    band,
    row.Mode.trim() || 'FM',
    extractCity(row),
    'Malaysia',
    formatOffset(row),
    formatCtcss(row),
    '',
    row.Latitude.trim(),
    row.Longitude.trim(),
    '',
    'active',
    '',
    ''
  ];
});

for (const [index, row] of outputRows.entries()) {
  if (row.slice(0, 6).some(value => !value)) {
    throw new Error(`Missing required OpenRepeater value on output row ${index + 2}`);
  }
}

const output = [outputHeader, ...outputRows]
  .map(row => row.map(csvEscape).join(','))
  .join('\n') + '\n';

fs.writeFileSync(outputPath, output, 'utf8');
console.log(`Exported ${outputRows.length} repeater rows to ${path.basename(outputPath)}`);
