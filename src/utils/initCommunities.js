import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const defaultCommunities = [
  {
    name: 'Tech Talk',
    description: 'Discuss the latest in technology, programming, and innovation',
    category: 'Technology',
    isPublic: true,
    memberCount: 0,
    postCount: 0,
    createdAt: new Date(),
    createdBy: 'system',
    rules: ['Be respectful', 'Stay on topic', 'No spam'],
    icon: 'T'
  },
  {
    name: 'Travel Stories',
    description: 'Share your adventures and discover new destinations',
    category: 'Travel',
    isPublic: true,
    memberCount: 0,
    postCount: 0,
    createdAt: new Date(),
    createdBy: 'system',
    rules: ['Share authentic experiences', 'Be helpful to fellow travelers', 'No promotional content'],
    icon: 'T'
  },
  {
    name: 'Healthy Living',
    description: 'Tips, advice, and support for a healthier lifestyle',
    category: 'Health',
    isPublic: true,
    memberCount: 0,
    postCount: 0,
    createdAt: new Date(),
    createdBy: 'system',
    rules: ['No medical advice', 'Share evidence-based information', 'Support each other'],
    icon: 'H'
  },
  {
    name: 'Creative Corner',
    description: 'Showcase your art, writing, and creative projects',
    category: 'Arts',
    isPublic: true,
    memberCount: 0,
    postCount: 0,
    createdAt: new Date(),
    createdBy: 'system',
    rules: ['Original content only', 'Constructive feedback', 'Credit sources'],
    icon: 'C'
  }
];

export const initializeDefaultCommunities = async () => {
  try {
    const communitiesRef = collection(db, 'communities');
    const existingCommunities = await getDocs(communitiesRef);
    
    if (existingCommunities.empty) {
      for (const community of defaultCommunities) {
        await addDoc(communitiesRef, community);
      }
      console.log('Default communities initialized');
    }
  } catch (error) {
    console.error('Error initializing communities:', error);
  }
};