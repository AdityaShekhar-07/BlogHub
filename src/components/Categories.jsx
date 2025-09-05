import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { initializeDefaultCategories } from '../utils/initCategories';
import { cleanupDuplicateCategories } from '../utils/cleanupCategories';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        await cleanupDuplicateCategories();
        await initializeDefaultCategories();
        
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <div className="loading">Loading categories...</div>;

  return (
    <div className="page-container">
      <h1>Categories</h1>
      <p className="page-description">Explore blogs by category and discover content that interests you.</p>
      
      <div className="categories-grid">
        {categories.map(category => (
          <Link 
            key={category.id} 
            to={`/category/${category.name}`} 
            className="category-card"
            style={{ borderLeftColor: category.color }}
          >
            <div className="category-icon" style={{ color: category.color }}>
              {category.icon}
            </div>
            <div className="category-info">
              <h3>{category.name}</h3>
              <p>{category.postCount} posts</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;