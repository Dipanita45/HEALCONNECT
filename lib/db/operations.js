// Database CRUD Operations
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot,
  getCountFromServer,
  runTransaction
} from 'firebase/firestore';
import { db } from '../firebase';

function withTimestamps(data, options = {}) {
  const timestampFields = {};

  if (options.includeCreatedAt) {
    timestampFields.createdAt = serverTimestamp();
  }

  if (options.includeUpdatedAt !== false) {
    timestampFields.updatedAt = serverTimestamp();
  }

  return {
    ...data,
    ...timestampFields
  };
}

function buildDocRef(collectionName, id) {
  return id ? doc(db, collectionName, id) : doc(collection(db, collectionName));
}

function createUnitOfWorkContext(transaction) {
  return {
    async getById(collectionName, id) {
      const docRef = buildDocRef(collectionName, id);
      const docSnap = await transaction.get(docRef);

      return {
        exists: docSnap.exists(),
        id: docRef.id,
        ref: docRef,
        data: docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null
      };
    },

    async create(collectionName, data, options = {}) {
      const docRef = buildDocRef(collectionName, options.id);

      if (options.id) {
        const existingDoc = await transaction.get(docRef);
        if (existingDoc.exists()) {
          throw new Error(`Document already exists in ${collectionName}: ${options.id}`);
        }
      }

      transaction.set(docRef, withTimestamps(data, {
        includeCreatedAt: true,
        includeUpdatedAt: options.includeUpdatedAt
      }));

      return { id: docRef.id, ref: docRef };
    },

    set(collectionName, id, data, options = {}) {
      const docRef = buildDocRef(collectionName, id);

      transaction.set(docRef, withTimestamps(data, {
        includeCreatedAt: options.includeCreatedAt,
        includeUpdatedAt: options.includeUpdatedAt
      }), { merge: options.merge !== false });

      return { id: docRef.id, ref: docRef };
    },

    update(collectionName, id, data, options = {}) {
      const docRef = buildDocRef(collectionName, id);

      transaction.update(docRef, withTimestamps(data, {
        includeUpdatedAt: options.includeUpdatedAt
      }));

      return { id: docRef.id, ref: docRef };
    },

    delete(collectionName, id) {
      const docRef = buildDocRef(collectionName, id);
      transaction.delete(docRef);
      return { id: docRef.id, ref: docRef };
    }
  };
}

// Generic CRUD Operations
export const dbOperations = {
  // Create
  async create(collectionName, data) {
    try {
      const docRef = await addDoc(collection(db, collectionName), withTimestamps(data, {
        includeCreatedAt: true
      }));
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
      await updateDoc(docRef, withTimestamps(data));
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
 
  // Get count
  async getCount(collectionName, constraints = []) {
    try {
      const collectionRef = collection(db, collectionName);
      const q = constraints.length > 0 ? query(collectionRef, ...constraints) : collectionRef;
      const snapshot = await getCountFromServer(q);
      return { success: true, count: snapshot.data().count };
    } catch (error) {
      console.error(`Error getting count from ${collectionName}:`, error);
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
  },

  // Execute related writes as one atomic workflow.
  async executeUnitOfWork(work) {
    try {
      const result = await runTransaction(db, async (transaction) => {
        const unitOfWork = createUnitOfWorkContext(transaction);
        return await work(unitOfWork);
      });

      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Error executing unit of work:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Convenience helper for simple atomic set operations without custom orchestration.
  async set(collectionName, id, data, options = {}) {
    try {
      const docRef = buildDocRef(collectionName, id);
      await setDoc(docRef, withTimestamps(data, {
        includeCreatedAt: options.includeCreatedAt,
        includeUpdatedAt: options.includeUpdatedAt
      }), { merge: options.merge !== false });

      return {
        success: true,
        id: docRef.id
      };
    } catch (error) {
      console.error(`Error setting document in ${collectionName}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};

export { where, orderBy, limit };
