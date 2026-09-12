import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import FindDoctors from './pages/FindDoctors/FindDoctors';
import DoctorProfile from './pages/DoctorProfile/DoctorProfile';
import SymptomChecker from './pages/SymptomChecker/SymptomChecker';
import MyBookings from './pages/MyBookings/MyBookings';
import Profile from './pages/Profile/Profile';
import Contact from './pages/Contact/Contact';
import NotFound from './pages/NotFound/NotFound';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="find-doctors" element={<FindDoctors />} />
          <Route path="doctors/:id" element={<DoctorProfile />} />
          <Route path="symptom-checker" element={<SymptomChecker />} />
          <Route path="contact" element={<Contact />} />
          <Route element={<ProtectedRoute />}>
            <Route path="my-bookings" element={<MyBookings />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
