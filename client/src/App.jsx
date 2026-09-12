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
import BookingConfirmation from './pages/BookingConfirmation/BookingConfirmation';
import About from './pages/About/About';
import HealthLibrary from './pages/HealthLibrary/HealthLibrary';
import ArticleDetail from './pages/ArticleDetail/ArticleDetail';
import HelpCentre from './pages/HelpCentre/HelpCentre';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService/TermsOfService';
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
          <Route path="about" element={<About />} />
          <Route path="health-library" element={<HealthLibrary />} />
          <Route path="health-library/:slug" element={<ArticleDetail />} />
          <Route path="help-centre" element={<HelpCentre />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms-of-service" element={<TermsOfService />} />
          <Route element={<ProtectedRoute />}>
            <Route path="my-bookings" element={<MyBookings />} />
            <Route path="profile" element={<Profile />} />
            <Route path="booking-confirmation" element={<BookingConfirmation />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
