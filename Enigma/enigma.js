/*
 * notes
 * im not incrementing state on non alph characters
 * (how to handle non alph characters?)
 *
 *
 * todo: add rotor settings to ui
 * todo: add plugboard to ui
 * todo: optimize?
 *
 */

const debug = false;
const state = {
  rotorSetting: [0, 0, 0],
  plugBoard: { Q: 'P' },
};
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ROTOR_PERMUTATIONS = [
  'BDFHJLCPRTXVZNYEIWGAKMUSQO',
  'AJDKSIRUXBLHWTMCQGZNPYFVOE',
  'EKMFLGDQVZNTOWYHXUSPAIBRCJ',
];
const REFLECTOR_PERMUTATION = 'IXUHFEZDAOMTKQJWNSRLCYPBVG';

// drawing constants
const fontsize = 20;
const ySpacing = 30;
const xSpacing = 150;
const rotor0x = ySpacing;
const rotor1x = rotor0x + xSpacing;
const rotor2x = rotor1x + xSpacing;
const rotor3x = rotor2x + xSpacing;
const rectHeight = 5;
const rectWidth = 10;
let font;
let linesDrawn = false;
let drawnReflectors = [];
let lastLetter;
let lastValue;
let currentInput = '';
let currentOutput = '';
let outputP;

