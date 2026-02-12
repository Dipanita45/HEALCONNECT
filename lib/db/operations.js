// Database CRUD Operations
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';

// Generic CRUD Operations
export const dbOperations = {
  // Create
  async create(collectionName, data) {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error(`Error creating document in ${collectionName}:`, error);
      return { success: false, error: error.message };
    }
  },

  // Read single document
  async getById(collectionName, id) {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
      } else {
        return { success: false, error: 'Document not found' };
      }
    } catch (error) {
      console.error(`Error getting document from ${collectionName}:`, error);
      return { success: false, error: error.message };
    }
  },

  // Read all documents
  async getAll(collectionName, constraints = []) {
    try {
      const collectionRef = collection(db, collectionName);
      const q = constraints.length > 0 ? query(collectionRef, ...constraints) : collectionRef;
      const querySnapshot = await getDocs(q);
      
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      return { success: true, data: documents };
    } catch (error) {
      console.error(`Error getting documents from ${collectionName}:`, error);
      return { success: false, error: error.message };
    }
  },

  // Update
  async update(collectionName, id, data) {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error(`Error updating document in ${collectionName}:`, error);
      return { success: false, error: error.message };
    }
  },

  // Delete
  async delete(collectionName, id) {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      console.error(`Error deleting document from ${collectionName}:`, error);
      return { success: false, error: error.message };
    }
  },

  // Query with conditions
  async queryDocuments(collectionName, conditions = []) {
    try {
      const collectionRef = collection(db, collectionName);
      const q = query(collectionRef, ...conditions);
      const querySnapshot = await getDocs(q);
      
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      return { success: true, data: documents };
    } catch (error) {
      console.error(`Error querying ${collectionName}:`, error);
      return { success: false, error: error.message };
    }
  },

  // Real-time listener
  subscribe(collectionName, callback, constraints = []) {
    const collectionRef = collection(db, collectionName);
    const q = constraints.length > 0 ? query(collectionRef, ...constraints) : collectionRef;
    
    return onSnapshot(q, (snapshot) => {
      const documents = [];
      snapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      callback(documents);
    }, (error) => {
      console.error(`Error in subscription to ${collectionName}:`, error);
    });
  }
};

export { where, orderBy, limit };
