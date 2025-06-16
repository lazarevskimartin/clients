import React, { useEffect, useState } from 'react';
import { getProfile } from '../utils/profileApi';

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }
    getProfile(token)
      .then(res => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load profile');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!profile) return null;

  return (
    <div style={{ maxWidth: 400, margin: '24px auto', padding: 16, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
      <h2>User Profile</h2>
      <div><strong>Email:</strong> {profile.email}</div>
      <div><strong>Created:</strong> {new Date(profile.createdAt).toLocaleString()}</div>
    </div>
  );
};

export default UserProfile;
