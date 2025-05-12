
import React from "react";
import { Link } from "react-router-dom"; // Optional: If using React Router
import heroImg from "../assets/plane.png"; // Add an image to assets

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-white flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-20">
        {/* Left */}
        <div className="md:w-1/2 mb-12 md:mb-0">
          <h1 className="text-4xl md:text-6xl font-bold text-sky-800 leading-tight mb-6">
            Book Your Perfect Seat<br />Before You Fly
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Discover, choose, and reserve the best airplane seats tailored to your preferences — fast, simple, and smart.
          </p>
          <Link to="/login">
            <button className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all">
              Start Booking
            </button>
          </Link>
        </div>

        {/* Right */}
        <div className="md:w-1/2">
          <img
            src={heroImg}
            alt="Airplane seating"
            className="w-full rounded-2xl shadow-lg"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-sky-700 mb-12">
            Why Choose Our Seat Booking App?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-sky-50 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-sky-800 mb-2">Real-Time Seat Maps</h3>
              <p className="text-gray-600">
                See exactly which seats are available and pick your favorite spots in real-time.
              </p>
            </div>
            <div className="bg-sky-50 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-sky-800 mb-2">Smart Suggestions</h3>
              <p className="text-gray-600">
                Traveling in groups? Window lover? We recommend the best seats based on your needs.
              </p>
            </div>
            <div className="bg-sky-50 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-sky-800 mb-2">Secure & Fast Booking</h3>
              <p className="text-gray-600">
                No waiting. Confirm your seat instantly and get ready to fly stress-free.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="bg-sky-700 text-white py-12 text-center">
        <h3 className="text-2xl font-semibold mb-4">Ready to book your seat?</h3>
        <Link to="/login">
          <button className="bg-white text-sky-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition-all">
            Reserve Now
          </button>
        </Link>
      </footer>
    </div>
  );
}

export default Landing;
