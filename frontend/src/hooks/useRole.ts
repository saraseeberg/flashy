import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { auth, db } from '../config/firebase';
import { Firestore, doc, getDoc } from 'firebase/firestore';

function useUserRole() {
  const { isAuthenticated } = useAuth();
  const currentUserId = auth.currentUser?.uid;
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (currentUserId) {
        const userDocRef = doc(db as Firestore, 'usersData', currentUserId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          const role = userData?.role;
          setUserRole(role);
        } else {
          console.error('User document not found.');
        }
      }
    };

    if (isAuthenticated && currentUserId) {
      fetchUserRole();
    }
  }, [isAuthenticated, currentUserId]);

  return userRole;
}

export default useUserRole;
