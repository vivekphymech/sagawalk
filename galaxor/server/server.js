import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Exa from 'exa-js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const exaClient = new Exa(process.env.EXA_API_KEY);


app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});


app.post('/api/search', async (req, res) => {
  try {
    const { from, to, tier = 'balanced', departureDate } = req.body;
    
    if (!from || !to || !departureDate) {
      return res.status(400).json({ error: 'From, To locations and Departure Date are required' });
    }

    // Exa api - Search for direct flights
    const searchResults = await exaClient.searchAndContents(
      `direct flights from ${from} to ${to} ${departureDate} prices booking`,
      {
        type: "keyword",
        useAutoprompt: true,
        numResults: 8,
        text: true,
      }
    );

    
    const searchContent = searchResults.results.map(result => {
      return {
        title: result.title,
        url: result.url,
        content: result.text
      };
    });

    // Gemini api
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const flightClassByTier = {
      budget: 'economy',
      balanced: 'business',
      premium: 'first'
    };

    const flightPrompts = {
      budget: `Based on the search results, give a brief, concise, friendly summary of economy flights from ${from} to ${to} on ${departureDate}. Reference: ${JSON.stringify(searchContent)}.

✈️ Best Direct Flights:
• [Airline] [Flight #] - $[Price]
  [Departure Time] → [Arrival Time]

💰 Best Value Pick:
• Quick summary of the most cost-effective option

🎒 What's Included:
• Key features (baggage, meals, etc)

give answer in only under 200 words, dont start like okay heree's just get to the point`,


      
      balanced: `Based on the search results, give a brief, friendly summary of business class flights from ${from} to ${to} on ${departureDate}. Reference: ${JSON.stringify(searchContent)}.

✈️ Premium Options:
• [Airline] [Flight #] - $[Price]
  [Departure Time] → [Arrival Time]

💺 Comfort Pick:
• Quick summary of the best comfort-value option

✨ Perks Included:
• Key features (lounge, seats, meals)

give answer in only under 200 words, dont start like okay heree's just get to the point`,
      
      premium: `Based on the search results, give a brief, friendly summary of first class flights from ${from} to ${to} on ${departureDate}. Reference: ${JSON.stringify(searchContent)}.

✈️ Luxury Options:
• [Airline] [Flight #] - $[Price]
  [Departure Time] → [Arrival Time]

👑 Top Pick:
• Quick summary of the most luxurious option

✨ VIP Perks:
• Key features (private lounge, chauffeur, etc)

give answer in only under 200 words, dont start like okay heree's just get to the point`
    };

    const prompt = flightPrompts[tier] || flightPrompts.balanced;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const flightDetails = response.text();

    // Add follow-up suggestions
    const followUpSuggestions = [
      "Would you like me to search for hotels in your destination?",
      "I can help you find local attractions and reviews.",
      "Want to explore local dining options and food recommendations?",
      "Need information about local transportation and getting around?"
    ];

    res.status(200).json({
      from,
      to,
      flightDetails,
      flightClass: flightClassByTier[tier],
      followUpSuggestions,
      references: searchContent.map(item => ({ title: item.title, url: item.url }))
    });
  } catch (error) {
    console.error('Error in search endpoint:', error);
    res.status(500).json({ error: 'Failed to process travel search', message: error.message });
  }
});

app.get('/api/explore', async (req, res) => {
  try {
    const searchResults = await exaClient.searchAndContents(
      "most popular travel destinations 2024 with attractions",
      {
        type: "keyword",
        useAutoprompt: true,
        numResults: 5,
        text: true,
      }
    );


    const searchContent = searchResults.results.map(result => {
      return {
        title: result.title,
        url: result.url,
        content: result.text
      };
    });

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `Create a list of 10 popular travel destinations for 2024 based on the following information: 
    ${JSON.stringify(searchContent)}. 
    For each destination, include: 
    1. Location name 
    2. Brief description (2-3 sentences) 
    3. Top 3 attractions 
    4. Best time to visit 
    5. A compelling reason to visit`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const destinations = response.text();

    res.status(200).json({
      destinations,
      references: searchContent.map(item => ({ title: item.title, url: item.url }))
    });
  } catch (error) {
    console.error('Error in explore endpoint:', error);
    res.status(500).json({ error: 'Failed to fetch popular destinations', message: error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});