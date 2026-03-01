import sys
import os
import cv2
import numpy as np

def extract_sprites(img_path):
    print(f"Processing spritesheet: {img_path}")
    
    # Try loading the image with an alpha channel
    img = cv2.imread(img_path, cv2.IMREAD_UNCHANGED)
    
    if img is None:
        print(f"  -> Failed to load image: {img_path}")
        return

    # Create a mask to identify distinct sprites
    if len(img.shape) == 3 and img.shape[2] == 4:
        # Use alpha channel if present
        alpha = img[:, :, 3]
        _, mask = cv2.threshold(alpha, 5, 255, cv2.THRESH_BINARY)
    else:
        # Assume top-left pixel is background
        bg_color = img[0, 0]
        diff = cv2.absdiff(img, bg_color)
        if len(diff.shape) == 3:
            gray = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
        else:
            gray = diff
        _, mask = cv2.threshold(gray, 5, 255, cv2.THRESH_BINARY)

    # Find contours around the separate shapes/sprites on the page
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Get the bounding boxes for the contours
    bounding_boxes = [cv2.boundingRect(c) for c in contours]
    
    # Filter out extremely small "noise" blocks/contours (smaller than 5x5 pixels)
    bounding_boxes = [b for b in bounding_boxes if b[2] > 5 and b[3] > 5]
    
    print(f"  -> Found {len(bounding_boxes)} sprites to extract.")

    if len(bounding_boxes) == 0:
        print("  -> Could not detect any valid sprites.")
        return

    # Sort the bounding boxes from top to bottom, then left to right
    # (By dividing Y by a chunk size like 20 or 50, we create 'rows' for sorting)
    bounding_boxes.sort(key=lambda b: (b[1] // 20, b[0]))

    base_name = os.path.splitext(os.path.basename(img_path))[0]
    out_dir = os.path.dirname(img_path)
    
    # Extract each one and save
    count = 1
    for b in bounding_boxes:
        x, y, w, h = b
        
        # Crop exactly to the sprite's bounds
        sprite = img[y:y+h, x:x+w]
        
        # Name it like "spritesheet_name_1.png", "spritesheet_name_2.png", etc.
        out_name = os.path.join(out_dir, f"{base_name}_sprite_{count}.png")
        
        cv2.imwrite(out_name, sprite)
        print(f"  -> Saved: {os.path.basename(out_name)} ({w}x{h})")
        count += 1

if __name__ == "__main__":
    # Get any dropped files
    args = sys.argv[1:]
    
    if len(args) > 0:
        # Process every image dragged onto the script
        for img_path in args:
            if os.path.isfile(img_path):
                extract_sprites(img_path)
                print("-" * 50)
            else:
                print(f"Skipping {img_path}, not a valid file.")
    else:
        print("No files detected.")
        print("To use this script: Drag and drop a spritesheet image file directly onto this Python script file.")

    # Prevent the console window from closing instantly
    input("\nPress Enter to exit...")
