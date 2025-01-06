import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://itu-215076752298.europe-central2.run.app/api';

export const getUser = async () => {
    try {
      const response = await fetch('https://itu-215076752298.europe-central2.run.app/api/user/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`,
        },
      });

     return response;
    } catch (error) {
      console.error('Network error when finding user data:', error);
    }
};

export const signInUser = async (email, password) => {
    try {
      const response = await fetch('https://itu-215076752298.europe-central2.run.app/auth/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      return response;
    } catch (error) {
      console.error('Authorization error:', error);
    }
};

export const registerUser = async (name: string, surname: string, email: string, password: string) => {
    try {
      const response = await fetch('https://itu-215076752298.europe-central2.run.app/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, surname, email, password }),
      });

      return response;
    } catch (error) {
      console.error('Ошибка сети при регистрации:', error);
    }
};
/**
 * Fetch all future events
 * @returns {Promise<Array>} - Array of events
 */
export const fetchEvents = async () => {
  try {
    const response = await fetch(`${BASE_URL}/event/future `, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`,
      },
    });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};

/**
 * Fetch all events
 * @returns {Promise<Array>} - Array of events
 */
export const fetchAllEvents = async () => {
  try {
    const response = await fetch(`${BASE_URL}/event`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};

/**
 * Fetch all users
 * @returns {Promise<Array>} - Array of users
 */
export const fetchAllUsers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/user `, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

/**
 * Get all registered users for an event
 * @param {string} eventId - Event ID
 * @returns {Promise<Array>} - Array of registered users
 */
export const fetchParticipants = async (eventId) => {
  try {
    const response = await fetch(`${BASE_URL}/event/users-registered/${eventId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`,
      },
    });
    if (!response.ok) throw new Error('Failed to load participants');

    return await response.json();
  } catch (error) {
    console.error('Error fetching participants:', error);
    throw error;
  }
};

/**
 * Register user for an event
 * @param {string} eventId - Event ID
 * @returns {Promise<Response>} - Request result
 */
export const registerUserForEvent = async (eventId) => {
  try {
    const response = await fetch(`${BASE_URL}/event/register/` + eventId, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`,
      },
    });
    if (!response.ok) throw new Error('Failed to register for event');

    return response;
  } catch (error) {
    console.error('Error registering for event:', error);
    throw error;
  }
};

/**
 * Cancel user registration for an event
 * @param {string} eventId - Event ID
 * @param {string} userId - User ID
 * @returns {Promise<Response>} - Request result
 */
export const cancelUserRegistration = async (eventId, userId) => {
  try {
    const response = await fetch(`${BASE_URL}/event/delete-user`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`,
      },
      body: JSON.stringify({ eventId, userId }),
    });
    if (!response.ok) throw new Error('Failed to cancel registration');

    return response;
  } catch (error) {
    console.error('Error canceling registration:', error);
    throw error;
  }
};

/**
 * Get all events created by the user
    * @returns {Promise<Array>} - Array of events
 */
export const fetchUserCreatedEvents = async () => {
    try {
        const response = await fetch(`${BASE_URL}/event/my-as-creator`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`,
        },
        });
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching user created events:', error);
    }
};

/**
 * Get all events created by the user
    * @returns {Promise<Array>} - Array of events
 */
export const fetchUserParticipationEvents = async () => {
    try {
        const response = await fetch(`${BASE_URL}/event/my-as-participant`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`,
        },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user participation events:', error);
    }
};

/**
 * Confirm user registration for an event
 * @returns {Promise<Object>} - User data
 */
 export const confirmUserRegistration = async (eventId, userId) => {
    try {
        const response = await fetch(`${BASE_URL}/event/status-confirm/` + eventId + '/' + userId, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`,
        },
        });


    } catch (error) {
        console.error('Error confirming registration:', error);
    }
};

/**
 * Reject user registration for an event
 * @returns {Promise<Object>} - User data
 */
export const rejectUserRegistration = async (eventId, userId) => {
    try {
        const response = await fetch(`${BASE_URL}/event/status-reject/` + eventId + '/' + userId, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`,
        },
        });
    }
    catch (error) {
        console.error('Error rejecting registration:', error);
    }
};

/**
 * Confirm user attendance for an event
 */
