import React, { Component } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import person1 from '../../assets/person1.jpeg';
import person2 from '../../assets/person2.jpeg';
import person3 from '../../assets/person3.jpeg';
import person4 from '../../assets/person4.jpeg';
import Header from '../Header/Header';
import axios from 'axios';

// Custom HOC to inject navigate and location
const withRouter = (Component) => {
  return (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    return <Component {...props} navigate={navigate} location={location} />;
  };
};

class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      name: '',
      profileImage: '',
      gender: '',
      department: [],
      salary: '',
      day: '',
      month: '',
      year: '',
      notes: '',
      isEdit: false,
    };
  }

  componentDidMount() {
    const { location } = this.props;
    if (location.state && location.state.isEdit && location.state.employee) {
      const { employee } = location.state;
      const [day, month, year] = employee.startDate.split('-');
      this.setState({
        id: employee.id,
        name: employee.name,
        profileImage: employee.profileImage,
        gender: employee.gender,
        department: employee.departments,
        salary: employee.salary,
        day,
        month,
        year,
        notes: employee.notes || '',
        isEdit: true,
      });
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const { id, name, profileImage, gender, department, salary, day, month, year, notes, isEdit } = this.state;

    if (!name || !profileImage || !gender || department.length === 0 || !salary || !day || !month || !year) {
      alert('Please fill in all required fields.');
      return;
    }

    const startDate = `${day}-${month}-${year}`;
    const employeeData = { name, profileImage, gender, departments: department, salary, startDate, notes };

    try {
      if (isEdit) {
        const response = await axios.put(`http://localhost:3001/EmpList/${id}`, employeeData);
        if (response.status === 200) {
          alert('Employee updated successfully!');
        }
      } else {
        const response = await axios.post('http://localhost:3001/EmpList', employeeData);
        if (response.status === 201) {
          alert('Employee added successfully!');
        }
      }
      this.handleReset();
      this.props.navigate('/dashboard');
    } catch (error) {
      console.error('Submission error:', error);
      alert(`Something went wrong while ${isEdit ? 'updating' : 'saving'} employee data.`);
    }
  };

  handleReset = () => {
    this.setState({
      id: '',
      name: '',
      profileImage: '',
      gender: '',
      department: [],
      salary: '',
      day: '',
      month: '',
      year: '',
      notes: '',
      isEdit: false,
    });
  };

  handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      this.setState((prevState) => ({
        department: checked
          ? [...prevState.department, value]
          : prevState.department.filter((dep) => dep !== value),
      }));
    } else {
      this.setState({ [name]: value });
    }
  };

  render() {
    const { name, profileImage, gender, department, salary, day, month, year, notes, isEdit } = this.state;

    return (
      <div>
        <Header />
        <main className="flex flex-col items-center w-full min-h-screen">
          <div className="w-full bg-gray-100 p-8 flex-1">
            <form
              className="max-w-4xl mx-auto bg-white p-8 flex flex-col gap-14 text-[#42515F]"
              id="employeeForm"
              onSubmit={this.handleSubmit}
            >
              <h2 className="text-3xl font-bold text-[#42515F] capitalize">
                {isEdit ? 'Update Employee' : 'Employee Payroll Form'}
              </h2>
              <div className="flex flex-col gap-7">
                {/* Name Field */}
                <div className="flex items-center gap-4 md:flex-row flex-col">
                  <label htmlFor="name" className="w-1/3">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={this.handleInputChange}
                    required
                    pattern="[A-Za-z\s]+"
                    title="Only letters are allowed"
                    className="w-full md:w-2/3 h-10 p-2 border border-gray-300 rounded"
                  />
                </div>

                {/* Profile Image Field */}
                <div className="flex items-center gap-2 md:flex-row flex-col">
                  <label className="w-1/3">Profile Image</label>
                  <div className="flex gap-6 md:w-2/3 flex-col md:flex-row">
                    {[
                      { value: '/Assets/person1.jpeg', src: person2 },
                      { value: '/Assets/person2.jpeg', src: person1 },
                      { value: '/Assets/person3.jpeg', src: person3 },
                      { value: '/Assets/person4.jpeg', src: person4 },
                    ].map((img, index) => (
                      <label key={index} className="flex gap-3 items-center">
                        <input
                          type="radio"
                          name="profileImage"
                          value={img.value}
                          checked={profileImage === img.value}
                          onChange={this.handleInputChange}
                          className="w-5 h-5"
                        />
                        <img src={img.src} alt={`Profile ${index + 1}`} className="w-8 h-8 rounded-full" />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Gender Field */}
                <div className="flex items-center gap-4 md:flex-row flex-col">
                  <div className="w-1/3">
                    <label>Gender</label>
                  </div>
                  <div className="flex gap-6 md:w-2/3 flex-col md:flex-row">
                    {['male', 'female'].map((genderOption) => (
                      <label key={genderOption} className="flex gap-3 items-center">
                        <input
                          type="radio"
                          name="gender"
                          value={genderOption}
                          checked={gender === genderOption}
                          onChange={this.handleInputChange}
                          className="w-5 h-5"
                        />
                        <p>{genderOption.charAt(0).toUpperCase() + genderOption.slice(1)}</p>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Department Field */}
                <div className="flex items-center gap-4 md:flex-row flex-col">
                  <label className="w-1/3">Department</label>
                  <div className="flex gap-4 md:w-2/3 flex-col md:flex-row">
                    {['HR', 'sales', 'finance', 'engineer', 'others'].map((dept) => (
                      <label key={dept} className="flex gap-2 items-center">
                        <input
                          type="checkbox"
                          name="department"
                          value={dept}
                          checked={department.includes(dept)}
                          onChange={this.handleInputChange}
                          className="w-5 h-5 border border-gray-300 rounded"
                        />
                        <p>{dept.charAt(0).toUpperCase() + dept.slice(1)}</p>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Salary Field */}
                <div className="flex items-center gap-4 md:flex-row flex-col">
                  <label htmlFor="salary" className="w-1/3">Select Salary</label>
                  <div className="md:w-2/3 w-full">
                    <select
                      id="salary"
                      name="salary"
                      value={salary}
                      onChange={this.handleInputChange}
                      required
                      className="w-full md:w-1/2 h-10 p-2 border border-gray-300 rounded text-[#42515F]"
                    >
                      <option value="" disabled>Select Salary</option>
                      {['₹10,000', '₹20,000', '₹30,000'].map((sal) => (
                        <option key={sal} value={sal}>{sal}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Start Date Field */}
                <div className="flex items-center gap-4 md:flex-row flex-col">
                  <label className="w-1/3">Start Date</label>
                  <div className="flex gap-4 md:w-2/3 flex-col md:flex-row">
                    <select
                      id="day"
                      name="day"
                      value={day}
                      onChange={this.handleInputChange}
                      required
                      className="w-full md:w-1/4 h-10 p-2 border border-gray-300 rounded text-[#42515F]"
                    >
                      <option value="" disabled>Day</option>
                      {Array.from({ length: 31 }, (_, i) => (
                        <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                          {String(i + 1).padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    <select
                      id="month"
                      name="month"
                      value={month}
                      onChange={this.handleInputChange}
                      required
                      className="w-full md:w-1/4 h-10 p-2 border border-gray-300 rounded text-[#42515F]"
                    >
                      <option value="" disabled>Month</option>
                      {[
                        'January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'
                      ].map((month, index) => (
                        <option key={month} value={String(index + 1).padStart(2, '0')}>
                          {month}
                        </option>
                      ))}
                    </select>
                    <select
                      id="year"
                      name="year"
                      value={year}
                      onChange={this.handleInputChange}
                      required
                      className="w-full md:w-1/4 h-10 p-2 border border-gray-300 rounded text-[#42515F]"
                    >
                      <option value="" disabled>Year</option>
                      {[2021, 2022, 2023, 2024, 2025].map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Notes Field */}
                <div className="flex gap-4 md:flex-row flex-col">
                  <label className="w-1/3" htmlFor="notes">Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={notes}
                    onChange={this.handleInputChange}
                    className="w-full md:w-2/3 h-24 p-2 border border-gray-300 rounded"
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-between items-center flex-col md:flex-row gap-4">
                  <div>
                    <button
                      type="button"
                      onClick={() => this.props.navigate('/dashboard')}
                      className="w-full px-12 py-3 border border-gray-400 rounded bg-gray-200 hover:bg-gray-500 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="flex gap-4 flex-col md:flex-row w-full md:w-auto">
                    <button
                      type="submit"
                      className="px-12 py-3 border border-gray-400 rounded bg-gray-200 hover:bg-[#82A70C] hover:text-white"
                    >
                      {isEdit ? 'Update' : 'Submit'}
                    </button>
                    <button
                      type="button"
                      onClick={this.handleReset}
                      className="px-12 py-3 border border-gray-400 rounded bg-gray-200 hover:bg-gray-500 hover:text-white"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    );
  }
}

export default withRouter(Registration);