import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { Icon } from "leaflet";
import "./Main.css";
import "leaflet/dist/leaflet.css"
//API
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
//MODAL
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function Main() {
  //useState
  const [warning, setWarning] = useState("");
  const [second, setSecond] = useState("");
  //Modal
  const [show, setShow] = useState(false); //set to false-we dont want it to show itself auto
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [selectedMarker, setSelectedMarker] = useState(null);

  //Functions to retrive the data from API
  const getWarnings = () => {
    axios
      .get("https://environment.data.gov.uk/flood-monitoring/id/floods")
      .then((res) => {
        const newAlert = res.data.items;
        setWarning(newAlert);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getLocations = () => {
    axios
      .get("https://environment.data.gov.uk/flood-monitoring/id/floodAreas")
      .then((resp) => {
        const newLoc = resp.data.items;
        setSecond(newLoc);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //UseEffect to run the functions
  useEffect(() => {
    getLocations();
    getWarnings();
  }, []);


  //haha
  const handleClick = (warning) => {
    setSelectedMarker(warning);
  };

  //THE RETURN RENDER METHOD
  return (
    <div>
      <MapContainer
        center={[52.90330510839568, -1.1862272800848968]}
        zoom={7}
        scrollWheelZoom={true}
        style={{
          height: "90vh",
          width: "100vw",
          top: "10px",
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* To match ID code between the APIs */}
        {warning &&
          second &&
          warning.map((warningItem) => {
            const locationItem = second.find(
              (loc) => loc.fwdCode === warningItem.floodAreaID
            );
            if (locationItem) {
              return (
                <Marker
                  key={locationItem.fwdCode}
                  position={[locationItem.lat, locationItem.long]}
                  icon={
                    new Icon({
                      iconUrl: markerIconPng,
                      iconSize: [30, 45],
                      iconAnchor: [12, 41],
                    })
                  }
                >
                  <Popup>
                    <p>{warningItem.message}</p>
                    <button onClick={() => setSelectedMarker(warningItem)}
                        style={{
                          backgroundColor: 'lightblue',
                          borderRadius: '5px',
                          color: 'white',
                          padding: '8px 16px', 
                          border: 'none', 
                          cursor: 'pointer' 
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'lightskyblue'} 
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'lightblue'}
                    >
                      More Info
                    </button>
                  </Popup>
                </Marker>
              );
            }
            return null;
          })}




{selectedMarker && (
          <Modal
            show={true}
            onHide={() => setSelectedMarker(null)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Warning Details</Modal.Title>
            </Modal.Header>
    
            <Modal.Body>
  
              {/* BOX ONE */}
              <div>
                <h3>Description</h3>
                <p>{selectedMarker.description}</p>
              </div>

              {/* BOX Two */}
              <div>
                <h3>Env-Agency Area</h3>
                <p>{selectedMarker.eaAreaName}</p>
              </div>
              {/* BOX Three */}

              <div>
                <h3>County</h3>

                <p>{selectedMarker.floodArea.county}</p>
              </div>
              {/* BOX Four */}
              <div>
                <h3>Notation</h3>
                <p>{selectedMarker.floodArea.notation}</p>
              </div>
              {/* BOX Five */}
              <div>
                <h3>River / Sea</h3>
                <p>{selectedMarker.floodArea.riverOrSea}</p>
              </div>
              {/* BOX SIX */}
              <div>
                <h3>Flood Area ID</h3>
                <p>{selectedMarker.floodAreaID}</p>
              </div>
              {/* BOX Seven */}
              <div>
                <h3>Tidal</h3>
                <p>{selectedMarker.isTidal ? 'True' : 'False'}</p>
              </div>
              {/* BOX Eight */}
              <div>
                <h3>Severity</h3>
                <p>{selectedMarker.severity}</p>
              </div>
              {/* BOX Nine */}
              <div>
                <h3>Severity Level</h3>
                <p>{selectedMarker.severityLevel}</p>
              </div>
              {/* BOX Ten */}
              <div>
                <h3>Message Changed</h3>
                <p>{selectedMarker.timeMessageChanged}</p>
              </div>
              {/* BOX Eleven */}
              <div>
                <h3>Time Alert Raised</h3>
                <p>{selectedMarker.timeRaised}</p>
              </div>
              {/* BOX Twelve */}
              <div>
                <h3>Severity Changed</h3>
                <p>{selectedMarker.timeSeverityChanged}</p>
              </div>
              <div class="half-width">
                <h3>Message From Station</h3>
                <p>{selectedMarker.message}</p>
              </div>
                      

            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setSelectedMarker(null)}

                style={{
                  backgroundColor: 'lightblue',
                  borderRadius: '5px',
                  color: 'white',
                  padding: '8px 16px', 
                  border: 'none', 
                  cursor: 'pointer' 
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'lightskyblue'} 
                onMouseLeave={(e) => e.target.style.backgroundColor = 'lightblue'}
              >
                Close
              </Button>
            </Modal.Footer> 
          </Modal>
        )}
      </MapContainer>




















    </div>
  );
}

export default Main;