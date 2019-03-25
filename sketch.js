//prompts shown at the beginning
let promptArray = ["Are you ready to present your ICM final??", "I'm so excited for the winter show! Are you?", "OMG what's your favorite meme?", "Do you wanna do something fun? Wanna go to Taco Bell?", "Did you ever think that maybe there's more to life than being ridiculously good looking?", "Who is your favorite member of the Beatles?", "Tell me a joke!", "Was the door big enough for Jack?", "Team Edward or Team Jacob?", "How do you feel about Shark Week", "What's your sign?"];


let speechRec;

//array of strings spoken into mic
let speechArray = [];

let cnv;  // canvas variable

let mic, vol, amp, freq;  // sound analysis variables

//array of volume for each string
let volArray = [];
let hiFreqArray = [];
let avgFreqArray = [];
let timeArray = [];
let timeDiffArray = [];
let avgTime = [];

let arrayIndex;

//buttons
let start;
let rec;
let save;
let micIcon;
let clearScreen;

let highestFreq;
let avgFreq;
let avgSpeed;

//font variables
var normalFont, lightFont, fontItalic, fontBold, medItalic, condensedItalic;
let thinItalic;
let veryBold;

let index;


//message screen object
// let screen = {
//   x : 0,
//   y : 0,
//   w : (windowHeight - 10)*.7,
//   h : windowHeight - 10
// }


function preLoad() {
  // normalFont = loadFont('fonts/HelveticaNeue-Roman.otf');
  //fontItalic = loadFont('fonts/HelveticaNeueItalic.ttf');
  //fontBold = loadFont('fonts/HelveticaNeue-Black.otf');
}



function setup() {
  cnv = createCanvas(windowWidth, windowHeight);

  let lang = navigator.language || 'en-US';
    speechRec = new p5.SpeechRec(lang, gotSpeech); //setting varible to store speech
    

  //setting up mic input
  mic = new p5.AudioIn();  //mic input
  mic.start();


    //start recording button
    start = createButton('Prompt');
    start.position(windowWidth - 80, 40);
    start.mousePressed(nextPrompt);

    //stop recording button
    rec = createButton('Respond');
    //micIcon.loadPixels();
    //rec = createImg(micIcon);
    rec.position(windowWidth - 80, 80);
    rec.mousePressed(startRec);

    //save button
    save = createButton('Save');
    save.position(windowWidth - 80, 120);
    save.mousePressed(saveText);

    //clear button
    clearScreen = createButton('Clear');
    clearScreen.position(windowWidth - 80, 160);
    clearScreen.mousePressed(deleteIt);

    //frequency analysis
    freq = new p5.FFT();
    freq.setInput(mic);  //frequency



    //fonts
    normalFont = loadFont('fonts/HelveticaNeue-Roman.otf');
    fontBold = loadFont('fonts/HelveticaNeue-Black.otf');
    fontItalic = loadFont('fonts/HelveticaNeueItalic.ttf');
    medItalic = loadFont('fonts/HelveticaNeue-LightExtObl.otf');
    condensedItalic = loadFont('fonts/HelveticaNeue-CondensedObl.otf');
    thinItalic = loadFont('fonts/HelveticaNeue-ThinExtObl.otf');
    veryBold = loadFont('fonts/HelveticaNeue-BoldCondObl.otf');
    lightFont = loadFont('fonts/HelveticaNeue-UltraLigCond.otf');

    //p5 Audio analysis instances
  // mic = new p5.AudioIn();  //mic input
  //  mic.start();
}

function gotSpeech() {
  //console.log(speechRec.resultJSON);
  let timeStamp = speechRec.resultJSON.timeStamp;
  console.log("Timestamp: " + timeStamp);
  timeArray.push(timeStamp);
  console.log(timeArray);


  //if there is speech information recorded, push the string into an array
  if (speechRec.resultString) {
    speechArray.push(speechRec.resultString);
    console.log(speechArray);
    speechAnalysis();
    freqAnalysis();
    speechSpeed();
  }
}


//starts recording speech
function startRec() {
   // mic = new p5.AudioIn();  //mic input
   // mic.start();

  let continuous = true;
  let interimResults = false;

  speechRec.start(continuous, interimResults);
    //speechRec.start();
}

function stopRec() {
  mic.stop();
}


function speechAnalysis() {
  // getting volume at the time of speech
  vol = mic.getLevel();
  console.log("Volume: " + vol);
  
  // adding volume values to an array
  volArray.push(vol);
  console.log(volArray);

  // // getting frequency array
  // freq = new p5.FFT();
  // freq.setInput(mic);  //frequency
  // let spectrum = freq.waveform();
  // //console.log(spectrum);
  
  // //averaging freq values
  // let sum = 0;
  // for (let i = 0; i < spectrum.length; i++) {
  //  sum += spectrum[i];
  // }
  // let avgFreq = (sum/spectrum.length);
  // console.log(avgFreq);
  
}


function draw() {
  background(255);
  fill(0);
  textSize(32);


  //message screen object
  let screen = {
    x : windowWidth/2,
    y : windowHeight/2,
    w : (windowHeight - 10)*.8,
    h : windowHeight - 10
  }

  //creating message screen
  push();
  rectMode(CENTER);
  fill(245);
  strokeWeight(3);
  stroke(150);
  //rect(0, 0, ((windowHeight - 10)*.7), windowHeight - 10);
  rect(screen.x, screen.y, screen.w, screen.h);
  //rect(windowWidth/2, windowHeight/2, screen.w, screen.h);
  pop();

  //calling prompt generating function
  writePrompt();
  


  if (speechArray) {
    //drawSpeech();
    push();
    animateVolume();
    pop();
  }
  //freqAnalysis();
}

