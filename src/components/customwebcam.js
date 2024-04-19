import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { imageDb } from "../config";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

import './index.css'

const CustomWebcam = () => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [location, setLocation] = useState(null);
  const [imgurl, setImgurl] = useState([]);
  const [facingMode, setFacingMode] = useState("user"); // "user" for front camera, "environment" for rear camera

  useEffect(() => {
    const fetchData = async () => {
      const imgs = await listAll(ref(imageDb, "files"));
      const urls = await Promise.all(imgs.items.map((val) => getDownloadURL(val)));
      setImgurl(urls);
    };
    fetchData();
  }, []);

  const capturePhoto = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    try {
      const position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );
      const { latitude, longitude } = position.coords;
      setLocation({ latitude, longitude });
    } catch (error) {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const retakePhoto = () => {
    setImgSrc(null);
    setLocation(null);
  };

  const handleUpload = async () => {
    if (imgSrc) {
      try {
        const blob = await fetch(imgSrc).then((res) => res.blob());
        const imgRef = ref(imageDb, `files/${uuidv4()}.png`);
        await uploadBytes(imgRef, blob);
        console.log("Image uploaded successfully.");
        // Reload the page to see the updated images
        window.location.reload();
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const toggleFacingMode = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  const renderCapturedImage = () => (
    <>
      <img src={imgSrc} alt="webcam" />
      {location && (
        <p>
          Latitude: {location.latitude}, Longitude: {location.longitude}
        </p>
      )}
    </>
  );

  return (
    <div className="container">
      <h1>camera</h1>
      {imgSrc ? renderCapturedImage() : <Webcam height={600} width={600} ref={webcamRef} videoConstraints={{ facingMode }} />}
      <div className="btn-container">
        {imgSrc ? (
          <>
            <button onClick={retakePhoto}>Retake photo</button>
            <button onClick={handleUpload}>Upload</button>
          </>
        ) : (
          <>
            <button onClick={capturePhoto}>Capture photo</button>
            <button onClick={toggleFacingMode}>Switch Camera</button>
          </>
        )}
      </div>
      <br />
      <div className="image-container">
        {imgurl.map((url) => (
          <div key={url}>
            <img src={url} alt="kesava" width="200px" />
            <br />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomWebcam;