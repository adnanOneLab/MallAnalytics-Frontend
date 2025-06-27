import * as faceapi from 'face-api.js';

let modelsLoaded = false;

export const loadFaceDetectionModels = async () => {
  if (modelsLoaded) return true;

  try {
    console.log('Loading face-api models...');
    
    // Get the base URL for models - works for both dev and production
    const getModelPath = () => {
      // In production, models are in the public directory served by Amplify
      // In development, they're also in public directory served by Vite
      const baseUrl = import.meta.env.DEV ? 'http://localhost:5173' : window.location.origin;
      return `${baseUrl}/models`;
    };

    const modelPath = getModelPath();
    console.log('Loading models from:', modelPath);

    // Test model availability before loading
    try {
      const testResponse = await fetch(`${modelPath}/tiny_face_detector_model-weights_manifest.json`);
      if (!testResponse.ok) {
        throw new Error(`Models not accessible at ${modelPath}. Status: ${testResponse.status}`);
      }
      console.log('Models accessible, proceeding with loading...');
    } catch (fetchError) {
      console.error('Model accessibility test failed:', fetchError);
      throw new Error(`Cannot access face detection models. Please ensure models are properly deployed.`);
    }

    // Load all required models
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(modelPath),
      faceapi.nets.faceLandmark68Net.loadFromUri(modelPath),
      faceapi.nets.faceRecognitionNet.loadFromUri(modelPath),
      faceapi.nets.faceExpressionNet.loadFromUri(modelPath)
    ]);

    modelsLoaded = true;
    console.log('Face-api models loaded successfully!');
    return true;
  } catch (error) {
    console.error('Error loading face-api models:', error);
    modelsLoaded = false;
    
    // Provide helpful error messages based on the error type
    if (error.message.includes('fetch')) {
      throw new Error('Failed to download face detection models. Please check your internet connection.');
    } else if (error.message.includes('TinyYolov2')) {
      throw new Error('Face detection model compatibility issue. Please try refreshing the page.');
    } else if (error.message.includes('tensor should have')) {
      throw new Error('Face detection model files appear to be corrupted. Please contact support.');
    } else {
      throw new Error(`Face detection initialization failed: ${error.message}`);
    }
  }
};

export const analyzeFaceImage = async (imageElement) => {
  try {
    // Ensure models are loaded
    if (!modelsLoaded) {
      console.log('Models not loaded, attempting to load...');
      await loadFaceDetectionModels();
    }

    console.log('Starting face detection...');
    const detections = await faceapi.detectAllFaces(
      imageElement,
      new faceapi.TinyFaceDetectorOptions({ 
        inputSize: 416, 
        scoreThreshold: 0.5 
      })
    ).withFaceLandmarks().withFaceExpressions();

    console.log(`Detected ${detections.length} face(s)`);

    if (detections.length === 0) {
      return {
        passed: false,
        message: "No face detected in the image",
        details: ["Make sure your face is clearly visible", "Ensure good lighting", "Remove any face coverings"]
      };
    }

    if (detections.length > 1) {
      return {
        passed: false,
        message: "Multiple faces detected. Please take a photo with only one face.",
        details: ["Ensure only your face is in the frame", "Remove other people from the background"]
      };
    }

    const face = detections[0];
    const details = [];
    let passed = true;

    // Check for blur using detection confidence
    const detectionConfidence = face.detection.score;
    console.log('Detection confidence:', detectionConfidence);
    
    if (detectionConfidence < 0.7) {
      passed = false;
      details.push("Image appears blurry. Please take a clearer photo");
    }

    // Additional blur check using landmark positions
    const landmarks = face.landmarks.positions;
    const leftEye = landmarks[36];
    const rightEye = landmarks[45];
    const nose = landmarks[30];
    
    const leftEyeToNose = Math.hypot(nose.x - leftEye.x, nose.y - leftEye.y);
    const rightEyeToNose = Math.hypot(nose.x - rightEye.x, nose.y - rightEye.y);
    
    const distanceRatio = Math.max(leftEyeToNose, rightEyeToNose) / Math.min(leftEyeToNose, rightEyeToNose);
    if (distanceRatio > 1.2) {
      passed = false;
      details.push("Image appears blurry or face is at an angle. Please take a clearer, straight-on photo");
    }

    // Check face position
    const faceBox = face.detection.box;
    const imageWidth = imageElement.width;
    const imageHeight = imageElement.height;

    const faceCenterX = faceBox.x + faceBox.width / 2;
    const faceCenterY = faceBox.y + faceBox.height / 2;
    const centerThreshold = 0.25; // Slightly more lenient

    const isCentered = 
      Math.abs(faceCenterX - imageWidth/2) < imageWidth * centerThreshold &&
      Math.abs(faceCenterY - imageHeight/2) < imageHeight * centerThreshold;

    if (!isCentered) {
      passed = false;
      details.push("Face is not centered in the frame");
    }

    // Check face size
    const faceSize = (faceBox.width * faceBox.height) / (imageWidth * imageHeight);
    console.log('Face size ratio:', faceSize);
    
    if (faceSize < 0.08) { // More lenient threshold
      passed = false;
      details.push("Face is too small in the frame. Please move closer to the camera");
    } else if (faceSize > 0.8) {
      passed = false;
      details.push("Face is too close to the camera. Please move back slightly");
    }

    // Check face angle
    const eyeAngle = Math.abs(Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x) * 180 / Math.PI);
    console.log('Face angle:', eyeAngle);
    
    if (eyeAngle > 15) {
      passed = false;
      details.push("Face is tilted. Please keep your head straight");
    }

    console.log('Analysis complete:', { passed, detectionConfidence, faceSize, eyeAngle });

    return {
      passed,
      message: passed ? "Photo meets all requirements!" : "Photo needs adjustments",
      details: passed ? ["Great photo! All quality checks passed."] : details
    };

  } catch (error) {
    console.error('Error analyzing image:', error);
    
    // Handle specific error types
    if (error.message.includes('Models not loaded') || error.message.includes('TinyYolov2')) {
      return {
        passed: false,
        message: "Face detection system is initializing. Please try again in a moment.",
        details: ["The face detection models are still loading", "Please wait a few seconds and try again"]
      };
    }
    
    return {
      passed: false,
      message: "Error analyzing image. Please try again.",
      details: ["There was a technical issue analyzing your photo", "Please try taking another photo"]
    };
  }
}; 