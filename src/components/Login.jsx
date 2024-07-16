import { useState, useContext,useEffect } from 'react';
import { AdminContext } from './AdminContext';
import 'tailwindcss/tailwind.css';
import Banner from '../assets/Banner.png';
import Logo from '../assets/logo.png';

function Login() {
  const [formData, setFormData] = useState({
    admin_email: '',
    admin_password: '',
    admin_phone_no: '',
    admin_OTP: '',
  });
  const [loginMethod, setLoginMethod] = useState('phone');
  const [remember, setRemember] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const { adminId, setAdminId } = useContext(AdminContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [view, setView] = useState('login');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [viewUser, setViewUser] = useState(null);


  const onSubmitPhoneNumber = (e) => {
    e.preventDefault();
    setShowOTP(true);
  };

  const onSubmitData = async (e) => {
    e.preventDefault();
    console.log(formData);

    try {
      const response = await fetch('https://server.ragapriya-k2022cse.workers.dev/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Data added successfully', data);
        if (data.success) {
          setAdminId(data.admin_id); // Update context with admin_id
          setView('table');
       }else {
          setErrorMessage('Login failed: ' + data.error);
        }
      } else {
        setErrorMessage('Invalid Credentials');
      }
    } catch (error) {
      setErrorMessage('Fetch error: ' + error.message);
    }
  };


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

  const handleSubmit= async (e) => {
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
        body: JSON.stringify(newUser),});
    
        if (response.ok) {
          try {
            const res= await fetch(`https://server.ragapriya-k2022cse.workers.dev/api/user-table/${adminId}`);
            if (res.ok) {
              const data = await res.json();
              setUsers(data.results);
            } else {
              console.log('Failed to fetch users');
            }
          } catch (error) {
            console.log(error);
          }
          } else {
          console.log('Failed to add user');
        }
      } catch (error) {
        console.log(error);
      }
    
      setShowModal(false);
    }
  
  
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

 if (view === 'login') {
  return (
    <div className="min-h-screen bg-center flex-items" style={{ backgroundImage: `url(${Banner})`, backgroundSize: 'cover' }}>
      <div className="container max-w-lg mx-auto px-6 mr-5 mb-20 mt-48">
        <div className="bg-[#171717] shadow-lg rounded-lg p-10">
          <div className="flex flex-col gap-4">
            <img src={Logo} alt="logo" className="w-40 h-auto ml-28" />
            <div id="loginOptions" className="flex justify-center mb-6">
              <button
                type="button"
                onClick={() => {
                  setLoginMethod('phone');
                  setShowOTP(false);
                }}
                className={`btn mx-2 px-7 py-3 border-2 rounded ${loginMethod === 'phone' ? 'bg-white text-black' : 'bg-[#171717] text-white border-blue-300'}`}
              >
                Phone No
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('email')}
                className={`btn mx-2 px-9 py-3 border-2 rounded ${loginMethod === 'email' ? 'bg-white text-black' : 'bg-[#171717] text-white border-blue-300'}`}
              >
                Email
              </button>
            </div>
            {errorMessage && (
              <div className="bg-red-500 text-white p-3 rounded mb-4">
                {errorMessage}
              </div>
            )}
            <form onSubmit={onSubmitData} className={loginMethod === 'email' ? '' : 'hidden'}>
              <div className="form-group mb-4">
                <label className="text-white" htmlFor="emailInput">
                  Enter Email
                </label>
                <input
                  type="email"
                  id="emailInput"
                  placeholder="Enter your email id"
                  value={formData.admin_email}
                  onChange={(e) =>
                    setFormData({ ...formData, admin_email: e.target.value })
                  }
                  className="w-full p-2 rounded border"
                  required
                />
              </div>
              <div className="form-group mb-4">
                <label className="text-white" htmlFor="passwordInput">
                  Password
                </label>
                <input
                  type="password"
                  id="passwordInput"
                  placeholder="............................."
                  value={formData.admin_password}
                  onChange={(e) =>
                    setFormData({ ...formData, admin_password: e.target.value })
                  }
                  className="w-full p-2 rounded border"
                  required
                />
                <div className="mt-2">
                  <input
                    type="checkbox"
                    id="showPassword"
                    onClick={() => {
                      const passwordInput = document.getElementById('passwordInput');
                      if (passwordInput) {
                        passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
                      }
                    }}
                  />
                  <label htmlFor="showPassword" className="ml-2 text-white">
                    Show Password
                  </label>
                </div>
              </div>
              <div className="form-group mb-4">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={remember}
                  className="bg-orange-600 mr-2"
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <label className="text-white" htmlFor="rememberMe">
                  Remember me
                </label>
              </div>
              <div className="flex justify-between">
              <button type="submit" className="px-7 py-2 bg-orange-600 text-white font-sans rounded-md">
                  Login
                </button>
              </div>
            </form>
            <form onSubmit={showOTP ? onSubmitData : onSubmitPhoneNumber} className={loginMethod === 'phone' ? '' : 'hidden'}>
              <div className="form-group mb-4">
                <label className="text-white" htmlFor="phoneInput">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phoneInput"
                  placeholder="Enter your phone number"
                  value={formData.admin_phone_no}
                  onChange={(e) =>
                    setFormData({ ...formData, admin_phone_no: e.target.value })
                  }
                  className="w-full p-2 rounded border"
                  required
                />
              </div>
              {showOTP && (
                <div className="form-group mb-4">
                  <label htmlFor="otp" className="text-white">
                    Enter OTP
                  </label>
                  <div className="flex space-x-2">
                    {[...Array(4)].map((_, idx) => (
                      <input
                        key={idx}
                        type="text"
                        maxLength="1"
                        className="w-12 h-12 text-center rounded border"
                        value={formData.admin_OTP[idx] || ''}
                        onChange={(e) => {
                          const newOTP = formData.admin_OTP.split('');
                          newOTP[idx] = e.target.value;
                          setFormData({
                            ...formData,
                            admin_OTP: newOTP.join(''),
                          });
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-between">
              <button type="submit" className="btn py-2 bg-orange-600 px-7 text-white rounded">
                  {showOTP ? 'Login' : 'Next'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );}
  else if(view=='table'){
    return(
      <div id="root">
      <div className="container">
        <div className="top-box">
       
          <h1>Users</h1>
        
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
                  <td > </td>
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
          <div className="modal shadow-mg">
            <div className="modal-content flex flex-justify items-center">
              <span className="close" onClick={handleModalClose}>
                &times;
              </span>
              <div className="modal-heading">
                <h2>Add User</h2>
              </div>
             
                <form onSubmit={handleSubmit}>
                <div className="flex flex-row gap-5"><div className="form-group mb-4">
                    
                    <label className="block mb-2 font-bold">Name:</label>
                    <input type="text" name="name" required />
                  </div>
                  <div className="form-group">
                    <label className="font-bold block mb-2">Phone Number:</label>
                    <input type="text" name="phoneNumber" required />
                  </div>
                  </div>
                  <div className="flex flex-row gap-5">
                  <div className="form-group mb-4">
                    <label className="block mb-2 font-bold">Gender:</label>
                    <select name="gender" required>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="block mb-2 font-bold">City:</label>
                    <input type="text" name="city" required />
                  </div>
                  </div>

                  <div className="form-group">
                    <label className="block mb-2 font-bold">Email:</label>
                    <input type="email" name="email" required />
                  </div>
                  <div className="form-group">
                    <button type="submit" className="submit-button">Add User</button>
                  </div>
                </form>
            
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
    )
  }
}

export default Login;
