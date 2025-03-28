import React from 'react';
import { Plane, MapPin, Calendar, Clock, DollarSign, Crown } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Results = () => {
  const location = useLocation();
  const searchResult = location.state?.searchResult;
  if (!searchResult) return null;

  const { from, to, flightDetails, flightClass, followUpSuggestions, references } = searchResult;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-start p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400 via-purple-400 to-teal-400 blur-[80px] opacity-20 animate-[scale_8s_infinite_alternate_ease-in-out,rotate_15s_infinite_linear]"></div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600 via-purple-700 to-teal-500 blur-[80px] opacity-20 animate-[scale_8s_infinite_alternate-reverse_ease-in-out,rotate_20s_infinite_linear_reverse]"></div>
      </div>
      <div className="absolute inset-0 opacity-15 mix-blend-soft-light bg-noise"></div>

      {/* Content */}
      <div className="max-w-[1200px] w-full mx-auto relative z-10">
        <div className="flex items-center justify-center space-x-4 text-white/60 mb-8">
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            <span className="text-lg">{from}</span>
          </div>
          <Plane className="w-5 h-5 text-purple-400" />
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            <span className="text-lg">{to}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8">
          <div className="space-y-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 rounded-2xl blur-[15px] opacity-50 transition-opacity duration-300 group-hover:opacity-75"></div>
              <div className="relative bg-black/80 backdrop-blur-md rounded-2xl p-6">
                <div className="prose max-w-none">
                  <div className="text-lg text-white/80 leading-relaxed space-y-4">
                    <p className="font-medium text-white">Here's what I've found for your {flightClass} class flight:</p>
                    <div className="whitespace-pre-wrap">{flightDetails}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-teal-400 rounded-2xl blur-[15px] opacity-50 transition-opacity duration-300 group-hover:opacity-75"></div>
              <div className="relative bg-black/80 backdrop-blur-md rounded-2xl p-6">
                <h2 className="text-xl font-medium mb-4 text-white">You might also want to consider:</h2>
                <ul className="space-y-3">
                  {followUpSuggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-center space-x-2 text-white/80 hover:text-purple-400 cursor-pointer transition-colors duration-200">
                      <span>•</span>
                      <span className="text-lg">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="relative group h-fit sticky top-4">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-400 rounded-xl blur-[10px] opacity-50 transition-opacity duration-300 group-hover:opacity-75"></div>
            <div className="relative bg-black/80 backdrop-blur-md rounded-xl p-6">
              <h2 className="text-xl font-medium mb-4 text-white">Top Booking Options</h2>
              <div className="space-y-4">
                {references.slice(0, 5).map((ref, index) => (
                  <a
                    key={index}
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between text-white/80 hover:text-purple-400">
                      <span className="flex-1">{ref.title}</span>
                      <span>→</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
