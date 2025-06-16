import React, { useRef, useState, useEffect } from 'react';
import { analyzeFaceImage } from '../../utils/faceDetection';
import CameraGuide from './CameraGuide';

const PhotoCapture = ({ onPhotoAccepted }) => {
  const [photoPreview, setPhotoPreview] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [showCameraGuide, setShowCameraGuide] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isWebcamMode, setIsWebcamMode] = useState(false);
  const [stream, setStream] = useState(null);
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    // Detect iOS devices
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);
    
    // Detect desktop devices (not mobile)
    const isDesktopDevice = !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    setIsDesktop(isDesktopDevice);
  }, []);

  // Cleanup webcam stream when component unmounts or mode changes
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startWebcam = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: false 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraError(null);
    } catch (err) {
      setCameraError('Unable to access webcam. Please check your camera permissions.');
      setIsWebcamMode(false);
    }
  };

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const captureWebcamPhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);
      
      canvas.toBlob(async (blob) => {
        const imageUrl = URL.createObjectURL(blob);
        setPhotoPreview(imageUrl);
        stopWebcam();
        setIsWebcamMode(false);

        // Analyze the captured image
        const img = new Image();
        img.onload = async () => {
          setIsAnalyzing(true);
          try {
            const results = await analyzeFaceImage(img);
            setAnalysisResults(results);
            if (results.passed) {
              onPhotoAccepted(imageUrl, blob);
            }
          } finally {
            setIsAnalyzing(false);
          }
        };
        img.src = imageUrl;
      }, 'image/jpeg');
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setCameraError('Please select an image file');
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setPhotoPreview(imageUrl);
      setCameraError(null);
      setAnalysisResults(null);

      // Wait for image to load
      const img = new Image();
      img.onload = async () => {
        setIsAnalyzing(true);
        try {
          const results = await analyzeFaceImage(img);
          setAnalysisResults(results);
          if (results.passed) {
            onPhotoAccepted(imageUrl, file);
          }
        } finally {
          setIsAnalyzing(false);
        }
      };
      img.src = imageUrl;
    }
  };

  const handleCaptureClick = () => {
    if (isDesktop) {
      setIsWebcamMode(true);
      startWebcam();
    } else {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setShowCameraGuide(true);
    }
  };

  const handleStartCamera = () => {
    setShowCameraGuide(false);
    setTimeout(() => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }, 100);
  };

  const clearPhoto = () => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview(null);
    setAnalysisResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      {cameraError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
          {cameraError}
        </div>
      )}
      
      {showCameraGuide && (
        <CameraGuide
          onClose={() => setShowCameraGuide(false)}
          onStartCamera={handleStartCamera}
        />
      )}

      {isWebcamMode && (
        <div className="space-y-4">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => {
                stopWebcam();
                setIsWebcamMode(false);
              }}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
            >
              ×
            </button>
          </div>
          <button
            type="button"
            onClick={captureWebcamPhoto}
            className="w-full px-4 py-2.5 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600 transition-colors"
          >
            Capture Photo
          </button>
        </div>
      )}

      {photoPreview ? (
        <div className="space-y-4">
          <div className="relative">
            <img 
              ref={imageRef}
              src={photoPreview} 
              alt="Preview" 
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={clearPhoto}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
            >
              ×
            </button>
          </div>
          
          {isAnalyzing ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="text-blue-600">Analyzing photo...</span>
              </div>
            </div>
          ) : analysisResults && (
            <div className={`rounded-lg p-4 ${
              analysisResults.passed 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <h4 className={`font-medium mb-2 ${
                analysisResults.passed ? 'text-green-700' : 'text-yellow-700'
              }`}>
                {analysisResults.message}
              </h4>
              {analysisResults.details.length > 0 && (
                <ul className="list-disc list-inside space-y-1">
                  {analysisResults.details.map((detail, index) => (
                    <li key={index} className="text-sm text-yellow-700">
                      {detail}
                    </li>
                  ))}
                </ul>
              )}
              {!analysisResults.passed && (
                <div className='flex justify-center'>
                <button
                  type="button"
                  onClick={() => {
                    clearPhoto();
                    handleCaptureClick();
                  }}
                  className="mt-3 w-full px-2 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600"
                >
                  Retake Photo
                </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : !isWebcamMode && (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleCaptureClick}
            className="w-full px-0 py-2.5 rounded-lg bg-gray-50 border border-gray-300 text-sm hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            <span>{isDesktop ? 'Take Photo with Webcam' : 'Take Photo or Choose from Gallery'}</span>
          </button>
          {isDesktop && !isWebcamMode && (
            <button
              type="button"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.click();
                }
              }}
              className="w-full px-0 py-2.5 rounded-lg bg-gray-50 border border-gray-300 text-sm hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              Choose from Gallery
            </button>
          )}
          {isIOS}
        </div>
      )}
    </div>
  );
};

export default PhotoCapture; 