import * as faceapi from 'face-api.js';

export const loadFaceDetectionModels = async () => {
  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models')
    ]);
    return true;
  } catch (error) {
    console.error('Error loading face-api models:', error);
    return false;
  }
};

export const analyzeFaceImage = async (imageElement,t) => {
  try {
    const detections = await faceapi.detectAllFaces(
      imageElement,
      new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.5 })
    ).withFaceLandmarks().withFaceExpressions();

    if (detections.length === 0) {
      return {
        passed: false,
        message: 'photo.no_face_detected',
        details: []
      };
    }

    if (detections.length > 1) {
      return {
        passed: false,
        message: t('photo.multiple_faces_detected'),
        details: []
      };
    }

    const face = detections[0];
    const details = [];
    let passed = true;

    // Check for blur using detection confidence
    const detectionConfidence = face.detection.score;
    if (detectionConfidence < 0.7) {
      passed = false;
      details.push('photo.image_blurry');
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
      details.push('photo.image_blurry');
    }

    // Check face position
    const faceBox = face.detection.box;
    const imageWidth = imageElement.width;
    const imageHeight = imageElement.height;

    const faceCenterX = faceBox.x + faceBox.width / 2;
    const faceCenterY = faceBox.y + faceBox.height / 2;
    const centerThreshold = 0.2;

    const isCentered = 
      Math.abs(faceCenterX - imageWidth/2) < imageWidth * centerThreshold &&
      Math.abs(faceCenterY - imageHeight/2) < imageHeight * centerThreshold;

    if (!isCentered) {
      passed = false;
      details.push('photo.face_is_not_centered');
    }

    // Check face size
    const faceSize = (faceBox.width * faceBox.height) / (imageWidth * imageHeight);
    if (faceSize < 0.1) {
      passed = false;
      details.push('photo.face_too_small');
    }

    // Check face angle
    const eyeAngle = Math.abs(Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x) * 180 / Math.PI);
    if (eyeAngle > 15) {
      passed = false;
      details.push('photo.face_tilted');
    }

    // Check for sunglasses/glasses
    const leftEyeOpen = face.expressions.happy > 0.5 || face.expressions.neutral > 0.5;
    const rightEyeOpen = face.expressions.happy > 0.5 || face.expressions.neutral > 0.5;
    
    if (!leftEyeOpen || !rightEyeOpen) {
      passed = false;
      details.push('photo.eyes_not_visible');
    }

    // // Check expression
    // const isNeutral = face.expressions.neutral > 0.5;
    // if (!isNeutral) {
    //   passed = false;
    //   details.push("Please maintain a neutral expression");
    // }

    return {
      passed,
      message: passed ? 'photo.ok' : 'photo.adjustments_needed',
      details
    };

  } catch (error) {
    console.error('Error analyzing image:', error);
    return {
      passed: false,
      message: 'photo.error_try_again',
      details: []
    };
  }
}; 