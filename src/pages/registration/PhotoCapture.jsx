import React, { useRef, useState, useEffect } from 'react';
import { analyzeFaceImage } from '../../utils/faceDetection';
import CameraGuide from './CameraGuide';
import { useTranslation } from 'react-i18next';

const PhotoCapture = ({ onPhotoAccepted, photoError }) => {
  const [photoPreview, setPhotoPreview] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [showCameraGuide, setShowCameraGuide] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isWebcamMode, setIsWebcamMode] = useState(false);
  const [stream, setStream] = useState(null);
  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const imageRef = useRef(null);
  const videoRef = useRef(null);

  const { t } = useTranslation();


  useEffect(() => {
    // Detect device types
    const userAgent = navigator.userAgent;
    const isAndroidDevice = /Android/.test(userAgent);
    const isDesktopDevice = !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent));
    
    setIsAndroid(isAndroidDevice);
    setIsDesktop(isDesktopDevice);

    // Check camera permissions on Android
    if (isAndroidDevice && navigator.permissions) {
      navigator.permissions.query({ name: 'camera' }).then((result) => {
        // Permission state available if needed for future use
        console.log('Camera permission state:', result.state);
      });
    }
  }, []);

  // Cleanup webcam stream when component unmounts or mode changes
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      // Revoke any object URLs to prevent memory leaks
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [stream, photoPreview]);

  const startWebcam = async () => {
    try {
      const constraints = {
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false 
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraError(null);
    } catch (err) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError') {
        setCameraError('Camera permission denied. Please allow camera access and try again.');
      } else if (err.name === 'NotFoundError') {
        setCameraError('No camera found on this device.');
      } else if (err.name === 'NotReadableError') {
        setCameraError('Camera is already in use by another application.');
      } else {
        setCameraError('Unable to access camera. Please check your camera permissions.');
      }
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
        // Clear previous photo and revoke previous URL to prevent memory leaks
        if (photoPreview) {
          URL.revokeObjectURL(photoPreview);
        }
        
        // Clear previous analysis results
        setAnalysisResults(null);
        setCameraError(null);
        
        const imageUrl = URL.createObjectURL(blob);
        setPhotoPreview(imageUrl);
        stopWebcam();
        setIsWebcamMode(false);

        // Analyze the captured image
        const img = new Image();
        img.onload = async () => {
          setIsAnalyzing(true);
          try {
            const results = await analyzeFaceImage(img,t);
            setAnalysisResults(results);
            if (results.passed) {
              onPhotoAccepted(imageUrl, blob);
            }
          } catch (error) {
            console.error('Error analyzing image:', error);
            setCameraError('Error analyzing image. Please try again.');
          } finally {
            setIsAnalyzing(false);
          }
        };
        img.onerror = () => {
          setCameraError('Error loading captured image. Please try again.');
          setIsAnalyzing(false);
        };
        img.src = imageUrl;
      }, 'image/jpeg', 0.9);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setCameraError('Please select an image file');
        return;
      }

      // Clear previous photo and revoke previous URL to prevent memory leaks
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
      
      // Clear previous analysis results
      setAnalysisResults(null);
      setCameraError(null);
      
      const imageUrl = URL.createObjectURL(file);
      setPhotoPreview(imageUrl);

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
        } catch (error) {
          console.error('Error analyzing image:', error);
          setCameraError('Error analyzing image. Please try again.');
        } finally {
          setIsAnalyzing(false);
        }
      };
      img.onerror = () => {
        setCameraError('Error loading image. Please try again.');
        setIsAnalyzing(false);
      };
      img.src = imageUrl;
    }
  };

  const handleCaptureClick = () => {
    if (isDesktop) {
      setIsWebcamMode(true);
      startWebcam();
    } else {
      // For iOS, Android, and other mobile devices, use camera guide first
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
    // Revoke object URL to prevent memory leaks
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    
    // Clear all photo-related state
    setPhotoPreview(null);
    setAnalysisResults(null);
    setCameraError(null);
    setIsAnalyzing(false);
    
    // Clear file input value to ensure it can be reused
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (galleryInputRef.current) {
      galleryInputRef.current.value = '';
    }
    
    // Stop webcam if it's running
    if (stream) {
      stopWebcam();
    }
    
    // Reset webcam mode
    setIsWebcamMode(false);
  };

  const getButtonText = () => {
    if (isDesktop) return t('photo.button_webcam');
    return t('photo.button_webcam');
  };

  return (
    <div className="space-y-3">
      {cameraError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
          <div className="flex items-start space-x-2">
            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{cameraError}</span>
          </div>
        </div>
      )}

      {photoError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
          <div className="flex items-start space-x-2">
            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{photoError}</span>
          </div>
        </div>
      )}
      
      {showCameraGuide && (
        <CameraGuide
          onClose={() => setShowCameraGuide(false)}
          onStartCamera={handleStartCamera}
          isAndroid={isAndroid}
        />
      )}

      {isWebcamMode && (
        <div className="space-y-4">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none">
              <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-blue-500"></div>
              <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-blue-500"></div>
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-blue-500"></div>
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-blue-500"></div>
            </div>
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
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={captureWebcamPhoto}
              className="flex-1 px-4 py-2.5 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              <span>{t('photo.button_capture')}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                stopWebcam();
                setIsWebcamMode(false);
              }}
              className="px-4 py-2.5 rounded-lg bg-gray-500 text-white text-sm hover:bg-gray-600 transition-colors"
            >
              {t('photo.button_cancel')}
            </button>
          </div>
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
                <span className="text-blue-600">{t('photo.analyzing_photo')}</span>
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
                {t(analysisResults.message)}
              </h4>
              {analysisResults.details.length > 0 && (
                <ul className="list-disc list-inside space-y-1">
                  {analysisResults.details.map((detail, index) => (
                    <li key={index} className="text-sm text-yellow-700">
                      {t(detail)}
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
                    // Small delay to ensure cleanup is complete before starting new capture
                    setTimeout(() => {
                      handleCaptureClick();
                    }, 100);
                  }}
                  className="mt-3 w-full px-2 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600"
                >
                  {t('photo.retake')}
                </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : !isWebcamMode && (
        <div className={`space-y-2 ${photoError ? 'border-2 border-red-300 rounded-lg p-3 bg-red-50' : ''}`}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture={isAndroid ? "environment" : undefined}
            onChange={handleFileChange}
            className="hidden"
          />
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleCaptureClick}
            className={`w-full px-0 py-2.5 rounded-lg bg-gray-50 border border-gray-300 text-sm hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 ${photoError ? 'border-red-300 bg-red-50' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            <span>{getButtonText()}</span>
          </button>
          {(isDesktop || isAndroid) && !isWebcamMode && (
            <button
              type="button"
              onClick={() => {
                if (galleryInputRef.current) {
                  galleryInputRef.current.click();
                }
              }}
              className={`w-full px-0 py-2.5 rounded-lg bg-gray-50 border border-gray-300 text-sm hover:bg-gray-100 transition-colors flex items-center justify-center ${photoError ? 'border-red-300 bg-red-50' : ''}`}
            >
              {t('photo.button_gallery')}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PhotoCapture; 