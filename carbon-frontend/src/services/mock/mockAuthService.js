import { mockUsers, delay } from './mockData';
import mockDatabase from './mockDatabaseService';

export const mockAuthService = {
  login: async (credentials) => {
    await delay(800);
    
    // Simulate login
    const { email, role, password } = credentials;
    
    if (!email || !password) {
      const error = new Error('Email and password are required');
      error.response = {
        status: 400,
        data: { message: 'Email and password are required' }
      };
      throw error;
    }
    
    // Try to find user in mock database first (for newly registered users)
    let user = mockDatabase.findUserByEmail(email);
    
    // If not found in database, use mock users (for default test accounts)
    if (!user) {
      if (role) {
        // Use explicit role if provided
        user = mockUsers[role] || mockUsers.EV_OWNER;
      } else if (email) {
        // Or infer from email
        if (email.includes('buyer')) user = mockUsers.BUYER;
        else if (email.includes('verifier')) user = mockUsers.VERIFIER;
        else if (email.includes('admin')) user = mockUsers.ADMIN;
        else user = mockUsers.EV_OWNER;
      } else {
        user = mockUsers.EV_OWNER;
      }
    }
    
    // Validate password
    // For users in mock database, check stored password
    // For default mock users, default password is 'password'
    const storedPassword = user.password || 'password';
    
    if (password !== storedPassword) {
      const error = new Error('Invalid email or password');
      error.response = {
        status: 401,
        data: { message: 'Invalid email or password' }
      };
      throw error;
    }
    
    // Store password for mock password change validation
    localStorage.setItem('mockCurrentPassword', password);
    // Store user email to retrieve user later in getProfile
    localStorage.setItem('mockUserEmail', email);
    
    // Map database fields to frontend expected format
    // Database has: full_name, phone_number, roles
    // Frontend expects: name, phone, roles
    const mappedUser = {
      ...user,
      name: user.full_name || user.name || 'User', // Map full_name to name
      phone: user.phone_number || user.phone, // Map phone_number to phone
      email: user.email,
      id: user.id,
      roles: user.roles || user.role, // Ensure roles field exists (plural)
      // Keep original fields for backward compatibility
      full_name: user.full_name,
      phone_number: user.phone_number,
    };
    
    // Return format compatible with both backend and frontend expectations
    return {
      id: mappedUser.id,
      token: 'dev-mock-token', // Use consistent token for dev mode
      refreshToken: 'dev-mock-refresh-token',
      username: mappedUser.email,
      role: mappedUser.roles || mappedUser.role, // Map roles to role for compatibility
      user: mappedUser, // Keep user object for backward compatibility
      // Also include role at root level for easier access
      ...(mappedUser.roles && { role: mappedUser.roles }),
    };
  },

  register: async (userData) => {
    await delay(1000);
    
    // Check if email already exists (should be checked in frontend, but double-check here)
    const existingUser = mockDatabase.findUserByEmail(userData.email);
    if (existingUser) {
      const error = new Error('Email already exists');
      error.response = {
        status: 409, // Conflict status code
        data: { message: 'Email already exists' }
      };
      throw error;
    }
    
    return {
      token: `mock-token-new-${Date.now()}`,
      user: {
        id: String(Date.now()),
        ...userData,
        role: userData.role || 'EV_OWNER',
      },
    };
  },

  logout: async () => {
    await delay(300);
    return { success: true };
  },

  getProfile: async () => {
    await delay(500);
    
    // Try to get user from database using stored email
    const storedEmail = localStorage.getItem('mockUserEmail');
    let user = null;
    
    if (storedEmail) {
      // Find user in database by email
      user = mockDatabase.findUserByEmail(storedEmail);
    }
    
    // If not found in database, use default mock users based on route
    if (!user) {
      const token = localStorage.getItem('authToken');
      let roleKey = 'EV_OWNER';
      
      if (token) {
        if (token.includes('buyer') || window.location.pathname.includes('/buyer')) {
          roleKey = 'BUYER';
        } else if (token.includes('verifier') || window.location.pathname.includes('/verifier')) {
          roleKey = 'VERIFIER';
        } else if (token.includes('admin') || window.location.pathname.includes('/admin')) {
          roleKey = 'ADMIN';
        }
      }
      
      user = mockUsers[roleKey] || mockUsers.EV_OWNER;
    }
    
    // Map database fields to frontend expected format
    const mappedUser = {
      ...user,
      name: user.full_name || user.name || 'User',
      phone: user.phone_number || user.phone,
      email: user.email,
      id: user.id,
      roles: user.roles || user.role,
      // Keep original fields for backward compatibility
      full_name: user.full_name,
      phone_number: user.phone_number,
    };
    
    return mappedUser;
  },

  refreshToken: async () => {
    await delay(300);
    return {
      token: `mock-refresh-token-${Date.now()}`,
    };
  },

  changePassword: async (oldPassword, newPassword, confirmPassword) => {
    await delay(1000);
    
    // Get current user email from localStorage
    const storedEmail = localStorage.getItem('mockUserEmail');
    if (!storedEmail) {
      const error = new Error('User not found');
      error.response = {
        status: 404,
        data: { message: 'User not found' }
      };
      throw error;
    }
    
    // Find user in database
    const user = mockDatabase.findUserByEmail(storedEmail);
    if (!user) {
      const error = new Error('User not found');
      error.response = {
        status: 404,
        data: { message: 'User not found' }
      };
      throw error;
    }
    
    // Validate old password against database
    const storedPassword = user.password || localStorage.getItem('mockCurrentPassword') || 'password';
    if (oldPassword !== storedPassword) {
      const error = new Error('Invalid old password');
      error.response = {
        status: 401,
        data: { message: 'Invalid old password' }
      };
      throw error;
    }
    
    // Validate new password matches confirm
    if (newPassword !== confirmPassword) {
      const error = new Error('New password and confirm password do not match');
      error.response = {
        status: 400,
        data: { message: 'New password and confirm password do not match' }
      };
      throw error;
    }
    
    // Update password in database
    mockDatabase.updateUser(user.id, {
      password: newPassword
    });
    
    // Also save new password to localStorage for backward compatibility
    localStorage.setItem('mockCurrentPassword', newPassword);
    
    return {
      success: true,
      message: 'Password changed successfully'
    };
  },

  updateProfile: async (profileData) => {
    await delay(800);
    
    // Get current user email from localStorage
    const storedEmail = localStorage.getItem('mockUserEmail');
    if (!storedEmail) {
      const error = new Error('User not found');
      error.response = {
        status: 404,
        data: { message: 'User not found' }
      };
      throw error;
    }
    
    // Find user in database
    const user = mockDatabase.findUserByEmail(storedEmail);
    if (!user) {
      const error = new Error('User not found');
      error.response = {
        status: 404,
        data: { message: 'User not found' }
      };
      throw error;
    }
    
    // Check if email is being changed and if it already exists
    if (profileData.email && profileData.email !== user.email) {
      const existingUser = mockDatabase.findUserByEmail(profileData.email);
      if (existingUser && existingUser.id !== user.id) {
        const error = new Error('Email already exists');
        error.response = {
          status: 409,
          data: { message: 'Email already exists' }
        };
        throw error;
      }
    }
    
    // Prepare update data (map frontend fields to database fields)
    const updateData = {
      full_name: profileData.fullName || profileData.full_name,
      email: profileData.email,
      phone_number: profileData.phoneNumber || profileData.phone_number,
      dob: profileData.dob,
    };
    
    // Remove undefined fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });
    
    // Update user in database
    const updatedUser = mockDatabase.updateUser(user.id, updateData);
    
    // Update stored email if email was changed
    if (profileData.email && profileData.email !== storedEmail) {
      localStorage.setItem('mockUserEmail', profileData.email);
    }
    
    // Map database fields to frontend expected format
    const mappedUser = {
      ...updatedUser,
      name: updatedUser.full_name || updatedUser.name || 'User',
      phone: updatedUser.phone_number || updatedUser.phone,
      email: updatedUser.email,
      id: updatedUser.id,
      roles: updatedUser.roles || updatedUser.role,
      full_name: updatedUser.full_name,
      phone_number: updatedUser.phone_number,
    };
    
    return {
      success: true,
      message: 'Profile updated successfully',
      user: mappedUser,
    };
  },
};

export default mockAuthService;

