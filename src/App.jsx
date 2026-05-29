import { useState } from "react";
import { cities } from "./data/locations";

const MAP_WIDTH = 1578;
const MAP_HEIGHT = 996;

export default function App() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [lastClick, setLastClick] = useState(null);

  const handleMapClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const mapX = Math.round((clickX / rect.width) * MAP_WIDTH);
    const mapY = Math.round((clickY / rect.height) * MAP_HEIGHT);

    setLastClick({ x: mapX, y: mapY });
    console.log(`x: ${mapX}, y: ${mapY}`);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#020617",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px",
        color: "white",
        overflow: "auto",
      }}
    >
      <div
        style={{
          display: "internal",
          gap: "12px",
          width: "100%",
          maxWidth: "2100px",
          tramsform: "scale(2)",
          transformOrigin: "center center",
        }}
      >
        <div
          onClick={handleMapClick}
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "1578 / 996",
            overflow: "hidden",
            borderRadius: "16px",
            border: "1px solid #334155",
            boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
            backgroundColor: "#111827",
          }}
        >
          <img
            src="/Trioka-and-the-Grey.jpg"
            alt="Map of Trioka"
            draggable="false"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              userSelect: "none",
              pointerEvents: "none",
            }}
          />

          {lastClick && (
            <div
              style={{
                position: "absolute",
                left: "12px",
                top: "12px",
                zIndex: 20,
                backgroundColor: "rgba(0,0,0,0.8)",
                padding: "8px 12px",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            >
              x: {lastClick.x}, y: {lastClick.y}
            </div>
          )}

          {cities.map((city) => {
            const isSelected = selectedCity?.id === city.id;

            return (
              <button
                key={city.id}
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedCity(city);
                }}
                title={city.name}
                style={{
                  position: "absolute",
                  left: `${(city.x / MAP_WIDTH) * 100}%`,
                  top: `${(city.y / MAP_HEIGHT) * 100}%`,
                  transform: "translate(-50%, -50%)",
                  width: "16px",
                  height: "16px",
                  borderRadius: "999px",
                  border: "2px solid black",
                  backgroundColor: isSelected ? "#ffee00" : "#8a0606",
                  boxShadow: isSelected
                    ? "0 0 0 4px rgba(255, 196, 0, 0.5), 0 4px 10px rgba(0,0,0,0.3)"
                    : "0 4px 10px rgba(0,0,0,0.3)",
                  cursor: "pointer",
                  zIndex: 10,
                }}
              />
            );
          })}
        </div>

        <aside
          style={{
            width: "500px",
            minWidth: "280px",
            backgroundColor: "#3d0f0f",
            border: "0.5px solid #1a0206",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
          }}
        >
          {selectedCity ? (
            <>
              <p style={{ color: "#fcd34d", fontSize: "14px", margin: 0 }}>
                {selectedCity.type}
              </p>

              <h2 style={{ fontSize: "28px", marginTop: "8px" }}>
                {selectedCity.name}
              </h2>

              {selectedCity.portraits && (
                <img
                  src={selectedCity.portraits}
                  alt={`${selectedCity.name} portraits`}
                  style={{
                    width: "100%",
                    height: "300px",
                    objectFit: "contain",
                    borderRadius: "6px",
                    border: "1px solid #3b0b0b",
                    marginTop: "12px",
                    marginBottom: "12px",
                  }}
                />
              )}

              <p style={{ color: "#cbd5e1", lineHeight: 1.6 }}>
                {selectedCity.description}
              </p>
            </>
          ) : (
            <>
              <h2 style={{ fontSize: "28px", marginTop: 0 }}>Trioka Map</h2>

              <p style={{ color: "#cbd5e1", lineHeight: 1.6 }}>
                Click a city marker to view its information.
              </p>

              <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: 1.6 }}>
                Click empty areas of the map to show x/y coordinates for placing
                new markers.
              </p>
            </>
          )}
        </aside>
      </div>
    </main>
  );
}