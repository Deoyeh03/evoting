import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { useState, useRef, useEffect } from 'react';
import './Home.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from '../Firebase';
import { collection, addDoc } from "firebase/firestore";
import { isEligibleToSignUp } from '../Logic';
import * as faceapi from 'face-api.js';

export default function Home() {
  const [formData, setFormData] = useState({
    matric_number: '',
    name: '',
    course: '',
    year_of_admission: '',
    email: '',
    password: '',
    faceImage: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();
  const [userType, setUserType] = useState('user');

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = `${process.env.PUBLIC_URL}/models`;
      try {
        console.log("Loading SSD Mobilenet v1...");
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
    console.log("Loaded SSD Mobilenet v1");

    console.log("Loading Face Landmark 68...");
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    console.log("Loaded Face Landmark 68");

    console.log("Loading Face Recognition...");
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    console.log("Loaded Face Recognition");

    console.log("All models loaded successfully");
  } catch (err) {
    console.error('Error loading models:', err);
    setErrorMessage('Failed to load face detection models. Please check the model paths.');
  }
};

    loadModels();
  }, []);

  const handleChange = (e) => {
    console.log(`Changing field: ${e.target.name}, Value: ${e.target.value}`);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);

    if (!isEligibleToSignUp(formData.matric_number)) {
      setErrorMessage('You are not eligible to sign up. Please check your matric number.');
      return;
    }

    setLoading(true);
    console.log("Creating user...");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      console.log('User registered:', user);
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        matric_number: formData.matric_number,
        name: formData.name,
        course: formData.course,
        year_of_admission: formData.year_of_admission,
        faceImage: formData.faceImage,
      });

      console.log('User data saved to Firestore:', formData);
      navigate('/voting');
    } catch (error) {
      console.error('Error during signup:', error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const startCamera = () => {
    console.log("Starting camera...");
    setCameraActive(true);
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        console.log("Camera access granted");
      })
      .catch((err) => {
        console.error("Error accessing camera: ", err);
        setErrorMessage('Unable to access the camera. Please allow camera permissions.');
      });
  };

  const captureImage = () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, 300, 300);
    const imageData = canvasRef.current.toDataURL('image/png');
    setFormData({ ...formData, faceImage: imageData });
    console.log('Captured Image Data:', imageData);
  };

  useEffect(() => {
    return () => {
      if (cameraActive) {
        const currentVideoRef = videoRef.current;
        const stream = currentVideoRef?.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop());
          console.log("Camera stream stopped");
        }
      }
    };
  }, [cameraActive]);

  return (
    <Layout>
      <div className="home-container">
        <main className="main-content">
          <h1 className="title">Welcome to the E-Voting Platform</h1>
          <p className="description">
            Secure and easy online voting for students and staff. Log in or sign up to get started!
          </p>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          {userType === 'user' ? (
            <form onSubmit={handleSubmit} className="signup-form">
              <TextField
                label="Matric Number"
                variant="outlined"
                name="matric_number"
                fullWidth
                value={formData.matric_number}
                onChange={handleChange}
                required
              />
              <TextField
                label="Name"
                variant="outlined"
                name="name"
                fullWidth
                value={formData.name}
                onChange={handleChange}
                required
              />
              <TextField
                label="Course"
                variant="outlined"
                name="course"
                fullWidth
                value={formData.course}
                onChange={handleChange}
                required
              />
              <TextField
                label="Year of Admission"
                variant="outlined"
                name="year_of_admission"
                type="number"
                fullWidth
                value={formData.year_of_admission}
                onChange={handleChange}
                required
              />
              <TextField
                label="Email"
                variant="outlined"
                name="email"
                type="email"
                fullWidth
                value={formData.email}
                onChange={handleChange}
                required
              />
              <TextField
                label="Password"
                variant="outlined"
                name="password"
                type="password"
                fullWidth
                value={formData.password}
                onChange={handleChange}
                required
              />
              <div className="mb-4">
                {cameraActive ? (
                  <>
                    <video ref={videoRef} width="300" height="300" className="border mb-4" />
                    <Button variant="contained" color="secondary" onClick={captureImage} fullWidth>
                      Capture Image
                    </Button>
                    <canvas ref={canvasRef} style={{ display: 'none' }} width="300" height="300"></canvas>
                  </>
                ) : (
                  <Button variant="contained" color="secondary" onClick={startCamera} fullWidth>
                    Start Camera
                  </Button>
                )}
              </div>
              {formData.faceImage && (
                <div className="mb-4">
                  <h4>Captured Image:</h4>
                  <img src={formData.faceImage} alt="Captured face" className="border" width="300" height="300" />
                </div>
              )}
              <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                {loading ? 'Signing Up...' : 'Sign Up'}
              </Button>
            </form>
          ) : null}

          <h3 className='already-have_account'>Already have an account?</h3>
          <div className="button-container">
            <Link to="/signin">
              <button className="sign-in-button">Sign In</button>
            </Link>
          </div>

          <div className="admin-login-prompt">
            <h2>Admin Login</h2>
            <Link to="/admin-auth">
              <Button variant="contained" color="primary" fullWidth>
                Go to Admin Login
              </Button>
            </Link>
          </div>
        </main>
        <footer className="footer">
          <p>&copy; 2024 E-Voting Platform</p>
        </footer>
      </div>
    </Layout>
  );
}
