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

    console.log('Starting photo upload...', {
      fileName: photoFile.name,
      fileSize: `${(photoFile.size / 1024 / 1024).toFixed(2)}MB`,
      fileType: photoFile.type
    });

    const photoResponse = await api.post('/upload-photo-local/', photoFormData, {
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

    // Then, register the user with the photo URL
    const userRegistrationData = {
      ...userData,
      picture_url: photoResponse.data.photo_url,
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
      throw new Error('The photo file is too large. Please choose a smaller image.');
    }

    if (error.response?.status === 504) {
      throw new Error('The server took too long to respond. Please try again.');
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