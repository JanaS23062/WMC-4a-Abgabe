"use strict"

const readLine = require('readline');
const crypto = require('crypto');

// Interface Schnittstelle für Konsole
const rl = readLine.createInterface({
	input: process.stdin,
	output: process.stdout
});

// Hilfsfunktion für allgemeine Fragen
function askQuestion(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

// Hilfsfunktion für Ja/Nein-Fragen
async function askYesNo(question, defaultValue = false) {
  const hint = defaultValue ? '(J/n)' : '(j/N)';
  const answer = await askQuestion(`${question} ${hint}: `);
  const formatted = answer.trim().toLowerCase();

  if (formatted === '') return defaultValue;
  return ['y', 'yes', 'j', 'ja'].includes(formatted);
}

// Hilfsfunktion zur Abfrage der Passwortlänge
async function askPasswordLength() {
  while (true) {
    const answer = await askQuestion('Wie lang soll das Passwort sein? (z.B. 16): ');
    const length = parseInt(answer.trim(), 10);

    if (!isNaN(length) && length >= 4 && length <= 128) {
      return length;
    }
    console.log(' Bitte gib eine gültige Zahl zwischen 4 und 128 ein.\n');
  }
}

// Passwortgenerierungsfunktion
function generatePassword(length, includeSpecialChars) {
  const lettersAndDigits = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const charSet = includeSpecialChars ? lettersAndDigits + specialChars : lettersAndDigits;
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charSet.length);
    password += charSet[randomIndex];
  }
  
  return password;
}

// Hauptablauf
async function main() {
	console.log('--- Passwort Genereator ---\n');

	const length = await askPasswordLength();
	const includeSpecialChars = await askYesNo('Sollen Sonderzeichen enthalten sein?');

	const password = generatePassword(length, includeSpecialChars);

	console.log('\n------------------------------');
  	console.log(`Dein generiertes Passwort: ${password}`);
  	console.log('------------------------------');

 	rl.close();
}

main();
