import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
AdminProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
  const [adminId, setAdminId] = useState('');

  console.log('AdminContext adminId:', adminId);

  return (
    <AdminContext.Provider value={{ adminId, setAdminId }}>
      {children}
    </AdminContext.Provider>
  );
};
