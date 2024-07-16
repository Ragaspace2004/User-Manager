import { useContext } from 'react';
import { AdminContext } from './AdminContext';

function Test() {
  const { adminId } = useContext(AdminContext);

  return (
    <div>
      {adminId ? (
        <p>Welcome, Admin with ID: {adminId}</p>
      ) : (
        <p>Please log in to see your dashboard.</p>
      )}
    </div>
  );
}

export default Test;

