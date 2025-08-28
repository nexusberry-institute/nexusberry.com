
const EventLeadsAttendanceStatus: React.FC<{ value: any[] }> = ({ value }) => {
  // Get eventId from URL
  const eventId = typeof window !== "undefined" ? window.location.pathname.split("/").pop() : "";

  if (!Array.isArray(value)) return null;

  return (
    <div>
      <table className="min-w-full text-sm border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Lead ID</th>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Phone</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Attendance Status</th>
          </tr>
        </thead>
        <tbody>
          {value.map((lead: any, idx: number) => {
            // Find attendance for this event
            const attendance = lead.eventAttendance?.find((ea: any) => {
              const leadEventId = typeof ea.event === "object" ? ea.event.id : ea.event;
              return leadEventId === eventId;
            });
            const hasAttended = attendance?.hasAttended ? "Attended" : "Not Attended";
            return (
              <tr key={lead.id || idx}>
                <td className="border px-2 py-1">{lead.id || "-"}</td>
                <td className="border px-2 py-1">{lead.name || "-"}</td>
                <td className="border px-2 py-1">{lead.mobile || "-"}</td>
                <td className="border px-2 py-1">{lead.email || "-"}</td>
                <td className="border px-2 py-1">{attendance ? hasAttended : "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export { EventLeadsAttendanceStatus };
