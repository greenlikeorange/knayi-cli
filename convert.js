#! /usr/bin/env node

var fs = require("fs");
var readline = require('readline');
var knayi = require("knayi-myscript");

var outputWriteSteam;
if (process.argv.length > 3) {
  var outFile = process.argv[3];
  outputWriteSteam = fs.createWriteStream(outFile);
}

var outputUnicode = function(outputLine, done) {
  if (outputWriteSteam) {
    outputWriteSteam.write(outputLine + '\n');
  } else {
    console.log(outputLine);
  }
}

outputUnicode.done = function(lastLine) {
  if (outputWriteSteam) {
    outputWriteSteam.end(lastLine);
  } else {
    console.log(lastLine); 
  }
}

if (process.argv.length > 2) {
  var srcFile = process.argv[2];
  var lineReader = readline.createInterface({
    input: fs.createReadStream(srcFile),
  });

  var fontType;
  var lineCount = 0;
  var lastLine = '';
  
  lineReader.on('line', function (currentLine) {
    lineCount++
    if (lineCount < 100) {
      lastLine += currentLine + '\n';
      return;
    } else if (lineCount === 100) {
      lastLine += currentLine;
      fontType = knayi.fontDetect(first100);
    }

    if (fontType === 'zawgyi') {
      outputUnicode(knayi.fontConvert(lastLine, 'unicode', 'zawgyi'));
    } else {
      outputUnicode(currentLine); 
    }
    lastLine = currentLine;
  });

  lineReader.on('close', function () {
    outputUnicode.done(knayi.fontConvert(lastLine, 'unicode'));
  })
} else {
  console.log("Please provide a file name.");
}
