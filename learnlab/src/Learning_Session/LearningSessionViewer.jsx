import React, { useEffect, useState } from "react";

const AllLearningSessions = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/public/getAllSession")
      .then((res) => res.json())
      .then((data) => setSessions(data))
      .catch((err) => console.error("Error fetching sessions:", err));
  }, []);

  if (sessions.length === 0) return <p>Loading sessions...</p>;

  return (
    <div className="p-4 space-y-6">
      {sessions.map((session) => (
        <div
          key={session.id}
          className="border border-gray-300 p-4 rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-bold mb-2">{session.sessionTitle}</h2>
          <p className="mb-2 text-gray-700">{session.description}</p>
          <p>
            <strong>Start:</strong> {session.startDate} {session.startTime}
          </p>
          <p>
            <strong>End:</strong> {session.endDate} {session.endTime}
          </p>

          {session.videoBase64 ? (
            <video
              width="640"
              height="360"
              controls
              className="mt-4"
              src={`data:video/mp4;base64,${session.videoBase64}`}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <p className="mt-4 text-red-500">No video available.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default AllLearningSessions;
