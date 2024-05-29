const R = 4;
const C = 4;
// Number of rounds
const Nr = 10;
// Number of columns
const Nb = 4;
// AES S-box
const sbox = [
    0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
    0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
    0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
    0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
    0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
    0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
    0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
    0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
    0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
    0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
    0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
    0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
    0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
    0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
    0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
    0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16
];
// AES round constant array

const Rcon = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

// SubBytes operation
function subBytes(state) {
    for (let i = 0; i < 4; ++i) {
        for (let j = 0; j < 4; ++j) {
            state[i][j] = sbox[state[i][j]];
        }
    }
}

// ShiftRows operation
function shiftRows(state) {
    let temp;

    // Shift second row
    temp = state[1][0];
    state[1][0] = state[1][1];
    state[1][1] = state[1][2];
    state[1][2] = state[1][3];
    state[1][3] = temp;

    // Shift third row
    temp = state[2][0];
    state[2][0] = state[2][2];
    state[2][2] = temp;
    temp = state[2][1];
    state[2][1] = state[2][3];
    state[2][3] = temp;

    // Shift fourth row
    temp = state[3][0];
    state[3][0] = state[3][3];
    state[3][3] = state[3][2];
    state[3][2] = state[3][1];
    state[3][1] = temp;
}

function xtime(x) {
    return (x << 1) ^ ((x & 0x80) ? 0x1b : 0x00);
}

// MixColumns operation
function mixColumns(state) {
    let tmp, tm, t;
    for (let i = 0; i < 4; ++i) {
        t = state[0][i];
        tmp = state[0][i] ^ state[1][i] ^ state[2][i] ^ state[3][i];
        tm = state[0][i] ^ state[1][i];
        tm = xtime(tm);
        state[0][i] ^= tm ^ tmp;
        tm = state[1][i] ^ state[2][i];
        tm = xtime(tm);
        state[1][i] ^= tm ^ tmp;
        tm = state[2][i] ^ state[3][i];
        tm = xtime(tm);
        state[2][i] ^= tm ^ tmp;
        tm = state[3][i] ^ t;
        tm = xtime(tm);
        state[3][i] ^= tm ^ tmp;
    }
}

// AddRoundKey operation
function addRoundKey(state, roundKey) {
    for (let i = 0; i < 4; ++i) {
        for (let j = 0; j < 4; ++j) {
            state[j][i] ^= roundKey[i * 4 + j];
        }
    }
}

// Rotate word function (circular left shift)
function rotWord(word) {
    let temp = word[0];
    word[0] = word[1];
    word[1] = word[2];
    word[2] = word[3];
    word[3] = temp;
}

// Substitution function (applies S-box to each byte of a word)
function subWord(word) {
    for (let i = 0; i < 4; i++) {
        word[i] = sbox[word[i]];
    }
}

// Key expansion function
function keyExpansion(key, roundKeys, Nk) {
    // Copy the key bytes directly into the first Nk words of the expanded key
    for (let i = 0; i < Nk * 4; i++) {
        roundKeys[i] = key[i];
    }

    // Generate the remaining round keys
    for (let i = Nk * 4; i < Nb * (Nr + 1) * 4; i += 4) {
        let temp = new Uint8Array(4);
        for (let j = 0; j < 4; j++) {
            temp[j] = roundKeys[i - 4 + j];
        }
        if (i % (Nk * 4) === 0) {
            rotWord(temp);
            subWord(temp);
            temp[0] ^= Rcon[i / (Nk * 4) - 1];
        }
        else if (Nk > 6 && i % (Nk * 4) === 4) {
            subWord(temp);
        }
        for (let j = 0; j < 4; j++) {
            roundKeys[i + j] = roundKeys[i - Nk * 4 + j] ^ temp[j];
        }
    }
}

// AES rotation function to rotate the state by 180 degrees
function rotateState180(state) {
    // Transpose the state matrix
    for (let i = 0; i < R; i++) {
        for (let j = i; j < C; j++) {
            [state[i][j], state[j][i]] = [state[j][i], state[i][j]];
        }
    }

    // Reverse the columns of the transposed matrix
    for (let i = 0; i < C; i++) {
        for (let j = 0, k = C - 1; j < k; j++, k--) {
            [state[j][i], state[k][i]] = [state[k][i], state[j][i]];
        }
    }
}


// AES cipher function
function cipher(inArray, outArray, roundKeys) {
    let state = Array.from(Array(4), () => new Uint8Array(4));

    // Initialize state with input
    for (let i = 0; i < 4; ++i) {
        for (let j = 0; j < 4; ++j) {
            state[j][i] = inArray[i * 4 + j];
        }
    }

    // Initial round
    addRoundKey(state, roundKeys);

    // Main rounds
    for (let round = 1; round < Nr; ++round) {
        subBytes(state);
        shiftRows(state);
        mixColumns(state);
        addRoundKey(state, roundKeys.slice(round * 16, round * 16 + 16));
    }

    // Final round
    subBytes(state);
    shiftRows(state);
    addRoundKey(state, roundKeys.slice(Nr * 16, Nr * 16 + 16));

    rotateState180(state);

    // Copy state to output
    for (let i = 0; i < 4; ++i) {
        for (let j = 0; j < 4; ++j) {
            outArray[i * 4 + j] = state[j][i];
        }
    }
}

// prepare message to hex
function stringToHex(input) {
    return input.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0').toUpperCase()).join('');
}

function hexStringToUint8Array(hexString, outputArray) {
    let index = 0;
    for (let i = 0; i < hexString.length; i += 2) {
        let hexByte = hexString.substring(i, i + 2);
        outputArray[index++] = parseInt(hexByte, 16);
    }
}

function padInput(input) {
    let inputSize = input.length;
    let paddingLength = (16 - (inputSize % 16)) % 16;
    return input + String.fromCharCode(paddingLength).repeat(paddingLength);
}


function encryption(plaintext) {
    const cipherKey = new Uint8Array([0x41, 0x6c, 0x62, 0x61,
                                      0x6e, 0x69, 0x61, 0x20,
                                      0x4d, 0x61, 0x66, 0x69,
                                      0x61, 0x21, 0x00, 0x00]);
    const expandedKey = new Uint8Array(176); // 11 * 16 bytes for 11 round keys
    const outputArray = new Uint8Array(16);
    // Generate round keys from cipherKey
    keyExpansion(cipherKey, expandedKey, 4);
    //const inputString = "yasser"; // text box value password
    const paddedInput = padInput(plaintext);

    const hexRepresentation = stringToHex(paddedInput);
    hexStringToUint8Array(hexRepresentation, outputArray);

    const input = new Uint8Array(16);
    for (let i = 0; i < 16; i++) {
        input[i] = outputArray[i];
    }
    const encrypted = new Uint8Array(16);

    // Perform AES encryption
    cipher(input, encrypted, expandedKey);

    // Output the encrypted data
    let encryptedHex = "";
    for (let i = 0; i < 16; ++i) {
        encryptedHex += encrypted[i].toString(16).padStart(2, '0');
    }
   return encryptedHex
}
// Assuming 'encryption' is your function name
window.encryptPassword = encryption;
