import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

export const cleanupDuplicateCategories = async () => {
  try {
    const categoriesRef = collection(db, 'categories');
    const snapshot = await getDocs(categoriesRef);
    
    const categories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    const seen = new Set();
    const duplicates = [];
    
    categories.forEach(category => {
      if (seen.has(category.name)) {
        duplicates.push(category.id);
      } else {
        seen.add(category.name);
      }
    });
    
    // Delete duplicates
    for (const duplicateId of duplicates) {
      await deleteDoc(doc(db, 'categories', duplicateId));
      console.log(`Deleted duplicate category: ${duplicateId}`);
    }
    
    console.log(`Cleanup complete. Removed ${duplicates.length} duplicate categories.`);
  } catch (error) {
    console.error('Error cleaning up categories:', error);
  }
};