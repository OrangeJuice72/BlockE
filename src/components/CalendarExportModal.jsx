const CalendarExportModal = ({ isOpen, time, onTimeChange, onCancel, onConfirm }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="calendar-export-title">
        <h2 id="calendar-export-title">Calendar Event Time</h2>
        <p className="subtitle">Choose the time for the calendar event before exporting it.</p>

        <div className="input-group" style={{ marginBottom: '20px' }}>
          <label className="date-label" htmlFor="calendarExportTime">Event Time</label>
          <input
            type="time"
            id="calendarExportTime"
            value={time}
            onChange={(e) => onTimeChange(e.target.value)}
          />
        </div>

        <div className="modal-actions">
          <button type="button" className="secondary-button modal-button" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="modal-button" onClick={onConfirm}>
            Add to Calendar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarExportModal;
