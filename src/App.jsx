import { useState, useEffect } from 'react';
import './App.css';

const URL = 'http://localhost:5000/api/users';

function App() {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    email: '',
    text: '',
    id: '',
    isUpdate: false,
  });

  const fetchData = async () => {
    try {
      const res = await fetch(`${URL}/all`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (id) => {
    const dt = data.find((item) => item._id === id);
    if (dt) {
      setFormData({
        name: dt.name,
        number: dt.number,
        email: dt.email,
        text: dt.text,
        id: dt._id,
        isUpdate: true,
      });
    }
  };

  const handleDelete = async (id) => {
    if (id && window.confirm('Are you sure to delete this item?')) {
      try {
        await fetch(`${URL}/${id}`, { method: 'DELETE' });
        setData(data.filter((item) => item._id !== id));
      } catch (error) {
        console.error('Failed to delete user', error);
      }
    }
  };

  const handleClear = () => {
    setFormData({
      name: '',
      number: '',
      email: '',
      text: '',
      id: '',
      isUpdate: false,
    });
  };

//   const handlesave = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch(`${URL}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           name: formData.name,
//           number: formData.number,
//           email: formData.email,
//           text: formData.text,
//         }),
//       });
//       const newUser = await res.json();
//       setData([...data, newUser]);
//       handleClear();
//     } catch (error) {
//       console.error('Failed to save user', error);
//     }
//   };

// Save data with Validation for empty space 
const handlesave = async (e) => {
    e.preventDefault();
  
    if (!formData.name || !formData.number || !formData.email || !formData.text) {
      alert("All fields are required.");
      return;
    }
  
    try {
      const res = await fetch(`${URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          number: formData.number,
          email: formData.email,
          text: formData.text,
        }),
      });
      const newUser = await res.json();
      setData([...data, newUser]);
      handleClear();
    } catch (error) {
      console.error('Failed to save user', error);
    }
  };
  

  const handleUpdate = async () => {
    try {
      const res = await fetch(`${URL}/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          number: formData.number,
          email: formData.email,
          text: formData.text,
        }),
      });
      const updatedUser = await res.json();
      const index = data.findIndex((item) => item._id === formData.id);
      if (index !== -1) {
        const updatedData = [...data];
        updatedData[index] = updatedUser;
        setData(updatedData);
        handleClear();
      }
    } catch (error) {
      console.error('Failed to update user', error);
    }
  };

  return (
    <>
      <div className="min-h-screen p-8 bg-gray-50">
        <div className="grid grid-cols-2 gap-6 justify-items-start items-start">
          <div className="w-full">
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend">Please Enter Your Name</legend>
              <input
                type="text"
                className="input w-full"
                placeholder="Type here"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                value={formData.name}
                required
              />
            </fieldset>
          </div>

          <div className="w-full">
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend">Please Enter Your Phone Number</legend>
              <input
                type="tel"
                className="input validator tabular-nums w-full"
                required
                placeholder="9876543210"
                pattern="[0-9]*"
                minLength="10"
                maxLength="10"
                title="Must be 10 digits"
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                value={formData.number}
              />
              <p className="validator-hint">Must be 10 digits</p>
            </fieldset>
          </div>

          <div className="w-full">
            <p className="mb-1">Please Enter Your Email</p>
            <input
              className="input validator w-full"
              type="email"
              required
              placeholder="mail@site.com"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              value={formData.email}
            />
          </div>

          <div className="w-full">
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend">Message</legend>
              <textarea
                className="textarea w-full h-24"
                placeholder="Please Enter Your Text"
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                value={formData.text}
              ></textarea>
              <div className="fieldset-label">Optional</div>
            </fieldset>
          </div>
        </div>

        <div className="flex justify-center items-center h-32 gap-5">
          {!formData.isUpdate ? (
            <button className="btn btn-success" onClick={(e) => handlesave(e)}>Save</button>
          ) : (
            <button className="btn btn-primary" onClick={handleUpdate}>Update</button>
          )}
          <button className="btn btn-soft btn-error" onClick={handleClear}>Clear</button>
        </div>

        <div className="w-full">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th>Sr.No</th>
                <th>Name</th>
                <th>Number</th>
                <th>Email</th>
                <th>Text</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.number}</td>
                  <td>{item.email}</td>
                  <td>{item.text}</td>
                  <td>
                    <button className="btn btn-accent" onClick={() => handleEdit(item._id)}>Edit</button>
                  </td>
                  <td>
                    <button className="btn btn-secondary" onClick={() => handleDelete(item._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default App;
