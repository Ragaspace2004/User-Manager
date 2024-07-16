import { useState, useEffect,useContext } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { AdminContext } from './AdminContext';

function Table() {
  const { adminId } = useContext(AdminContext);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [viewUser, setViewUser] = useState(null);

    useEffect(() => {
      const fetchUsers = async () => {
        if (!adminId) {
          console.log('No adminId available');
          return;
        }
        try {
          console.log(`Fetching users with adminId ${adminId}`);
          const response = await fetch(`https://server.ragapriya-k2022cse.workers.dev/api/user-table/${adminId}`);
          if (response.ok) {
            const data = await response.json();
            setUsers(data.results);
          } else {
            console.log('Failed to fetch users');
          }
        } catch (error) {
          console.log(error);
        }
      };
  
      fetchUsers();
    }, [adminId]);

  const handleAddUser = () => {
    setShowModal(true);
    document.body.classList.add('modal-open');
  };

  const handleModalClose = () => {
    setShowModal(false);
    document.body.classList.remove('modal-open');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Assuming that user input values are collected properly.
    const newUser = {
      admin_id: adminId,
      name: e.target.name.value,
      gender: e.target.gender.value,
      city: e.target.city.value,
      phone_no: e.target.phoneNumber.value,
      email: e.target.email.value,
    };

    try {
      const response = await fetch('https://server.ragapriya-k2022cse.workers.dev/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Data added successfully', data);
        if (data.success) {
          setUsers([...users, newUser]);
          handleModalClose();
        }
      }
    } catch (error) {
      console.log(error);  
    }
  };
  
  const handleDeleteUser = (id) => {
    setDeleteIndex(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm =async () => {
    try {
      const response = await fetch(`https://server.ragapriya-k2022cse.workers.dev/api/user/${deleteIndex}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('User deleted successfully');
        setUsers(users.filter(user => user.id !== deleteIndex));
      } else {
        console.log('Failed to delete user');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleViewUser = async(id) => {
    try {
      const response = await fetch(`https://server.ragapriya-k2022cse.workers.dev/api/user/${id}`);
      if (response.ok) {
        const data = await response.json();
        setViewUser(data.results[0]);
        setShowViewModal(true);
      } else {
        console.log('Failed to fetch user details');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleViewModalClose = () => {
    setShowViewModal(false);
  };

  return (
    <div id="root">
      <div className="container">
        <div className="top-box">
       
          <h1>Users</h1>
          <p>{adminId}</p>
        </div>
        <div className="sidebar">
          <h3>USERS</h3>
        </div>
        <div className="content">
          <table className="table">
            <thead>
              <tr>
                <th>Sl No</th>
                <th>Name</th>
                <th>Gender</th>
                <th>City</th>
                <th>Phone Number</th>
                <th> </th>
                <th>
                  <button type="button" onClick={handleAddUser} className="add-button">
                    + Add User
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.gender}</td>
                  <td>{user.city}</td>
                  <td>{user.phone_no}</td>
                  <td>{user.email}</td>
                  <td>
                    <div className='button1'>
                      <button type="button" className="eye-button" onClick={() => handleViewUser(user.id)}>
                        <i className="fas fa-eye" style={{ marginRight: 10 }}></i>
                      </button>
                      <button type="button" className="delete-button" onClick={() => handleDeleteUser(user.id)}>
                        <i className="fas fa-trash" style={{ marginRight: 10 }}></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="no-users-added">
              <h2>No Users Added</h2>
            </div>
          )}
        </div>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={handleModalClose}>
                &times;
              </span>
              <div className="modal-heading">
                <h2>Add User</h2>
              </div>
              <div className="card">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Name:</label>
                    <input type="text" name="name" required />
                  </div>
                  <div className="form-group">
                    <label>Gender:</label>
                    <select name="gender" required>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>City:</label>
                    <input type="text" name="city" required />
                  </div>
                  <div className="form-group">
                    <label>Phone Number:</label>
                    <input type="text" name="phoneNumber" required />
                  </div>
                  <div className="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" required />
                  </div>
                  <div className="form-group">
                    <button type="submit" className="submit-button">Submit</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {showViewModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={handleViewModalClose}>
                &times;
              </span>
              <div className="modal-heading">
                <h2>View User</h2>
              </div>
              {viewUser && (
                <div className="user-details">
                  <h3>Name:</h3>
                  <strong>{viewUser.name}</strong>
                  <hr />
                  <h3>Gender:</h3>
                  <h2><strong>{viewUser.gender}</strong></h2>
                  <hr />
                  <h3>City:</h3>
                  <h2><strong>{viewUser.city}</strong></h2>
                  <hr />
                  <h3>Phone Number:</h3>
                  <h2><strong>{viewUser.phone_no}</strong></h2>
                  <hr />
                  <h3>Email:</h3>
                  <h2><strong>{viewUser.email}</strong></h2>
                </div>
              )}
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-content">
                <h2>Delete User</h2>
                <p>Are you sure you want to delete this user?</p>
                <div className="button-group">
                  <button className="cancel-button" onClick={handleDeleteCancel}>
                    Cancel
                  </button>
                  <button className="delete-button" onClick={handleDeleteConfirm()}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Table;
