import { useState,useEffect } from 'react'
import { StudentData } from './data.js'

import './App.css'
// const URL = 'http://localhost:5000/api/users/all'

// ✅ Set your API URL here
const URL = 'http://localhost:5000/api/users';
function App() {
 
//   useEffect(() => {
// const fetchData = async () => {
//   const result = await fetch (URL)
//   console.log(result.json().then(json => console.log(json)));
// }
// fetchData();
//   }, []);

const [data, setData] = useState([]);
const [name, setName] = useState("");
const [number, setNumber] = useState(0);
const [email, setEmail] = useState("");
const [text, setText] = useState("");
const [id, setId] = useState("");
const [isUpdate,setIsUpdate]  = useState(false);

// useEffect(() => {
//   setData(StudentData);
// },[])

  // ✅ Fetch users from backend
  const fetchData = async () => {
    try {
      const res = await fetch(`${URL}/all`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };
  useEffect(() => {

    fetchData();
  }, []);


  //handling edit button
  const handleEdit = (id) => {
    const dt = data.filter(item => item._id === id);
    if(dt !== undefined){
      setIsUpdate(true);
      setId(dt[0]._id);
      setName(dt[0].name);
      
      setNumber(dt[0].number);
      setEmail(dt[0].email);
      setText(dt[0].text);
    }
  }
  // //handling delete button
  // const handleDelete = (id) => {
  //   if(id){
  //     if(window.confirm("Are you sure to delete this itesm?")){
  //       const dt = data.filter(item => item._id !== id);
  //       setData(dt);
  //     }
      
      
  //   }
  // }

    // ✅ Handle delete with backend
    const handleDelete = async (id) => {
      if (id && window.confirm("Are you sure to delete this item?")) {
        try {
          await fetch(`${URL}/${id}`, { method: 'DELETE' });
          setData(data.filter((item) => item._id !== id));
        } catch (error) {
          console.error("Failed to delete user", error);
        }
      }
    };
  
 const  handleClear = () => {
  setId(0);
  setName("");
  setNumber(0);
  setEmail("");
  setText("");
  setIsUpdate(false);
 }

  // const handlesave = (e) => {
  //   e.preventDefault();
  //   const dt = [...data];
  //   const newObject = {
  //     id:StudentData.length + 1,
  //     name: name,
  //     number: number,
  //     email: email,
  //     text: text, 
  //   }
  //   dt.push(newObject);
  //   setData(dt);
    
    
  // }

    // ✅ Save to backend
    const handlesave = async (e) => {
      e.preventDefault();
      try {
        const res = await fetch(`${URL}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, number, email, text })
        });
        const newUser = await res.json();
        setData([...data, newUser]);
        handleClear();
      } catch (error) {
        console.error("Failed to save user", error);
      }
    };

  // const handleUpdate = () => {
  //   const index = data.map((item) =>{
  //     return item._id
  //   }).indexOf(id)

  //   const dt = [...data];
  //   dt[index].name = name;
  //   dt[index].number = number;
  //   dt[index].email = email;
  //   dt[index].text = text;
  //   setData(dt);
  //   handleClear();
    
  // }




  // const handleUpdate = () => {
  //   const index = data.map((item) => item._id).indexOf(id);
  
  //   if (index !== -1) {
  //     const dt = [...data]; // clone the array properly
  //     dt[index] = {
  //       ...dt[index],
  //       name: name,
  //       number: number,
  //       email: email,
  //       text: text,
  //     };
  //     setData(dt);
  //     handleClear();
  //   } else {
  //     console.error("Item not found for update.");
  //   }
  // };
  
  // ✅ Update to backend
  const handleUpdate = async () => {
    try {
      const res = await fetch(`${URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, number, email, text })
      });
      const updatedUser = await res.json();
      const index = data.findIndex((item) => item._id === id);
      if (index !== -1) {
        const updatedData = [...data];
        updatedData[index] = updatedUser;
        setData(updatedData);
        handleClear();
      }
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };


  return (
    <>
      {/* <div >
        <div className='grid grid-cols-2 grid-rows-2 gap-4'>
          <div><fieldset className="fieldset">
               <legend className="fieldset-legend">Plese Enter Your Name?</legend>
               <input type="text" className="input" placeholder="Type here" />
               <p className="fieldset-label"></p>
               </fieldset></div>
          <div><fieldset className="fieldset">
               <legend className="fieldset-legend">Plese Enter Your Name?</legend>
               <input type="number" className="input" placeholder="Plese Enter your number" />
               <p className="fieldset-label"></p>
               </fieldset></div>
            <div><p>Plese Enter Your Name</p>
            <input className="input validator"  type="email" required placeholder="mail@site.com" /></div>
          <div><fieldset className="fieldset">
  <legend className="fieldset-legend">Text</legend>
  <textarea className="textarea h-24" placeholder="Plese Enter Your Text"></textarea>
  <div className="fieldset-label">Optional</div>
</fieldset></div>
        </div>
      </div> */}

<div className="min-h-screen p-8 bg-gray-50">
<div className="grid grid-cols-2 gap-6 justify-items-start items-start">
  
  {/* Name Field */}
  <div className="w-full">
    <fieldset className="fieldset w-full">
      <legend className="fieldset-legend">Please Enter Your Name</legend>
      <input type="text" className="input w-full" placeholder="Type here" onChange={(e) => setName(e.target.value)} value={name} required />
      <p className="fieldset-label"></p>
    </fieldset>
  </div>

  {/* Number Field */}

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
    onChange={(e) => setNumber(e.target.value)}
    value={number}
    
  />
  <p className="validator-hint">Must be 10 digits</p>
</fieldset>
  </div>

  {/* Email Field */}
  <div className="w-full">
    <div className="w-full">
      <p className="mb-1">Please Enter Your Email</p>
      <input className="input validator w-full" type="email" required placeholder="mail@site.com"
      onChange={(e) => setEmail(e.target.value)}
      value={email}
       />
    </div>
  </div>

  {/* Textarea Field */}
  <div className="w-full">
    <fieldset className="fieldset w-full">
      <legend className="fieldset-legend">Message</legend>
      <textarea className="textarea w-full h-24" placeholder="Please Enter Your Text"
      onChange={(e) => setText(e.target.value)}
      value={text}></textarea>
      <div className="fieldset-label">Optional</div>
    </fieldset>
  </div>
  
</div>

  <div className='flex justify-center items-center h-32 gap-5'>
    {
      !isUpdate ?   <button className="btn btn-success" onClick={(e)=> handlesave(e)}>Save</button> :  <button className="btn btn-primary" onClick={()=> handleUpdate()}>Update</button>
    }
    <button className="btn btn-soft btn-error"onClick={()=> handleClear()}>Clear</button>
 

  </div>
  
 <div>
 <div className='w-full '>
  <table class=" w-full table-auto">
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
        <td><button className="btn btn-accent" onClick={() => handleEdit(item._id)}>Edit</button></td>
        <td><button className="btn btn-secondary" onClick={() => handleDelete(item._id)}>Delete</button></td>
      </tr>
    ))}
    
    
    
  </tbody>
</table>
    

  </div>
 </div>
    

  
  
</div>

    </>
  )
}

export default App
