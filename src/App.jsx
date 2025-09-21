import { useState } from 'react';
import axios from 'axios';
import './index.css';

function App() {
  const [portfolio, setPortfolio] = useState('');
  const [advice, setAdvice] = useState(null);
  const [usageCounter, setUsageCounter] = useState(0);
  const [loading, setLoading] = useState(false);

  const analyzePortfolio = async (portfolioData) => {
    setLoading(true);
    setAdvice(null); // Clear previous advice
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/analyze_portfolio', {
        portfolio_str: portfolioData,
      });

      // Handle successful response
      setAdvice({
        message: response.data.message,
        riskLevel: response.data.riskLevel,
        suggestedStocks: response.data.suggestedStocks,
      });

      setUsageCounter(prevCount => prevCount + 1);
    } catch (error) {
      // Handle API errors
      console.error("Error analyzing portfolio:", error);
      setAdvice({
        message: "Sorry, something went wrong. Please check your backend terminal.",
        riskLevel: "unknown",
        suggestedStocks: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzePortfolio = (e) => {
    e.preventDefault();
    if (portfolio.trim() === '') {
      alert('Please enter your portfolio.');
      return;
    }
    analyzePortfolio(portfolio);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
          Stock Market Consultant 📈
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Get personalized, simple advice on your portfolio.
        </p>

        <form onSubmit={handleAnalyzePortfolio}>
          <div className="mb-4">
            <label htmlFor="portfolio" className="block text-gray-700 font-semibold mb-2">
              Enter your portfolio (e.g., TCS: 10, Reliance: 5)
            </label>
            <textarea
              id="portfolio"
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="Enter your stocks and quantities..."
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-md text-white font-bold transition-colors ${
              loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Analyzing...' : 'Analyze Portfolio'}
          </button>
        </form>

        {advice && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">My Advice</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{advice.message}</p>
            <div className="flex items-center space-x-4 text-sm font-medium text-gray-500">
              <span>Risk: <span className="text-red-500 font-bold">{advice.riskLevel.toUpperCase()}</span></span>
              <span>Suggested Stocks: <span className="text-indigo-600 font-bold">{advice.suggestedStocks.join(', ')}</span></span>
            </div>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>You have analyzed {usageCounter} portfolios so far.</p>
        </div>
      </div>
    </div>
  );
}

export default App;