export const confirmUserAttendance = async (eventId, userId) => {
    try {
        const response = await fetch(`${BASE_URL}/event/status-attended/` + eventId + '/' + userId, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`,
        },
        });
    }
    catch (error) {
        console.error('Error confirming attendance:', error);
    }
}

/**
 * Delete event
 */
export const deleteEvent = async (eventId) => {
    try {
        const response = await fetch(`${BASE_URL}/event/` + eventId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`,
        },
        });
    }
    catch (error) {
        console.error('Error deleting event:', error);
    }
};

/**
 * Delete event
 */
export const adminDeleteEvent = async (eventId) => {
    try {
        const response = await fetch(`${BASE_URL}/admin/event/` + eventId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`,
        },
        });
    }
    catch (error) {
        console.error('Error deleting event:', error);
    }
};

/**
 * Update event details
 */
export const updateEventDetails = async (eventId, data) => {
    try {
        console.log('DATA:', data);
        const response = await fetch(`${BASE_URL}/event/` + eventId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`,
        },
        body: JSON.stringify(data),
        });
    }
    catch (error) {
        console.error('Error updating event:', error);
    }
};

/**
 * Update event details
 */
export const adminUpdateEventDetails = async (eventId, data) => {
    try {
        console.log('DATA:', data);
        const response = await fetch(`${BASE_URL}/admin/event/` + eventId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`,
        },
        body: JSON.stringify(data),
        });
    }
    catch (error) {
        console.error('Error updating event:', error);
    }
};

/**
 * Get all events attended by the user
 * @param {number} userId - User ID
 * @returns {Promise<Array>} - Array of attended events
 */
export const fetchUserAttendedEvents = async (userId) => { // Добавлен параметр userId
  try {
    const response = await fetch(`${BASE_URL}/admin/user/attended-events/${userId}`, { // Изменено на /admin/user/attended-events/{userId}
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch user attended events');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user attended events:', error);
    throw error;
  }
};

/**
 * Get all events created by the user
 * @param {number} userId - User ID
 * @returns {Promise<Array>} - Array of created events
 */
export const fetchAdminUserCreatedEvents = async (userId) => { // Добавлен параметр userId
  try {
    const response = await fetch(`${BASE_URL}/admin/user/created-events/${userId}`, { // Изменено на /admin/user/created-events/{userId}
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch user created events');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user created events:', error);
    throw error;
  }
};

/**
 * Update user details as User
 * @param {number} userId - User ID
 * @param {object} data - User data to update
 * @returns {Promise<boolean>} - Success status
 */
export const updateUserDetails = async (userId, data) => {
  try {
    console.log('DATA:', data);
    const response = await fetch(`${BASE_URL}/user/${userId}/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error updating user details:', errorData);
      Alert.alert('Ошибка', errorData.message || 'Не удалось обновить данные пользователя.');
      return false;
    }
  } catch (error) {
    console.error('Error updating user details:', error);
  }
};

/**
 * Upload user profile image
 * @param {number} userId - User ID
 * @param {object} image - Image file with properties: uri, name, type
 * @returns {Promise<boolean>} - Success status
 */
export const uploadUserProfileImage = async (userId, image) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const formData = new FormData();
    formData.append('image', {
      uri: image.uri,
      name: image.name || 'profile.jpg',
      type: image.type || 'image/jpeg',
    });

    const response = await fetch(`${BASE_URL}/user/${userId}/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    console.log(response);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error uploading image:', errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Network error:', error);
    return false;
  }
};

/**
 * Update user details as Admin
 * @param {number} userId - User ID
 * @param {object} data - User data to update
 * @returns {Promise<boolean>} - Success status
 */
export const adminUpdateUserDetails = async (userId, data) => {
  try {
    console.log('DATA:', data);
    const response = await fetch(`${BASE_URL}/admin/user/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`,
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error('Error updating user details:', error);
  }
};

/**
 * Create new feedback
 * @param {number} eventId - Event ID
 * @param {string} text - Feedback text
 * @param {number} rating - Feedback rating
 * @returns {Promise<boolean>} - Success status
 */
export const createFeedback = async (eventId, text, rating) => {
  try {
    console.log(JSON.stringify({ eventId, text, rating }));
    const response = await fetch(`${BASE_URL}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`,
      },
      body: JSON.stringify({ eventId, text, rating }),
    });
    console.log('Feedback:', response);
  } catch (error) {
    console.error('Error creating feedback:', error);
  }
};

/**
 * Fetch all user's feedbacks for an event
 * @param {number} eventId - Event ID
 * @returns {Promise<Array>} - Array of feedbacks
 */
export const fetchUserFeedbacksForEvent = async (eventId) => {
  try {
    const response = await fetch(`${BASE_URL}/feedback/my/${eventId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`,
        },
    });
    const data = await response.json();
    console.log(data);
    return data;
    } catch (error) {
    console.error('Error fetching feedbacks:', error);
    }
};

/**
 * Delete feedback
 * @param {string} feedbackId - Feedback ID
 * @returns {Promise<Response>} - Request result
 */
export const deleteFeedback = async (feedbackId) => {
  try {
    const response = await fetch(`${BASE_URL}/feedback/` + feedbackId, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`,
      },
    });
    console.log('Feedback:', response);
    if (!response.ok) throw new Error('Failed to delete feedback');

    return response;
  } catch (error) {
    console.error('Error deleting feedback:', error);
    throw error;
  }
};

