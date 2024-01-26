import React, { useState } from "react";
import "./ReminderCard.css";

interface Alarm {
  _id: string;
  time: string;
  days: string[];
  description: string;
}

interface ReminderCardProps {
  alarm: Alarm;
  onDelete: (id: string) => void;
  onEdit: (alarm: Alarm) => void;
}

const ReminderCard: React.FC<ReminderCardProps> = ({ alarm, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAlarm, setEditedAlarm] = useState(alarm);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedAlarm({ ...editedAlarm, [name]: value });
  };

  const handleSaveEdit = () => {
    onEdit(editedAlarm);
    setIsEditing(false);
  };

  return (
    <div className="card reminder-card">
      <div className="card-body">
        {isEditing ? (
          <>
            <input type="text" name="description" value={editedAlarm.description} onChange={handleEditChange} />
            <input type="time" name="time" value={editedAlarm.time} onChange={handleEditChange} />
            <div>
              {editedAlarm.days.map((day, index) => (
                <label key={index}>
                  <input type="checkbox" checked={editedAlarm.days.includes(day)} onChange={() => { }} />
                  {day}
                </label>
              ))}
            </div>
            <button onClick={handleSaveEdit}>Save</button>
          </>
        ) : (
          <>
            <h5 className="card-title">{alarm.description}</h5>
            <p className="card-text">Time: {alarm.time}</p>
            <p className="card-text">Days: {alarm.days.join(", ")}</p>
            <div className="card-actions">
              <button onClick={() => setIsEditing(true)} className="edit-button">Edit</button>
              <button onClick={() => onDelete(alarm._id)} className="delete-button">Delete</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReminderCard;
