export const registerUser = async (userData) => {
    try {
      // Simulate a mock API call (replace with real API integration)
      const response = await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Registration failed');
      return response.json();
    } catch (error) {
      console.error('Error:', error);
    }
  };
  