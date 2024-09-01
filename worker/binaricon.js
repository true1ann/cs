// Style variables
const FONT_SIZE = '40px';
const CHAR_SIZE = '40px';
const MARGIN_BETWEEN_CHARS = '-8px';
const LINE_HEIGHT = '0.5';
const ZERO_CHAR = '□';
const ONE_CHAR = '■';
const FRAME_STYLE_INDEX = 2; // Changed to a number
const ZOOM_LEVEL_DEFAULT = 1.0; // Changed to a number
const INPUT_STRING = "true1ann"; // Input string (must be exactly 8 characters)
const BACKGROUND_COLOR = "#282c34";
const TEXT_COLOR = "#ffffff";
const BINARY_COLOR = "#00ff00";
const FRAME_COLOR = "#ffcc00";

// Frame characters
const FRAME_CHARACTERS = [
    ["╭", "╮", "│", "─", "╰", "╯"], // 0
    ["┌", "┐", "│", "─", "└", "┘"], // 1
    ["┏", "┓", "┃", "━", "┗", "┛"], // 2
    ["╔", "╗", "║", "═", "╚", "╝"]  // 3
][FRAME_STYLE_INDEX] || FRAME_CHARACTERS[2];

// Function to adjust zoom level
function calculateZoomedFontSize(baseFontSize) {
    const userAgent = navigator.userAgent;
    let adjustedFontSize;

    // Check if the user agent indicates it's from capture.py (any version)
    const isCaptureScript = userAgent.startsWith("csv3capturer/");
    
    // Initialize zoom level
    let zoomLevel = ZOOM_LEVEL_DEFAULT; // Default zoom level

    // Extract zoom level from user agent if it's from the capturer
    if (isCaptureScript) {
        const zoomMatch = userAgent.match(/zoom\/([0-9]*\.?[0-9]+)/);
        if (zoomMatch && zoomMatch[1]) {
            zoomLevel = parseFloat(zoomMatch[1]);
        }
        // Multiply baseFontSize by zoom level
        adjustedFontSize = baseFontSize * zoomLevel;
    } else {
        // Set adjustedFontSize to baseFontSize if not from the capturer
        adjustedFontSize = baseFontSize;
    }

    return adjustedFontSize;
}

const zoomedFontSize = calculateZoomedFontSize(ZOOM_LEVEL_DEFAULT);

// Create a flex container for the body
$('body').css({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    margin: '0',
    flexDirection: 'column',
    backgroundColor: BACKGROUND_COLOR
});

// Convert string to binary and replace characters
function convertStringToBinary(input) {
    return input.split('').map(char => 
        char.charCodeAt(0).toString(2).padStart(8, '0')
            .replace(/0/g, ZERO_CHAR)
            .replace(/1/g, ONE_CHAR)
    );
}

// Create a framed output
function createFramedOutput(frameChars, binaryArray) {
    const frameDiv = $('<div>').css({
        fontFamily: 'monospace',
        display: 'inline-block',
        fontSize: FONT_SIZE,
        lineHeight: LINE_HEIGHT
    });

    // Create top border
    frameDiv.append(
        `<span style="width: ${CHAR_SIZE}; height: ${CHAR_SIZE}; display: inline-block; margin: ${MARGIN_BETWEEN_CHARS}; text-align: center; line-height: ${CHAR_SIZE}; color: ${TEXT_COLOR};">${frameChars[0]}</span>` +
        `${Array(8).fill(`<span style="width: ${CHAR_SIZE}; height: ${CHAR_SIZE}; display: inline-block; margin: ${MARGIN_BETWEEN_CHARS}; text-align: center; line-height: ${CHAR_SIZE}; color: ${TEXT_COLOR};">${frameChars[3]}</span>`).join('')}` +
        `<span style="width: ${CHAR_SIZE}; height: ${CHAR_SIZE}; display: inline-block; margin: ${MARGIN_BETWEEN_CHARS}; text-align: center; line-height: ${CHAR_SIZE}; color: ${TEXT_COLOR};">${frameChars[1]}</span><br>`
    );

    // Create content rows with binary characters
    binaryArray.forEach(binary => {
        frameDiv.append(`<span style="width: ${CHAR_SIZE}; height: ${CHAR_SIZE}; display: inline-block; margin: ${MARGIN_BETWEEN_CHARS}; text-align: center; line-height: ${CHAR_SIZE}; color: ${TEXT_COLOR};">${frameChars[2]}</span>`); // Left border
        frameDiv.append(binary.split('').map(char => 
            `<span style="width: ${CHAR_SIZE}; height: ${CHAR_SIZE}; display: inline-block; margin: ${MARGIN_BETWEEN_CHARS}; text-align: center; line-height: ${CHAR_SIZE}; color: ${BINARY_COLOR};">${char}</span>`
        ).join('')); // Binary characters
        frameDiv.append(`<span style="width: ${CHAR_SIZE}; height: ${CHAR_SIZE}; display: inline-block; margin: ${MARGIN_BETWEEN_CHARS}; text-align: center; line-height: ${CHAR_SIZE}; color: ${TEXT_COLOR};">${frameChars[2]}</span><br>`); // Right border
    });

    // Create bottom border
    frameDiv.append(
        `<span style="width: ${CHAR_SIZE}; height: ${CHAR_SIZE}; display: inline-block; margin: ${MARGIN_BETWEEN_CHARS}; text-align: center; line-height: ${CHAR_SIZE}; color: ${TEXT_COLOR};">${frameChars[4]}</span>` +
        `${Array(8).fill(`<span style="width: ${CHAR_SIZE}; height: ${CHAR_SIZE}; display: inline-block; margin: ${MARGIN_BETWEEN_CHARS}; text-align: center; line-height: ${CHAR_SIZE}; color: ${TEXT_COLOR};">${frameChars[3]}</span>`).join('')}` +
        `<span style="width: ${CHAR_SIZE}; height: ${CHAR_SIZE}; display: inline-block; margin: ${MARGIN_BETWEEN_CHARS}; text-align: center; line-height: ${CHAR_SIZE}; color: ${TEXT_COLOR};">${frameChars[5]}</span>`
    );

    return frameDiv;
}

if (INPUT_STRING.length === 8) {
    const binaryOutput = convertStringToBinary(INPUT_STRING);
    const framedOutput = createFramedOutput(FRAME_CHARACTERS, binaryOutput);
    
    const outputDiv = $('<div>').css('transform', `scale(${zoomedFontSize})`).append(framedOutput);

    const inputDiv = $('<div>').css({
        fontSize: FONT_SIZE,
        marginTop: '10px',
        textAlign: 'center',
        color: FRAME_COLOR
    }).text(INPUT_STRING);
    
    outputDiv.append(inputDiv);
    $('body').append(outputDiv);
} else {
    alert('Please set exactly 8 characters in the INPUT_STRING variable.');
}
