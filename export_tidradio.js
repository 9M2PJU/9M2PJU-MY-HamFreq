#!/usr/bin/env node
/**
 * Convert 9M2PJU.csv to TIDRADIO.csv format (CHIRP-compatible, no Lat/Lon columns).
 * Output matches the TIDRADIO import format with proper decimal precision.
 */
const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, '9M2PJU.csv'), 'utf-8');
const lines = input.trim().split('\n');
const header = lines[0].split(',');
const rows = lines.slice(1);

// Target columns (no Latitude/Longitude)
const outHeader = 'Location,Name,Frequency,Duplex,Offset,Tone,rToneFreq,cToneFreq,DtcsCode,DtcsPolarity,RxDtcsCode,CrossMode,Mode,TStep,Skip,Power,Comment,URCALL,RPT1CALL,RPT2CALL,DVCODE';

// Find column indices from source
const idx = {};
header.forEach((h, i) => { idx[h.trim()] = i; });

function fmt(freq) {
  const f = parseFloat(freq);
  if (isNaN(f)) return '0.000000';
  return f.toFixed(6);
}

function fmtOffset(o) {
  const f = parseFloat(o);
  if (isNaN(f) || f === 0) return '0.00000';
  return f.toFixed(5);
}

function fmtTone(t) {
  const f = parseFloat(t);
  if (isNaN(f)) return '';
  return f.toFixed(1);
}

function fmtDtcs(d) {
  if (!d) return '023';
  const s = String(d).padStart(3, '0');
  return s;
}

function fmtTStep(t) {
  const f = parseFloat(t);
  if (isNaN(f)) return '5.0';
  return f.toFixed(1);
}

// Determine power: repeaters = 4.0W, simplex/V channels/PMR = 1.0W
function fmtPower(power, duplex, freq) {
  const f = parseFloat(freq);
  // PMR446
  if (f >= 446 && f <= 446.2) return '5.0W';
  // Has duplex direction = repeater
  if (duplex === '+' || duplex === '-') return '4.0W';
  // APRS
  if (f >= 144.38 && f <= 144.40) return '4.0W';
  // Simplex / V channels
  return '5.0W';
}

const outLines = [outHeader];

rows.forEach((line, i) => {
  // Handle quoted fields (Comment may contain commas)
  const cols = [];
  let cur = '';
  let inQuote = false;
  for (let c = 0; c < line.length; c++) {
    const ch = line[c];
    if (ch === '"') { inQuote = !inQuote; continue; }
    if (ch === ',' && !inQuote) { cols.push(cur); cur = ''; continue; }
    cur += ch;
  }
  cols.push(cur);

  const location = String(i + 1);
  const name = (cols[idx['Name']] || '').trim();
  const frequency = fmt(cols[idx['Frequency']] || '0');
  const duplex = (cols[idx['Duplex']] || '').trim();
  const offset = fmtOffset(cols[idx['Offset']] || '0');
  const tone = (cols[idx['Tone']] || '').trim();
  const rToneFreq = fmtTone(cols[idx['rToneFreq']] || '');
  const cToneFreq = fmtTone(cols[idx['cToneFreq']] || '');
  const dtcsCode = fmtDtcs(cols[idx['DtcsCode']] || '023');
  const dtcsPolarity = (cols[idx['DtcsPolarity']] || 'NN').trim();
  const rxDtcsCode = fmtDtcs(cols[idx['RxDtcsCode']] || '023');
  const crossMode = (cols[idx['CrossMode']] || 'Tone->Tone').trim();
  const mode = (cols[idx['Mode']] || 'FM').trim();
  const tStep = fmtTStep(cols[idx['TStep']] || '5');
  const skip = (cols[idx['Skip']] || '').trim();
  const power = fmtPower(cols[idx['Power']] || '', duplex, cols[idx['Frequency']] || '0');
  const comment = (cols[idx['Comment']] || '').trim();
  const urcall = (cols[idx['URCALL']] || '').trim();
  const rpt1call = (cols[idx['RPT1CALL']] || '').trim();
  const rpt2call = (cols[idx['RPT2CALL']] || '').trim();
  const dvcode = (cols[idx['DVCODE']] || '').trim();

  outLines.push([
    location, name, frequency, duplex, offset, tone,
    rToneFreq, cToneFreq, dtcsCode, dtcsPolarity, rxDtcsCode,
    crossMode, mode, tStep, skip, power,
    `"${comment}"`, urcall, rpt1call, rpt2call, dvcode
  ].join(','));
});

const output = outLines.join('\n') + '\n';
const outPath = path.join(__dirname, 'TIDRADIO.csv');
fs.writeFileSync(outPath, output);
console.log(`✓ Exported ${rows.length} channels to TIDRADIO.csv`);
console.log(`  Format: CHIRP-compatible (no Lat/Lon, 6-decimal freq, proper DCS padding)`);
console.log(`  Power: 4.0W repeaters/APRS, 1.0W simplex/V-channels/PMR446`);
