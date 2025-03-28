import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Search, Plane, MapPin, Loader2, DollarSign, Scale, Crown, Calendar, Clock } from 'lucide-react';
import Results from './components/Results';

const flightClasses = [
  { id: 'economy', name: 'Economy', price: '$' },
  { id: 'business', name: 'Business', price: '$$' },
  { id: 'first', name: 'First Class', price: '$$$' }
];

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TravelSearchHero />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
};

const TravelSearchHero = () => {
  const navigate = useNavigate();
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTier, setSelectedTier] = useState('balanced');
  const [departureDate, setDepartureDate] = useState('');
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [searchResult, setSearchResult] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    setSearchResult(null);
    setShowFollowUp(false);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromLocation,
          to: toLocation,
          tier: selectedTier,
          departureDate
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch flight details');
      }

      const data = await response.json();
      navigate('/results', { state: { searchResult: data } });
      setShowFollowUp(true);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

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
        {/* Navbar */}
        <nav className="flex justify-between items-center mb-20">
          <div className="flex items-center gap-2 text-white/80">
            <Plane className="w-6 h-6" />
            <span className="text-xl font-semibold">zplor</span>
          </div>
          <div className="flex gap-8 items-center">
            <button className="py-2 px-4 rounded-full bg-white/10 text-white border-none cursor-pointer transition-colors duration-300 hover:bg-white/20">
              Sign In
            </button>
          </div>
        </nav>

        {/* Hero Text */}
        <div className="text-center mb-8">
          <h1 className="text-[3.5rem] font-bold mb-4 leading-tight text-white">
            Plan your next
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent"> journey</span>
            <br />with AI 
          </h1>
          <p className="text-lg text-white/60 max-w-lg mx-auto">
            Experience the future of travel planning. Powered by AI to create your perfect itinerary.
          </p>
        </div>

        {/* Search Bar - Moved up */}
        <form onSubmit={handleSearch} className="relative max-w-3xl mx-auto mb-8 group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 rounded-2xl blur-[15px] opacity-50 transition-opacity duration-300 group-hover:opacity-75"></div>
          <div className="relative flex items-center bg-black/80 backdrop-blur-md rounded-2xl p-2">
            <div className="flex-1 flex items-center gap-4">
              <div className="flex items-center flex-1">
                <MapPin className="ml-4" size={20} color="rgba(255,255,255,0.4)" />
                <input
                  type="text"
                  placeholder="From where?"
                  className="flex-1 bg-transparent border-none text-white py-3 px-3 text-base placeholder:text-white/40 focus:outline-none focus:ring-0"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  required
                />
              </div>
              <div className="w-px h-6 bg-white/20"></div>
              <div className="flex items-center flex-1">
                <MapPin className="ml-4" size={20} color="rgba(255,255,255,0.4)" />
                <input
                  type="text"
                  placeholder="To where?"
                  className="flex-1 bg-transparent border-none text-white py-3 px-3 text-base placeholder:text-white/40 focus:outline-none focus:ring-0"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  required
                />
              </div>
              <div className="w-px h-6 bg-white/20"></div>
              <div className="flex items-center flex-1">
                <Calendar className="ml-4" size={20} color="rgba(255,255,255,0.4)" />
                <input
                  type="date"
                  className="flex-1 bg-transparent border-none text-white py-3 px-3 text-base placeholder:text-white/40 focus:outline-none focus:ring-0 [color-scheme:dark]"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  required
                />
              </div>
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 py-2 px-5 bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 border-none rounded-xl text-white font-medium cursor-pointer transition-all duration-300 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Planning...
                </>
              ) : (
                <>
                  Let's Go
                  <Plane className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Travel Preferences */}
        <div className="max-w-2xl mx-auto mb-4">
          <h3 className="text-white/60 text-sm mb-2 text-center">Travel Preference</h3>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setSelectedTier('budget')}
              className={`flex items-center gap-2 py-2 px-4 rounded-xl backdrop-blur-md transition-all duration-300
                ${selectedTier === 'budget' 
                  ? 'bg-black/60 border-2 border-blue-400 scale-105' 
                  : 'bg-black/40 border border-white/10 hover:bg-black/50'}`}
            >
              <DollarSign className="w-4 h-4 text-blue-400" />
              <span className="text-white font-medium">Budget</span>
              <span className="text-white/60 text-sm ml-1">(Economy)</span>
            </button>

            <button
              onClick={() => setSelectedTier('balanced')}
              className={`flex items-center gap-2 py-2 px-4 rounded-xl backdrop-blur-md transition-all duration-300
                ${selectedTier === 'balanced' 
                  ? 'bg-black/60 border-2 border-purple-400 scale-105' 
                  : 'bg-black/40 border border-white/10 hover:bg-black/50'}`}
            >
              <Scale className="w-4 h-4 text-purple-400" />
              <span className="text-white font-medium">Balanced</span>
              <span className="text-white/60 text-sm ml-1">(Business)</span>
            </button>

            <button
              onClick={() => setSelectedTier('premium')}
              className={`flex items-center gap-2 py-2 px-4 rounded-xl backdrop-blur-md transition-all duration-300
                ${selectedTier === 'premium' 
                  ? 'bg-black/60 border-2 border-teal-400 scale-105' 
                  : 'bg-black/40 border border-white/10 hover:bg-black/50'}`}
            >
              <Crown className="w-4 h-4 text-teal-400" />
              <span className="text-white font-medium">Premium</span>
              <span className="text-white/60 text-sm ml-1">(First Class)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="w-full">
        {searchResult && !loading && (
          <div className="max-w-4xl mx-auto mt-8 p-6 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Flight Details</h2>
              <div className="flex items-center gap-2 text-white/60 mb-4">
                <span>{searchResult.from}</span>
                <Plane className="w-4 h-4 mx-2" />
                <span>{searchResult.to}</span>
                <span className="ml-4 px-3 py-1 bg-white/10 rounded-full text-sm">{searchResult.flightClass}</span>
              </div>
              <div className="prose prose-invert max-w-none">
                <div style={{ whiteSpace: 'pre-line' }}>{searchResult.flightDetails}</div>
              </div>
            </div>

            {showFollowUp && (
              <div className="mt-8 border-t border-white/10 pt-6">
                <h3 className="text-xl font-semibold text-white mb-4">Need more travel information?</h3>
                <div className="grid grid-cols-2 gap-4">
                  {searchResult.followUpSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="p-4 bg-white/5 hover:bg-white/10 rounded-xl text-left text-white/80 transition-colors duration-300"
                      onClick={() => console.log('Follow-up:', suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {searchResult.references && searchResult.references.length > 0 && (
              <div className="mt-6 border-t border-white/10 pt-6">
                <h3 className="text-lg font-semibold text-white/80 mb-3">References</h3>
                <div className="space-y-2">
                  {searchResult.references.map((ref, index) => (
                    <a
                      key={index}
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-400 hover:text-blue-300 transition-colors duration-300"
                    >
                      {ref.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="max-w-4xl mx-auto p-6 bg-red-500/20 backdrop-blur-md rounded-xl border border-red-500/30 text-white mb-10">
            <h3 className="text-xl font-semibold mb-2">Error</h3>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;