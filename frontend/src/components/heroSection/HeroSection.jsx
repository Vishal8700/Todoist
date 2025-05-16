import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-5xl font-bold mb-6">Clarity, finally.</h1>
          <p className="text-gray-600 text-xl mb-8">
            Join 50+ million professionals who simplify work and life with the world's #1 to-do list app.
          </p>
          <Link 
            to="/signup" 
            className="bg-red-500 text-white px-8 py-3 rounded-md text-lg hover:bg-red-600"
          >
            Start for free
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            Calm the chaos in a matter of minutes!
          </p>
        </div>
        <div className="md:w-1/2">
          <img 
            src="/app-preview.png" 
            alt="Todoist App Preview" 
            className="w-full rounded-lg shadow-xl"
          />
        </div>
      </div>
      <div className="mt-20 flex justify-center items-center space-x-12">
        <div className="text-center">
          <p className="italic text-gray-700">"Simple, straightforward, and super powerful"</p>
          <img src="/verge-logo.png" alt="The Verge" className="h-8 mt-4" />
        </div>
        <div className="text-center">
          <p className="italic text-gray-700">"The best to-do list app on the market"</p>
          <img src="/pc-mag-logo.png" alt="PC Mag" className="h-8 mt-4" />
        </div>
        <div className="text-center">
          <p className="italic text-gray-700">"Nothing short of stellar"</p>
          <img src="/techradar-logo.png" alt="TechRadar" className="h-8 mt-4" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;