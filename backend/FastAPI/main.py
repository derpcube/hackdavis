# main.py
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.responses import StreamingResponse
from ultralytics import YOLO
import requests, cv2, numpy as np, io, json

app = FastAPI()

# 1) Load camera → URL mapping from JSON
cameras: dict[str, str] = {}
with open('cameras.txt', 'r') as f:
    data = json.load(f)                  # parse full JSON array
    for cam in data:
        cam_id = cam.get('id')
        cam_url = cam.get('url')
        # only include entries that have both id and url
        if isinstance(cam_id, str) and isinstance(cam_url, str):
            cameras[cam_id] = cam_url

# 2) Load your trained YOLOv8 model once
model = YOLO('best.pt')

# 3) Accept both GET (to fetch + return an image) and HEAD (to just check availability)
@app.api_route("/update_stream/{camera_id}", methods=["GET", "HEAD"])
async def update_stream(request: Request, camera_id: str):
    # Validate camera ID
    if camera_id not in cameras:
        raise HTTPException(status_code=404, detail="Camera not found")

    # If it's just a HEAD, respond 200 OK without body
    if request.method == "HEAD":
        return Response(status_code=200)

    url = cameras[camera_id]

    # Fetch latest frame
    try:
        resp = requests.get(url, timeout=5)
        resp.raise_for_status()
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Could not fetch image: {e}")

    # Decode image
    arr = np.frombuffer(resp.content, dtype=np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if img is None:
        raise HTTPException(status_code=500, detail="Failed to decode image")

    # Run ML Model & annotate
    results = model(img)[0]
    annotated = results.plot()

    # If no detections, add a message
    if len(results.boxes) == 0:
        h, w = annotated.shape[:2]
        text = "No smoke/fire detected"
        font = cv2.FONT_HERSHEY_SIMPLEX
        scale, thick = 1.0, 2
        tw, th = cv2.getTextSize(text, font, scale, thick)[0]
        cv2.putText(
            annotated,
            text,
            ((w - tw) // 2, (h + th) // 2),
            font, scale, (0, 255, 0), thick
        )

    # Encode as JPEG
    success, buffer = cv2.imencode('.jpg', annotated)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to encode image")

    # Stream back to client
    return StreamingResponse(
        io.BytesIO(buffer.tobytes()),
        media_type="image/jpeg"
    )
