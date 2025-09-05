import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const defaultCategories = [
  {
    name: 'Technology',
    description: 'Latest tech trends, programming, and innovation',
    icon: '⚙',
    color: '#007bff',
    postCount: 0
  },
  {
    name: 'Lifestyle',
    description: 'Life tips, personal development, and wellness',
    icon: '♥',
    color: '#e83e8c',
    postCount: 0
  },
  {
    name: 'Travel',
    description: 'Adventures, destinations, and travel guides',
    icon: '✈',
    color: '#17a2b8',
    postCount: 0
  },
  {
    name: 'Food',
    description: 'Recipes, cooking tips, and culinary experiences',
    icon: '◆',
    color: '#fd7e14',
    postCount: 0
  },
  {
    name: 'Education',
    description: 'Learning resources, tutorials, and academic content',
    icon: '≡',
    color: '#20c997',
    postCount: 0
  },
  {
    name: 'Health',
    description: 'Fitness, nutrition, and mental health topics',
    icon: '○',
    color: '#28a745',
    postCount: 0
  },
  {
    name: 'Entertainment',
    description: 'Movies, music, games, and pop culture',
    icon: '★',
    color: '#ffc107',
    postCount: 0
  },
  {
    name: 'Business',
    description: 'Entrepreneurship, finance, and career advice',
    icon: '▦',
    color: '#6f42c1',
    postCount: 0
  }
];

export const initializeDefaultCategories = async () => {
  try {
    const categoriesRef = collection(db, 'categories');
    const existingCategories = await getDocs(categoriesRef);
    
    const existingNames = existingCategories.docs.map(doc => doc.data().name);
    
    for (const category of defaultCategories) {
      if (!existingNames.includes(category.name)) {
        await addDoc(categoriesRef, category);
        console.log(`Added category: ${category.name}`);
      }
    }
  } catch (error) {
    console.error('Error initializing categories:', error);
  }
};