/**
 * Update feedback
 * @param {string} feedbackId - Feedback ID
 * @param {number} eventId - Event ID
 * @param {string} text - Feedback text
 * @param {number} rating - Feedback rating
 * @returns {Promise<Response>} - Request result
 */
 export const updateFeedback = async (feedbackId, eventId, text, rating) => {
    console.log(JSON.stringify({ eventId, text, rating }));
    try {

      const response = await fetch(`${BASE_URL}/feedback/` + feedbackId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`,
        },
        body: JSON.stringify({ eventId, text, rating }),
        });
        console.log('Feedback:', response);
        if (!response.ok) throw new Error('Failed to update feedback');
        return response;
    } catch (error) {
        console.error('Error updating feedback:', error);
        throw error;
    }
};

export const fetchFeedbacksForCreator = async (targetId) => {
    try {
        const response = await fetch(`${BASE_URL}/feedback/target/${targetId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`,
        },
        });
        console.log('Feedback:', response);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
    }
};
/**
 * Get all messages sent by the user senderId to the recipient recipientId
 * @param {number} senderId - sender ID
 * @param {number} recipientId - recipient ID
 * @returns {Promise<Array>} Message array
 */
export const fetchSentMessages = async (senderId, recipientId) => {
  const token = await AsyncStorage.getItem('userToken');
  const response = await fetch(`${BASE_URL}/message/${senderId}/${recipientId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch sent messages');
  }
  return await response.json();
};

/**
 * Get all messages sent by the recipientId user to the current senderId user
 * @param {number} senderId - sender ID (current user)
 * @param {number} recipientId - recipient ID (another user)
 * @returns {Promise<Array>} Message array
 */
export const fetchReceivedMessages = async (senderId, recipientId) => {
  const token = await AsyncStorage.getItem('userToken');
  const response = await fetch(`${BASE_URL}/message/${recipientId}/${senderId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch received messages');
  }
  return await response.json();
};

/**
 * Send a new message from senderId to recipientId
 * @param {number} senderId - Sender ID (current user)
 * @param {number} recipientId - recipient ID
 * @param {string} content - Message Text
 */
export const sendMessageApi = async (senderId, recipientId, content) => {
  const token = await AsyncStorage.getItem('userToken');
  const response = await fetch(`${BASE_URL}/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      senderId: senderId,
      recipientId: recipientId,
      content: content.trim(),
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }
};

/**
 * Mark a message as read by its ID.
 * @param {number} messageId - The ID of the message to mark as read.
 * @returns {Promise<void>}
 */
export const markMessageAsReadApi = async (messageId) => {
  const token = await AsyncStorage.getItem('userToken');
  const response = await fetch(`${BASE_URL}/message/${messageId}/read`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to mark message as read');
  }
};

/**
 * Fetch all message writers (users who have sent messages to the current user).
 * @returns {Promise<Array>} - Array of UserInfo objects.
 */
export const fetchMessageWriters = async () => {
  const token = await AsyncStorage.getItem('userToken');
  const response = await fetch(`${BASE_URL}/message/writers`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch message writers');
  }

  return await response.json();
};

export const deleteUserFromEvent = async (eventId, userId) => {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${BASE_URL}/event/delete-user`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
              userId: userId,
              eventId: eventId,
            }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete user from event');
        console.log(response)
      }

      return response;
}