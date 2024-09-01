// Configuration
const PHRASE = "csv3 wordwall "; // Desired phrase
const TOTAL_REPETITIONS = 3000; // Total number of repetitions
const BREAK_AFTER = 10; // Number of repetitions before adding a line break
const GRADIENT_COLORS = ['#ff0000', '#0000ff']; // Gradient colors
const FONT_SIZE = "0.5rem"; // Font size
const GRADIENT_SIZE = ['100%', '50%', '0%']; // Gradient configuration

// Set body styles
Object.assign(document.body.style, {
    backgroundColor: "black",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    margin: "0",
    overflow: "hidden" // Hide overflow for the body
});

// Function to adjust font size based on user agent
function getZoomedFontSize(baseFontSize) {
    const userAgent = navigator.userAgent;
    let adjustedFontSize;

    // Check if the user agent indicates it's from capture.py (any version)
    const isCaptureScript = userAgent.startsWith("csv3capturer/");
    
    // Initialize zoom level
    let zoomLevel = 1; // Default zoom level

    // Extract zoom level from user agent if it's from the capturer
    if (isCaptureScript) {
        const zoomMatch = userAgent.match(/zoom\/([0-9]*\.?[0-9]+)/);
        if (zoomMatch && zoomMatch[1]) {
            zoomLevel = parseFloat(zoomMatch[1]);
        }
        // Convert baseFontSize to a number and multiply by zoom level
        const baseFontSizeValue = parseFloat(baseFontSize); // Extract numeric part
        adjustedFontSize = `${baseFontSizeValue * zoomLevel}rem`; // Append 'rem' after calculation
    } else {
        // Set adjustedFontSize to baseFontSize if not from the capturer
        adjustedFontSize = baseFontSize;
    }

    return adjustedFontSize;
}

// Call the function with the FONT_SIZE
const zoomedFontSize = getZoomedFontSize(FONT_SIZE);

// Create the gradient text element
const gradientTextElement = document.createElement('div');
Object.assign(gradientTextElement.style, {
    fontSize: zoomedFontSize,
    lineHeight: "1",
    textAlign: "center",
    background: `linear-gradient(270deg, ${GRADIENT_COLORS.join(', ')})`,
    webkitBackgroundClip: "text",
    webkitTextFillColor: "transparent",
    whiteSpace: "pre-wrap", // Allow line breaks on <br> but prevent automatic wrapping
    overflow: "visible", // Ensure overflow is visible
    backgroundSize: `${GRADIENT_SIZE[0]} ${GRADIENT_SIZE[0]}`, // Adjust the size of the gradient
    backgroundPosition: `${GRADIENT_SIZE[1]} ${GRADIENT_SIZE[2]}` // Start position of the gradient
});

// Build the text with line breaks
let textContent = Array.from({ length: TOTAL_REPETITIONS }, (_, i) => {
    return (i + 1) % BREAK_AFTER === 0 ? `${PHRASE}\n` : PHRASE;
}).join('').trim(); // Create the text content with line breaks

gradientTextElement.textContent = textContent; // Set the text content

// Create a container div for the gradient text
const textContainer = document.createElement('div');
Object.assign(textContainer.style, {
    position: "relative", // Position relative for the child
    transform: "rotate(-45deg) scale(2)", // Rotate the container
    display: "flex", // Use flexbox to center the text
    justifyContent: "center", // Center horizontally
    alignItems: "center", // Center vertically
    width: "100%", // Allow the container to take full width
    height: "100%", // Allow the container to take full height
    overflow: "visible" // Ensure overflow is visible
});

// Append the gradient text to the container
textContainer.appendChild(gradientTextElement);

// Append the container to the body
document.body.appendChild(textContainer);
