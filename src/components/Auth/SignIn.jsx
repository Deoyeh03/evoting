import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { db } from '../../Firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import * as faceapi from 'face-api.js';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [capturedFaceImage, setCapturedFaceImage] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = `${process.env.PUBLIC_URL}/models`;
      console.log(`Loading models from: ${MODEL_URL}`);
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        console.log('Models loaded successfully');
      } catch (error) {
        console.error('Error loading models:', error);
      }
    };

    loadModels();
  }, []);

  const fetchUserFaceImage = async (email) => {
    const userQuery = query(collection(db, 'users'), where('email', '==', email));
    const userSnapshot = await getDocs(userQuery);
    if (!userSnapshot.empty) {
      return userSnapshot.docs[0].data().faceImage;
    }
    return null;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const userFaceImage = await fetchUserFaceImage(email);
      if (!userFaceImage) {
        setErrorMessage('No face image found for this user');
        return;
      }

      const capturedImage = await faceapi.fetchImage(capturedFaceImage);
      const storedImage = await faceapi.fetchImage(userFaceImage);

      const labeledDescriptors = [
        new faceapi.LabeledFaceDescriptors('user', await faceapi.detectFaceLandmarks(storedImage))
      ];

      const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors);
      const bestMatch = faceMatcher.findBestMatch(await faceapi.detectFaceLandmarks(capturedImage));

      if (bestMatch.label === 'unknown') {
        setErrorMessage('Face does not match. Please try again.');
      } else {
        navigate('/voting');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage(error.message);
    }
  };

  const startCamera = () => {
    setCameraActive(true);
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch((err) => {
        console.error("Error accessing camera: ", err);
        setErrorMessage('Unable to access the camera. Please allow camera permissions.');
      });
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/png');
    setCapturedFaceImage(imageData);
  };

  useEffect(() => {
    return () => {
      if (cameraActive) {
        const currentVideoRef = videoRef.current; // Store ref value
        if (currentVideoRef) {
          const stream = currentVideoRef.srcObject;
          if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
          }
        }
      }
    };
  }, [cameraActive]);

  return (
    <div className="sign-in-container">
      <h1>Sign In</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleLogin}>
        <TextField label="Email" variant="outlined" type="email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} required />
        <TextField label="Password" variant="outlined" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} required />
        <div>
          {cameraActive ? (
            <>
              <video ref={videoRef} width="300" height="300" autoPlay />
              <Button variant="contained" color="secondary" onClick={captureImage}>Capture Image</Button>
              <canvas ref={canvasRef} style={{ display: 'none' }} width="300" height="300"></canvas>
            </>
          ) : (
            <Button variant="contained" color="secondary" onClick={startCamera}>Start Camera</Button>
          )}
        </div>
        <Button type="submit" variant="contained" color="primary" fullWidth>Sign In</Button>
      </form>
      <h3>Don't have an account?</h3>
      <Link to="/"><button>Sign Up</button></Link>
    </div>
  );
}
