import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SportsAdmission.css";

const SportsAdmission = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    height: "",
    unitheight: "",
    weight: "",
    unitweight: "",
    sports: "",
    team: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSportForm, setShowSportForm] = useState(false);
  const [formId, setFormId] = useState(null); 
  const teamS = {
    Basketball: ["Team A", "Team B", "Team C"],
    Badminton: ["Shuttle Kings", "Net Smashers", "Ace Player", "Green Lucks"],
    Volleyball: ["Spike Masters", "Volley Stars", "Boss Tiger", "King Dragon"],
    Tennis: ["Ace Squad", "Court Runners", "Speed Motion", "Gravity Snipper"],
    Arnis: ["Stick Fighters", "Blade Warriors", "Green Slasher", "Mist Striker "],
  };

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get("https://sportsform.azurewebsites.net/api/formdata");
        if (response.data.length > 0) {
          const data = response.data[0];
          setFormData(data);
          setFormId(data._id); // Set formId state
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };

    fetchFormData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.sports) {
      alert("Please select a sport before submitting!");
      return;
    }

    try {
      if (formId) {
        await axios.put(`https://sportsform.azurewebsites.net/api/formdata/${formId}`, formData);
        console.log("Form Data Updated:", formData);
      } else {
        const response = await axios.post("https://sportsform.azurewebsites.net/api/formdata", formData);
        setFormId(response.data._id);
        console.log("Form Data Submitted:", formData);
      }
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting form data:", error);
    }
  };

  const handleEditform = () => {
    setIsSubmitted(false);
    setShowSportForm(true);
  };

  const handleFinish = () => {
    setFormData({
      name: "",
      age: "",
      email: "",
      height: "",
      unitheight: "",
      weight: "",
      unitweight: "",
      sports: "",
      team: "",
    });
    setFormId(null); // Reset formId to ensure new entry
    setIsSubmitted(false);
    setShowSportForm(false);
  };

  const HomePage = () => (
    <div className="home-container">
      <h1>Welcome to PUPBC Sports</h1>
      <p>Thank you for signing up, {formData.name || "User"}!</p>
      <p>Your selected sport: {formData.sports || "None selected"}</p>
      {formData.height && <p>Your height: {formData.height} {formData.unitheight}</p>}
      {formData.weight && <p>Your weight: {formData.weight} {formData.unitweight}</p>}
      <button onClick={() => setShowSportForm(true)}>Continue</button>
    </div>
  );

  const SportForm = () => {
    const selectedTeams = teamS[formData.sports] || [];

    return (
      <div className="sportForm">
        <h1>Welcome to PUPBC Sports</h1>
        <br></br>
        <h1>{formData.sports ? formData.sports : "Select a Sport"}</h1>
        <br></br>
        <p>Thank you for signing up!</p>
        {formData.name && <p>FullName: {formData.name} </p>}
        {formData.age && <p>Age: {formData.age} yrs Old</p>}
        {formData.email && <p>Email: {formData.email}</p>}
        {formData.height && <p>Your height: {formData.height} {formData.unitheight}</p>}
        {formData.weight && <p>Your weight: {formData.weight} {formData.unitweight}</p>}
        {formData.sports && <p> Sports:{formData.sports} </p>}
        {formData.team && <p>Selected Team: {formData.team}</p>}
        <button onClick={handleEditform}>Edit Form</button>
        <button onClick={handleFinish}>Confirm</button>
      </div>
    );
  };

  return (
    <div className="form-container">
      {isSubmitted ? (
        showSportForm ? (
          <SportForm /> // Show SportForm when showSportForm is true
        ) : (
          <HomePage /> // Show HomePage if not clicked yet
        )
      ) : (
        <div className="form-card">
          <h1>Sport Form for PUPBC</h1>
          <p>Fill out the details if you're interested</p>
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="name">
                Full Name:
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your fullname"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <div className="form-field">
              <label htmlFor="age">
                Age:
                <input
                  type="text"
                  id="age"
                  name="age"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <div className="form-field">
              <label htmlFor="email">
                Email:
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="height">
                  Height:
                  <input
                    type="text"
                    id="height"
                    name="height"
                    placeholder="Enter your height"
                    value={formData.height}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <div className="form-field">
                <label htmlFor="unitheight">
                  Unit:
                  <select
                    id="unitheight"
                    name="unitheight"
                    value={formData.unitheight}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a Unit for height</option>
                    <option value="cm">Centimeters</option>
                    <option value="m">Meters</option>
                    <option value="in">Inches</option>
                    <option value="ft">Feet</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="weight">
                  Weight:
                  <input
                    type="text"
                    id="weight"
                    name="weight"
                    placeholder="Enter your weight"
                    value={formData.weight}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <div className="form-field">
                <label htmlFor="unitweight">
                  Unit:
                  <select
                    id="unitweight"
                    name="unitweight"
                    value={formData.unitweight}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a Unit for weight</option>
                    <option value="oz">Ounces</option>
                    <option value="lb">Pounds</option>
                    <option value="tn">Tons</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="sports">
                Sports:
                <select
                  id="sports"
                  name="sports"
                  value={formData.sports}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a Sport</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Badminton">Badminton</option>
                  <option value="Volleyball">Volleyball</option>
                  <option value="Tennis">Tennis</option>
                  <option value="Arnis">Arnis</option>
                </select>
              </label>
            </div>
            
            <div className="form-field">
              <label htmlFor="team" className="teams">Teams:
                <select  
                id="team"
                name="team"
                value={formData.team}
                onChange={handleChange}
                >
                <option value="">Select a Team</option>
                {teamS[formData.sports]?.map((team, index) => (
                  <option key={index} value={team}>
                    {team}</option> 
                ))}
                </select>
              </label>
            </div>

            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SportsAdmission;