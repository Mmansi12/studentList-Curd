import React, { useState, useEffect } from 'react';

const User = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    subject1: '',
    subject2: '',
    subject3: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const storedStudents = JSON.parse(localStorage.getItem('students')) || [];
    setStudents(storedStudents);
  }, []);

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateTotalAndPercentage = () => {
    const total = parseInt(formData.subject1) + parseInt(formData.subject2) + parseInt(formData.subject3);
    const percentage = total / 3;
    return { total, percentage };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { total, percentage } = calculateTotalAndPercentage();
    const newStudent = {
      ...formData,
      total,
      percentage,
      grade: getGrade(percentage),
    };
    if (editingIndex !== null) {
      const updatedStudents = students.map((student, index) =>
        index === editingIndex ? newStudent : student
      );
      setStudents(updatedStudents);
      setEditingIndex(null);
    } else {
      setStudents([...students, newStudent]);
    }
    setFormData({ name: '', subject1: '', subject2: '', subject3: '' });
  };

  const handleEdit = (index) => {
    setFormData(students[index]);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const updatedStudents = [...students];
    updatedStudents.splice(index, 1);
    setStudents(updatedStudents);
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'E';
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h1>students Data Management</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-2">
          <label className='form-label'>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" />
        </div>
        <div className="form-group mb-2">
          <label className='form-label'>Account</label>
          <input type="number" name="subject1" value={formData.subject1} onChange={handleChange} className="form-control" />
        </div>
        <div className="form-group mb-2">
          <label className='form-label'>Statstics</label>
          <input type="number" name="subject2" value={formData.subject2} onChange={handleChange} className="form-control" />
        </div>
        <div className="form-group mb-2">
          <label className='form-label'>English</label>
          <input type="number" name="subject3" value={formData.subject3} onChange={handleChange} className="form-control" />
        </div>
        <button type="submit" className="btn btn-primary">{editingIndex !== null ? 'Update' : 'Add'}</button>
      </form>

      <div className="form-group mt-3">
        <label className='form-label'>Search</label>
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="form-control" />
      </div>

      <table className="table mt-3">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Account</th>
            <th>Statstics</th>
            <th>English</th>
            <th>Total</th>
            <th>Percentage</th>
            <th>Grade</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student, index) => (
            <tr key={index+1}>
              <td>{index}</td>
              <td>{student.name}</td>
              <td>{student.subject1}</td>
              <td>{student.subject2}</td>
              <td>{student.subject3}</td>
              <td>{student.total}</td>
              <td>{student.percentage.toFixed(2)}%</td>
              <td>{student.grade}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(index)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default User;
