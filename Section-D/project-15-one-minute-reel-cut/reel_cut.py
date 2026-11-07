import sys
import os
import cv2
import numpy as np
import speech_recognition as sr
from moviepy import VideoFileClip, TextClip, CompositeVideoClip, concatenate_videoclips

def process_reel(input_path="raw_video.mp4", output_path="final_reel.mp4"):
    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found in current directory!")
        return

    print(f"Processing {input_path}...")
    clip = VideoFileClip(input_path)
    
    # 1. Ensure duration is <= 60 seconds
    max_duration = min(clip.duration, 59.0)
    trimmed_clip = clip.subclipped(0, max_duration)
    
    # 2. Smart Crop to Vertical 9:16 (1080x1920)
    w, h = trimmed_clip.size
    target_aspect = 9 / 16
    
    if (w / h) > target_aspect:
        new_w = int(h * target_aspect)
        x_center = w // 2
        crop_x1 = max(0, x_center - (new_w // 2))
        crop_x2 = min(w, crop_x1 + new_w)
        final_clip = trimmed_clip.cropped(x1=crop_x1, y1=0, x2=crop_x2, y2=h)
    else:
        final_clip = trimmed_clip

    # Resize to standard reel 1080x1920
    final_clip = final_clip.resized(new_size=(1080, 1920))

    # 3. Write Output with Audio Enabled
    print(f"Rendering final vertical reel to {output_path}...")
    final_clip.write_videofile(
        output_path, 
        codec="libx264", 
        audio_codec="aac",
        audio=True
    )
    print("Done! Reel rendered successfully.")

if __name__ == "__main__":
    inp = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith('-') else "raw_video.mp4"
    out = sys.argv[2] if len(sys.argv) > 2 and not sys.argv[2].startswith('-') else "final_reel.mp4"
    process_reel(inp, out)