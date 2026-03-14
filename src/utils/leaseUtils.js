export const getLeases = () => JSON.parse(localStorage.getItem('leases') || '[]');

export const saveLease = (tenant, unit, date, rent) => {
  const leases = getLeases();
  leases.push({ id: Date.now(), tenant, unit, date, rent });
  localStorage.setItem('leases', JSON.stringify(leases));
};

export const deleteLease = (id) => {
  const leases = getLeases().filter(l => l.id !== id);
  localStorage.setItem('leases', JSON.stringify(leases));
};

export const generateICS = (tenant, unit, dateVal, rent) => {
  const dateObj = new Date(dateVal + 'T09:00:00');
  
  const formatICSDate = (d) => {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const dtStart = formatICSDate(dateObj);
  const endObj = new Date(dateObj.getTime() + 60 * 60 * 1000);
  const dtEnd = formatICSDate(endObj);

  const displayLabel = `${tenant} - ${unit}`;
  const rentDisplay = rent ? `\nMonthly Rent: $${rent}` : "";

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Lease Tracker App//EN
BEGIN:VEVENT
UID:${Date.now()}@leasetracker.local
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${dtStart}
DTEND:${dtEnd}
SUMMARY:Lease Due: ${displayLabel}
DESCRIPTION:Friendly reminder that the lease for ${tenant} (${unit}) is up!${rentDisplay}
BEGIN:VALARM
TRIGGER:-P1W
ACTION:DISPLAY
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Lease_${displayLabel.replace(/\s+/g, '_')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