//downloads canvas as png file
function saveText() {
  saveCanvas(cnv, 'text conversion', 'png');
}

function freqAnalysis() {
  // getting frequency array
  // freq = new p5.FFT();
  // freq.setInput(mic);  //frequency
  //let spectrum = freq.waveform();
  let spectrum = freq.analyze();
  
  //console.log(spectrum);

  
  //averaging freq values
  let sum = 0;
  let arrayHigh = -1;
  // let highestFreq = 0;
  // let avgFreq;
  
  for (let i = 0; i < spectrum.length; i++) {
    sum += spectrum[i];  // sum of all array indices
    avgFreq = (sum/spectrum.length);  // average of array indices
    //console.log(avgFreq);

    if (spectrum[i] > arrayHigh) {
      highestFreq = spectrum[i];
      arrayHigh = highestFreq;
    }
  }
  //console.log(spectrum);
  console.log("Average Frequency: " + avgFreq);
  avgFreqArray.push(avgFreq);
  console.log(avgFreqArray);

  console.log("Highest Frequency: " + highestFreq);
  hiFreqArray.push(highestFreq);
  console.log(hiFreqArray);
}

function speechSpeed() {
  if (timeArray.length > 1) {
    for (let i = 1; i < timeArray.length; i++) {
        let difference = timeArray[i] - timeArray[i - 1];
        timeDiffArray.push(difference);
    }
      console.log("difference: " + timeDiffArray);
      let sum = 0;
      for (let i = 0; i < timeDiffArray.length; i++) {
        sum += timeDiffArray[i];
        avgSpeed = (sum/timeDiffArray.length)
      }
      console.log("Average Speed: " + avgSpeed);
  }
}

function averageSpeed() {
  let sum = 0;
  for (let i = 0; i < timeDiffArray.length; i++) {
    sum += timeDiffArray[i];
    avgSpeed = (sum/timeDiffArray.length)
  }
  console.log("Average Speed: " + avgSpeed);
}


function drawSpeech() {  
  // wordArray.push(words);
  for (let i = 0; i < speechArray.length; i++) {
    text(speechArray[i], noise(i+frameCount*0.01)*width, noise(i+frameCount*0.01+100)*height);
  }
}

function animateVolume() {
  
    // setting font as helvetica
  //message screen object

  textAlign(LEFT);
  fill(0);

  let msgScreen = {
    x : windowWidth/2,
    y : windowHeight/2,
    w : (windowHeight - 10)*.7,
    h : windowHeight - 10
  }



  for (let i = 0; i < speechArray.length; i++) {
    //mapping data 
    let mapVol = map(volArray[i], 0.001, 0.01, 11, 32);
    let mapFreq = map(hiFreqArray[i], 50, 150, 0, 100);
    let mapAvgFreq = map(avgFreqArray[i], 3, 30, 130, 0);
    
    let speedMap = map(avgSpeed, 3000, 9000, 0, 10);
    //let mapHiFreq = noise(hiFreqArray[i]+frameCount*0.01+10)*height;
    fill(mapAvgFreq);
    let mapHiFreq = noise(hiFreqArray[i]+frameCount*0.01+10)*height;
    //let mapHiFreq = noise(hiFreqArray[i]+frameCount*0.01*i+10)*height;

    //SIZE MANIPULATIONS
    // textSize(mapVol);
    
    if (volArray[i] > 0.009) {
      textFont(fontBold);
      textSize(24);
    }
    if (volArray[i] < 0.003) {
      textSize(random(9, 10));
    }
    if (speedMap > 6) {
      textSize(random(23,24));
    }
    else {
      textSize(mapVol);
    }
    
    //FONT MANIPULATIONS
    if (speedMap > 9) {
      textSize(random(18, 24));
      textFont(condensedItalic);
    }
    if (speedMap < 3) {
      textFont(condensedItalic);
    }
    if (mapVol > 22) {
      textFont(veryBold);
    }
    if (mapVol < 17) {
      textFont(lightFont);
    }
    if (avgSpeed < 3000) {
      textFont(thinItalic);
    }
    if (avgFreqArray[i] > 10 && avgFreqArray[i] < 20) {
      textFont(condensedItalic);
    }
  
    else {
      textFont(normalFont);
    }
    let movement = random(map(hiFreqArray[i], 50, 150, -7, 7));
    //text(speechArray[i], windowWidth/2, 150 + 50*i, 220, 200);
    text(speechArray[i], windowWidth/2+movement, 150 + (50*i) + movement, 220, 200);
    //text(speechArray[i], windowWidth/2, mapHiFreq, 220, 200);
    //console.log(mapFreq);
    //console.log(mapAvgFreq);
    //console.log(mapHiFreq);
    }

  }


function writePrompt() {
  let selectPrompt = floor(random(promptArray.length));
  //console.log(selectPrompt);
  

  textAlign(LEFT);
  fill(90);
  textSize(16);
  textFont(normalFont);
  text(promptArray[index], windowWidth/2 - 200, 20, 250, 200);
}

function nextPrompt() {
  index = floor(random(promptArray.length));
}

function deleteIt() {
  clear();
}