if (debug) {
  console.log('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  console.log(ROTOR_PERMUTATIONS[0]);
  console.log(ROTOR_PERMUTATIONS[1]);
  console.log(ROTOR_PERMUTATIONS[2]);
}

const getAlphLetterIndex = (letter) => ALPHABET.indexOf(letter);
const getStringLetterIndex = (letter, string) => string.indexOf(letter);
const getAlphLetter = (code) => ALPHABET[code];

const applyOffset = (arr, offset) => {
  for (let i = 0; i < offset; i += 1) {
    arr.push(arr.shift());
  }
  return arr;
};

const getWire = (permString, offset, inverse) => {
  const wire = [...(inverse ? ALPHABET : permString)].map((letter, index) => {
    const letterOffset =
      getStringLetterIndex(letter, inverse ? permString : ALPHABET) - index;
    // console.log(
    //   `${ALPHABET[index]}[${index}] -> ${letter}[${ALPHABET.indexOf(letter)}] = ${letterOffset}`,
    // );
    return letterOffset;
  });

  return applyOffset(wire, offset);
};

const getTransformation = (index, permutationString, offset, inverse) => {
  const wire = getWire(permutationString, offset, inverse);
  let transformation = index + wire[index];

  if (transformation < 0) {
    transformation = ALPHABET.length + index + wire[index];
  } else if (transformation >= ALPHABET.length) {
    transformation = ((index + wire[index]) % 25) - 1;
  }

  // console.log('start index:', index);
  // console.log('wire trasformation: +', wire[index]);
  // console.log('index + wire:', index + wire[index]);
  // console.log('alph[index + wire]:', ALPHABET[index + wire[index]]);

  return transformation;
};

const doPermutations = (letter) => {
  if (ALPHABET.indexOf(letter) < 0) {
    return letter;
  }

  let {
    rotorSetting: [offset1, offset2, offset3],
  } = state;

  const { plugBoard } = state;
  const [rotor1, rotor2, rotor3] = ROTOR_PERMUTATIONS;
  const index = getAlphLetterIndex(plugBoard[letter] || letter);
  const output1 = getTransformation(index, rotor1, offset1);
  const output2 = getTransformation(output1, rotor2, offset2);
  const output3 = getTransformation(output2, rotor3, offset3);
  const output4 = getTransformation(output3, REFLECTOR_PERMUTATION, 0);
  const output5 = getTransformation(output4, rotor3, offset3, true);
  const output6 = getTransformation(output5, rotor2, offset2, true);
  const output7 = getTransformation(output6, rotor1, offset1, true);
  const outputLetter = getAlphLetter(output7);
  const pbEndSwap = plugBoard[outputLetter];

  offset1 += 1;
  if (offset1 === 26) {
    offset1 = 0;
    offset2 += 1;
    if (offset2 === 26) {
      offset2 = 0;
      offset3 += 1;
      if (offset3 === 26) {
        offset3 = 0;
      }
    }
  }
  console.log(`updating rotor settings to ${[offset1, offset2, offset3]}`);

  state.rotorSetting = [offset1, offset2, offset3];

  if (debug) {
    console.log(`Log: Starting Letter: ${letter}`);
    console.log(`Log: PlugBoard value: ${plugBoard[letter]}`);
    console.log(`Log: Pre-Transform Letter: ${plugBoard[letter] || letter}`);
    console.log(`Log: Pre-Transform Index: ${index}`);
    console.log(
      `Log: Wire 1 Output: ${output1} - (${getAlphLetter(
        index,
      )}->${getAlphLetter(output1)})`,
    );
    console.log(
      `Log: Wire 2 Output: ${output2} - (${getAlphLetter(
        output1,
      )}->${getAlphLetter(output2)})`,
    );
    console.log(
      `Log: Wire 3 Output: ${output3} - (${getAlphLetter(
        output2,
      )}->${getAlphLetter(output3)})`,
    );
    console.log(
      `Log: Reflector Output: ${output4} - (${getAlphLetter(
        output3,
      )}->${getAlphLetter(output4)})`,
    );
    console.log(
      `Log: Wire 3 Output: ${output5}: (${getAlphLetter(
        output4,
      )}->${getAlphLetter(output5)})`,
    );
    console.log(
      `Log: Wire 2 Output: ${output6}: (${getAlphLetter(
        output5,
      )}->${getAlphLetter(output6)})`,
    );
    console.log(
      `Log: Wire 1 Output: ${output7}: (${getAlphLetter(
        output6,
      )}->${getAlphLetter(output7)})`,
    );
    console.log(`Log: Post-Transform index: ${output7}`);
    console.log(`Log: Post-Transform letter: ${outputLetter}`);
    console.log(`Log: Post-Transform Plugboard Value: ${pbEndSwap}`);
    console.log(`Log: End Value: ${pbEndSwap || outputLetter}`);
    console.log(`Log: Changing State To ${[offset1, offset2, offset3]}`);
  }

  return pbEndSwap || outputLetter;
};

const enigma = (input) =>
  [...input.toUpperCase()].map((letter) => doPermutations(letter)).join('');

const addEventListeners = () => {
  const { document } = this;
  document
    .getElementById('inputBox')
    .addEventListener('input', ({ data: letter, target: { value } }) => {
      lastLetter = letter;
      this.clear();

      linesDrawn = false;
      drawnReflectors = [];
      console.log(`lastValue : ${lastValue}`);
      console.log(`value : ${value}`);
      console.log(
        `('outputBox').value : ${document.getElementById('outputBox').value}`,
      );

      if (value.indexOf(lastValue) >= 0) {
        document.getElementById('outputBox').value += enigma(
          value[value.length - 1],
        );
      } else {
        state.rotorSetting = [0, 0, 0];
        document.getElementById('outputBox').value = enigma(value);
      }
      lastValue = value;
      this.redraw();
    });
};

this.preload = () => {
  // Ensure the .ttf or .otf font stored in the assets directory
  // is loaded before setup() and draw() are called
  font = this.loadFont('assets/Roboto-Black.ttf');
};

this.setup = () => {
  this.createCanvas(800, 1000);
  this.background(255);
  this.textFont(font);
  this.textSize(fontsize);
  this.textAlign(this.CENTER, this.CENTER);
  addEventListeners();
  this.noLoop();
};

this.draw = () => {
  const { text, rect, fill, line, noFill, curve } = this;
  const [rotor1, rotor2, rotor3] = ROTOR_PERMUTATIONS;
  const {
    rotorSetting: [rotorSetting1, rotorSetting2, rotorSetting3],
  } = state;

  for (let i = 0; i < ALPHABET.length; i += 1) {
    const letterY = ySpacing + i * ySpacing;
    const rotor1Letter = applyOffset([...rotor1], rotorSetting1)[i];
    const rotor2Letter = applyOffset([...rotor2], rotorSetting2)[i];
    const rotor3Letter = applyOffset([...rotor3], rotorSetting3)[i];
    const reflectorLetter = REFLECTOR_PERMUTATION[i];
    const rotor1AlphIndex = applyOffset([...ALPHABET], rotorSetting1).indexOf(
      rotor1Letter,
    );
    const rotor2AlphIndex = applyOffset([...ALPHABET], rotorSetting2).indexOf(
      rotor2Letter,
    );
    const rotor3AlphIndex = applyOffset([...ALPHABET], rotorSetting3).indexOf(
      rotor3Letter,
    );
    const reflectorAlphIndex = ALPHABET.indexOf(reflectorLetter);

    fill(0);
    text(ALPHABET[i], rotor0x, letterY);
    text(ALPHABET[i], rotor1x, letterY);
    text(ALPHABET[i], rotor2x, letterY);
    text(ALPHABET[i], rotor3x, letterY);
    rect(rotor0x + 10, letterY, rectWidth, rectHeight);
    rect(rotor1x - 20, letterY, rectWidth, rectHeight);
    rect(rotor1x + 10, letterY, rectWidth, rectHeight);
    rect(rotor2x - 20, letterY, rectWidth, rectHeight);
    rect(rotor2x + 10, letterY, rectWidth, rectHeight);
    rect(rotor3x - 20, letterY, rectWidth, rectHeight);
    rect(rotor3x + 10, letterY, rectWidth, rectHeight);

    line(
      rotor0x + 10 + rectWidth,
      letterY + rectHeight / 2,
      rotor1x - 20,
      30 * rotor1AlphIndex + 30 + rectHeight / 2,
    );
    line(
      rotor1x + 10 + rectWidth,
      letterY + rectHeight / 2,
      rotor2x - 20,
      30 * rotor2AlphIndex + 30 + rectHeight / 2,
    );
    line(
      rotor2x + 10 + rectWidth,
      letterY + rectHeight / 2,
      rotor3x - 20,
      30 * rotor3AlphIndex + 30 + rectHeight / 2,
    );

    if (!drawnReflectors.includes(reflectorLetter)) {
      noFill();

      curve(
        rotor3x + 10 + rectWidth - 400,
        letterY + rectHeight / 2,
        rotor3x + 10 + rectWidth,
        letterY + rectHeight / 2,
        rotor3x + 10 + rectWidth,
        30 * reflectorAlphIndex + 30 + rectHeight / 2,
        rotor3x - 20 - 400,
        30 * reflectorAlphIndex + 30 + rectHeight / 2,
      );
      drawnReflectors.push(ALPHABET[i], reflectorLetter);
    }
  }
};
