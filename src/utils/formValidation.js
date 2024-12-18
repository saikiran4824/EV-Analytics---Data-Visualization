export const validateForm = (formData) => {
    const errors = {};
  
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
  
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(formData.password)) {
      errors.password = 'Password must include at least one uppercase letter';
    } else if (!/[a-z]/.test(formData.password)) {
      errors.password = 'Password must include at least one lowercase letter';
    } else if (!/\d/.test(formData.password)) {
      errors.password = 'Password must include at least one number';
    } else if (!/[!@#$%^&*]/.test(formData.password)) {
      errors.password = 'Password must include at least one special character (!@#$%^&*)';
    }
  
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirm Password is required';
    } else if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = 'Passwords do not match';
    }
  
    if (!formData.username) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else if (!/^\w+$/.test(formData.username)) {
      errors.username = 'Username can only contain letters, numbers, and underscores';
    }
  
   
  
    return errors;
  };
  