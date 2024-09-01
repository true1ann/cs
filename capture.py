import json
import sys
import time
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os

def load_config():
    with open('resconfig.json') as config_file:
        return json.load(config_file)

def calculate_zoom_and_window_size(res, multiplier):
    # Use the resolution from the config
    window_width = res[0] * multiplier  # Access width from the list
    window_height = res[1] * multiplier  # Access height from the list
    return multiplier, window_width, window_height

def take_screenshot(final=False):
    # Load configuration
    config = load_config()
    res = config['res']
    multiplier = config['res_multiplier']

    # Calculate zoom level and window size
    zoom_level, window_width, window_height = calculate_zoom_and_window_size(res, multiplier)

    # Set up Chrome options
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run in headless mode
    chrome_options.add_argument(f"--window-size={window_width}x{window_height}")  # Set the window size based on zoom level
    chrome_options.add_argument(f"user-agent=csv3capturer/v1.1 zoom/{zoom_level}")  # Set your custom user agent with zoom level

    # Specify the path to the ChromeDriver
    service = Service('./chromedriver')  # Ensure this points to the actual chromedriver executable
    driver = webdriver.Chrome(service=service, options=chrome_options)

    # Load the content.html file
    driver.get("http://localhost:65069/content.html")  # Adjust this in server.js settings.

    # Wait for the page to load completely (wait for a specific element)
    try:
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "content")))  # Adjust the selector as needed
    except Exception as e:
        print("Error waiting for page to load:", e)

    # Generate the timestamped filename
    now = datetime.now()
    if final:
        folder = "finals"
        prefix = "final"
    else:
        folder = "betas"
        prefix = "beta"

    # Create the folder if it doesn't exist
    os.makedirs(folder, exist_ok=True)

    # Format the filename
    filename = f"{prefix}-{now.year}-{now.month:02d}-{now.day:02d}_{now.hour:02d}_{now.minute:02d}_{now.second:02d}.png"
    filepath = os.path.join(folder, filename)

    # Take a screenshot
    driver.save_screenshot(filepath)
    print(f"Screenshot saved as {filepath}")

    # Clean up
    driver.quit()

if __name__ == "__main__":
    # Load configuration
    config = load_config()
    multiplier = config['res_multiplier']  # Set multiplier from config
    if len(sys.argv) > 1 and sys.argv[1] == "final":
        take_screenshot(final=True)
    else:
        take_screenshot(final=False)
