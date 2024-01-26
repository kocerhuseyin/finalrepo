import React, { useState, useEffect } from "react";
import axios from "axios";
import ReminderCard from "../components/reminderCard/ReminderCard";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import Footer from "../components/footer/Footer";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "../images/logout.svg";


interface Alarm {
  _id: string;
  time: string;
  days: string[];
  description: string;
}

interface NewAlarm {
  time: string;
  days: string[];
  description: string;
}

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const Reminders: React.FC = () => {
  const navigate = useNavigate();
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [newAlarm, setNewAlarm] = useState<NewAlarm>({ time: "", days: [], description: "" });

  useEffect(() => {
    axios.get("http://localhost:5000/api/get-alarms", {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
    })
      .then(response => setAlarms(response.data))
      .catch(error => console.error("Error fetching alarms:", error));

    const checkAlarms = () => {
      const now = new Date();
      const turkeyTime = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' }).format(now);
      const currentTime = turkeyTime; // Format: "HH:MM"
      const currentDay = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: 'Europe/Istanbul' }).format(now);

      alarms.forEach(alarm => {
        if (alarm.time === currentTime && alarm.days.includes(currentDay)) {
          alert(`Time for: ${alarm.description}!`);
        }
      });
    };

    const intervalId = setInterval(checkAlarms, 1000); // Check every minute

    return () => clearInterval(intervalId);
  }, [alarms]);

  const handleNewAlarmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;  // Type assertion here
    const { name, value, checked } = target;  // Now you can safely access 'checked'

    if (name === "days") {
      if (checked) {
        setNewAlarm(prev => ({ ...prev, days: [...prev.days, value] }));
      } else {
        setNewAlarm(prev => ({ ...prev, days: prev.days.filter(day => day !== value) }));
      }
    } else {
      setNewAlarm(prev => ({ ...prev, [name]: value }));
    }
  };


  const handleNewAlarmSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios.post("http://localhost:5000/api/alarms", newAlarm, {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
    })
      .then(response => {
        setAlarms([...alarms, response.data]);
        setNewAlarm({ time: "", days: [], description: "" }); // Reset form
      })
      .catch(error => console.error("Error creating alarm:", error));
  };

  const handleDeleteAlarm = (alarmId: string) => {
    axios.delete(`http://localhost:5000/api/delete-alarm/${alarmId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
    })
      .then(() => {
        setAlarms(alarms.filter(alarm => alarm._id !== alarmId));
      })
      .catch(error => console.error("Error deleting alarm:", error));
  };

  const handleEditAlarm = (updatedAlarm: Alarm) => {
    axios.put(`http://localhost:5000/api/update-alarm/${updatedAlarm._id}`, updatedAlarm, {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
    })
      .then(response => {
        setAlarms(alarms.map(alarm => alarm._id === updatedAlarm._id ? response.data : alarm));
      })
      .catch(error => console.error("Error updating alarm:", error));
  };

  return (
    <>
      <Navbar />
      <button onClick={() => navigate("/login")} style={{ position: "absolute", top: 20, right: 20, backgroundColor: "transparent", border: "none", cursor: "pointer" }}>
        <img src={LogoutIcon} alt="Logout Icon" />
      </button>
      <div className="row h-100" style={{ backgroundColor: "#F1EFEF", paddingTop: "60px" }}>
        <Sidebar />
        <div className="col-9 ms-5">
          <form onSubmit={handleNewAlarmSubmit} className="alarm-form">
            <h2>Create New Alarm</h2>
            <label>Time:</label>
            <input type="time" name="time" value={newAlarm.time} onChange={handleNewAlarmChange} required />
            <label>Description:</label>
            <input type="text" name="description" value={newAlarm.description} onChange={handleNewAlarmChange} required />
            <fieldset>
              <legend>Days</legend>
              {daysOfWeek.map(day => (
                <label key={day}>
                  <input type="checkbox" name="days" value={day} checked={newAlarm.days.includes(day)} onChange={handleNewAlarmChange} />
                  {day}
                </label>
              ))}
            </fieldset>
            <button type="submit" className="btn btn-primary">Add Alarm</button>
          </form>
          <div className="alarms-container">
            {alarms.map(alarm => (
              <ReminderCard key={alarm._id} alarm={alarm} onDelete={handleDeleteAlarm} onEdit={handleEditAlarm} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Reminders;
