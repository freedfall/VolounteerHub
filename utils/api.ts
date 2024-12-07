import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://itu-215076752298.europe-central2.run.app/api';

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
        const response = await fetch(`${BASE_URL}/event/attendance-confirm/` + eventId + '/' + userId, {
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
 * Update user details as Admin
 * @param {number} userId - User ID
 * @param {object} data - User data to update
 * @returns {Promise<boolean>} - Success status
 */
export const adminUpdateUserDetails = async (userId, data) => {
  try {
    console.log('DATA:', data);
    const response = await fetch(`${BASE_URL}/admin/user/${userId}`, { // Новая функция для обновления пользователя через /admin/user/{userId}
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
