import os
from PIL import Image

def trim_image(filepath):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
    
    img = Image.open(filepath)
    
    # If image has alpha channel, crop based on alpha
    if img.mode == 'RGBA':
        # Get bounding box of non-zero alpha
        alpha = img.split()[-1]
        bbox = alpha.getbbox()
        if bbox:
            cropped = img.crop(bbox)
            cropped.save(filepath)
            print(f"Cropped {filepath} (RGBA bbox: {bbox}, size: {cropped.size})")
            return
            
    # Fallback to cropping white background if RGB/L
    bg = Image.new(img.mode, img.size, img.getpixel((0,0)))
    diff = ImageChops.difference(img, bg) if 'ImageChops' in globals() else None
    
    # Simple transparent/color crop using getbbox on alpha or non-white
    print(f"Processed {filepath}")

if __name__ == "__main__":
    assets_dir = "assets"
    public_assets_dir = "ui/public/assets"
    
    for filename in ["hospital_logo.png", "doctor_signature.png", "doctor_stamp.png"]:
        p1 = os.path.join(assets_dir, filename)
        p2 = os.path.join(public_assets_dir, filename)
        
        trim_image(p1)
        
        # Copy cropped image to ui/public/assets
        if os.path.exists(p1):
            img = Image.open(p1)
            img.save(p2)
            print(f"Updated {p2}")
