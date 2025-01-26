import cv2
from ultralytics import YOLO
import time
import sys
import os

# Check if a video file path is provided as a command-line argument
if len(sys.argv) != 2:
    print("Usage: python objectdetection.py <video_file>")
    sys.exit(1)

# Get the video file path
video_path = sys.argv[1]

# Verify that the video file exists
if not os.path.exists(video_path):
    print(f"Error: Video file '{video_path}' does not exist.")
    sys.exit(1)

# Set the correct model path
model_path = 'model/best7.pt'
print("Model path:", model_path)

# Load the YOLOv8 model
model = YOLO(model_path)

# Load the video file
cap = cv2.VideoCapture(video_path)

# Check if the video file was opened successfully
if not cap.isOpened():
    print(f"Error: Could not open video file '{video_path}'.")
    sys.exit(1)

bull_detected = False
start_time = time.time()

# Process the video frame by frame
while True:
    ret, frame = cap.read()

    # Break the loop if no more frames are available
    if not ret:
        print("End of video or unable to read frame.")
        break

    # Detect objects using the YOLO model
    results = model.predict(frame[..., ::-1])  # Convert BGR to RGB for YOLO

    # Loop over the detected objects
    for result in results:
        for obj in result.boxes:
            class_index = int(obj.cls.item())  # Convert tensor to integer
            if model.names[class_index] == 'bull':  # Check if 'bull' is detected
                bull_detected = True
                break
        if bull_detected:
            break

    # Check if 1 second has passed and print detection results
    if int(time.time() - start_time) >= 1:
        if bull_detected:
            print("Bull detected")
        else:
            print("No bull detected")
        bull_detected = False
        start_time = time.time()  # Reset the timer for the next interval

    # Display the video frame with detections (Optional)
    cv2.imshow("Video", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):  # Press 'q' to quit early
        break

# Release video resources and close windows
cap.release()
cv2.destroyAllWindows()
