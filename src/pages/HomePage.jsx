
import logo from '../images/logo.png'; // Make sure you have a logo image in this path
import background from '../images/background.jpg'; // Background image path
import Navbar from '../components/Navbar';

const HomePage = () => {


  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* Add the Navbar */}
      <Navbar />
      
      <div className="absolute inset-0 bg-black/60 flex items-center justify-center px-4">
        <div className="max-w-3xl text-center text-white space-y-6 mt-20">
          <img src={logo || "/placeholder.svg"} alt="Logo" className="mx-auto w-28 h-28 rounded-full shadow-lg" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-wide">Report System</h1>
          <p className="text-lg md:text-xl">
            A secure and efficient crime reporting platform designed to help citizens report
            incidents in real-time and assist law enforcement in maintaining public safety.
          </p>
         
        </div>
      </div>
    </div>
  );
};

export default HomePage;
