import api from './api';

export const registerUser = async (userData, photoFile) => {
  try {
    // Validate photo file
    if (!photoFile) {
      throw new Error('No photo file provided');
    }

    if (photoFile.size > 5 * 1024 * 1024) { // 5MB limit
      throw new Error('Photo file is too large. Maximum size is 5MB.');
    }

    // First, upload the photo
    const photoFormData = new FormData();
    photoFormData.append('photo', photoFile);
    
    // Add user data to the form data for validation
    Object.keys(userData).forEach(key => {
      if (userData[key] !== null && userData[key] !== undefined) {
        photoFormData.append(key, userData[key]);
      }
    });

    console.log('Starting photo upload...', {
      fileName: photoFile.name,
      fileSize: `${(photoFile.size / 1024 / 1024).toFixed(2)}MB`,
      fileType: photoFile.type
    });

    let photoResponse;
    try {
      photoResponse = await api.post('/upload-photo/', photoFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload progress: ${percentCompleted}%`);
        },
      });

      console.log('Photo uploaded successfully:', photoResponse.data);

      if (!photoResponse.data.photo_url) {
        throw new Error('Server did not return a photo URL');
      }
    } catch (photoError) {
      console.error('Photo upload error:', photoError);
      
      // Handle photo upload specific errors
      if (photoError.response?.status === 400) {
        const errorData = photoError.response.data;
        
        // For validation errors, preserve the original error structure
        if (errorData.email || errorData.name || errorData.date_of_birth || 
            errorData.cell_phone || errorData.address || errorData.picture_url) {
          // Re-throw the original error to preserve the response structure
          throw photoError;
        }
        
        // Handle other specific errors
        if (errorData.detail) {
          throw new Error(errorData.detail);
        }
        if (errorData.message) {
          throw new Error(errorData.message);
        }
        
        throw new Error('Photo upload failed. Please check your information and try again.');
      }
      
      // Re-throw the error to be handled by the main catch block
      throw photoError;
    }

    // Then, register the user with the photo URL
    const userRegistrationData = {
      ...userData,
      picture_url: photoResponse.data.photo_url,
      face_id:photoResponse.data.face_id,
    };

    // Remove interests from user data as we'll handle them separately
    const { interests, ...userDataWithoutInterests } = userRegistrationData;

    console.log('Registering user with data:', {
      ...userDataWithoutInterests,
      picture_url: 'URL received from server' // Don't log the actual URL
    });

    const userResponse = await api.post('/users-create/', userDataWithoutInterests);
    console.log('User registered successfully:', userResponse.data);

    // Create user interests if any were selected
    if (interests && interests.length > 0) {
      const user_id = userResponse.data.user_id;
      console.log('Creating user interests:', interests);

      // Get all available interests from the backend
      const interestsResponse = await api.get('/interests/');
      const availableInterests = interestsResponse.data;

      // Link selected interests to the user
      for (const interestName of interests) {
        try {
          const existingInterest = availableInterests.find(i => i.name === interestName);
          if (existingInterest) {
            await api.post('/user-interests/', {
              user_id,
              interest_id: existingInterest.interest_id,
              source: 'registration'
            });
          } else {
            console.warn(`Interest "${interestName}" not found in available interests`);
          }
        } catch (error) {
          console.error('Error linking user interest:', error);
          // Continue with other interests even if one fails
        }
      }
    }

    return userResponse.data;
  } catch (error) {
    console.error('Registration error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });

    // Handle specific error cases
    if (error.message.includes('Network Error')) {
      throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
    }

    if (error.response?.status === 413) {
      throw new Error('The photo file is too large. Please choose a smaller image (maximum 5MB).');
    }

    if (error.response?.status === 504) {
      throw new Error('The server took too long to respond. Please try again.');
    }

    if (error.response?.status === 400) {
      const errorData = error.response.data;
      
      // Handle validation errors
      if (errorData.name) {
        throw new Error(`Name error: ${errorData.name.join(', ')}`);
      }
      if (errorData.email) {
        throw new Error(`Email error: ${errorData.email.join(', ')}`);
      }
      if (errorData.date_of_birth) {
        throw new Error(`Date of birth error: ${errorData.date_of_birth.join(', ')}`);
      }
      if (errorData.cell_phone) {
        throw new Error(`Phone number error: ${errorData.cell_phone.join(', ')}`);
      }
      if (errorData.address) {
        throw new Error(`Address error: ${errorData.address.join(', ')}`);
      }
      if (errorData.picture_url) {
        throw new Error(`Photo error: ${errorData.picture_url.join(', ')}`);
      }
      
      // Handle general 400 errors
      if (errorData.detail) {
        throw new Error(errorData.detail);
      }
      if (errorData.message) {
        throw new Error(errorData.message);
      }
      
      throw new Error('Please check your information and try again.');
    }

    if (error.response?.status === 409) {
      throw new Error('A user with this email already exists. Please use a different email address.');
    }

    if (error.response?.status === 422) {
      throw new Error('The provided data is invalid. Please check your information and try again.');
    }

    if (error.response?.status === 500) {
      throw new Error('Server error occurred. Please try again later or contact support.');
    }

    if (error.response?.status === 503) {
      throw new Error('Service temporarily unavailable. Please try again later.');
    }

    // Handle photo upload specific errors
    if (error.message.includes('photo')) {
      if (error.message.includes('size')) {
        throw new Error('Photo file is too large. Please choose an image smaller than 5MB.');
      }
      if (error.message.includes('format') || error.message.includes('type')) {
        throw new Error('Invalid photo format. Please use JPG, PNG, or GIF images.');
      }
      throw new Error('Photo upload failed. Please try again.');
    }

    // Handle interest-related errors
    if (error.message.includes('interest')) {
      throw new Error('There was an issue saving your interests. Your account was created but interests may not be saved.');
    }

    // Throw the error with a user-friendly message
    throw new Error(
      error.response?.data?.detail || 
      error.response?.data?.message || 
      error.message || 
      'Registration failed. Please try again.'
    );
  }
}; 