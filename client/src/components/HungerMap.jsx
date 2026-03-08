import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "https://ai-powered-hunger-hotspot-detection-and.onrender.com/api";

function HungerMap() {

  const [reports, setReports] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}/reports`)
      .then(res => {
        setReports(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <MapContainer center={[19.9975, 73.7898]} zoom={13} style={{ height: "500px", width: "100%" }}>
      
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {reports.map((report) => (
        <Marker key={report._id} position={[report.latitude, report.longitude]}>
          
          <Popup>
            <h3>{report.title}</h3>
            <p>{report.description}</p>
            <p><b>People Affected:</b> {report.peopleAffected}</p>
          </Popup>

        </Marker>
      ))}

    </MapContainer>
  );
}

export default HungerMap;