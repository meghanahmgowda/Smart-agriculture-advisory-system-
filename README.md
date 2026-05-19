# 🌾 Smart Agriculture Advisory System

An AI-powered web application designed to provide real-time farming guidance and crop management advice to Indian farmers using Claude's advanced language models.

## 🎯 Features

### Core Capabilities
- **🔬 Leaf Disease Analysis**: Upload or capture leaf photos for AI-powered disease detection and treatment recommendations
- **🌤️ Weather Guidance**: Get weather-aware farming advice
- **💧 Watering Advice**: Personalized irrigation recommendations
- **🌿 Nutrient Management**: Identify nutrient deficiencies and get fertilizer recommendations
- **🛡️ Pest Control**: Integrated pest management strategies
- **🌱 Crop Selector**: Browse and select from 35+ crops across Kharif, Rabi, and Zaid seasons
- **⚗️ Soil pH Guidance**: Optimal soil conditions for different crops
- **📈 Market Prices**: Real-time market rates from major APMCs across India

### Multi-Language Support
- 🇮🇳 English (en)
- 🇮🇳 Tamil (ta)
- 🇮🇳 Hindi (hi)
- 🇮🇳 Telugu (te)
- 🇮🇳 Kannada (kn)
- 🇮🇳 Marathi (mr)

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Flask
- Anthropic API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/meghanahmgowda/Smart-agriculture-advisory-system-.git
cd Smart-agriculture-advisory-system-
```

2. **Install dependencies**
```bash
pip install -r requirements.txt
```

3. **Set up environment variables**
```bash
export ANTHROPIC_API_KEY="your-api-key-here"
```

4. **Run the application**
```bash
python agri.py
```

5. **Access the app**
Open your browser and navigate to `http://localhost:5000`

## 📁 Project Structure

```
Smart-agriculture-advisory-system-/
├── app.py                 # Main Flask application
├── templates/
│   └── index.html        # Frontend interface
├── static/               # CSS, JavaScript assets
├── requirements.txt      # Python dependencies
└── README.md            # This file
```

## 🌾 Crop Database

The system includes comprehensive data for **35+ crops** across three seasons:

### Kharif (Monsoon crops)
- Paddy (Rice), Maize, Groundnut, Sunflower, Onion, Tomato, Soybean, Green gram, Chilli, Brinjal, Black gram, Coconut

### Rabi (Winter crops)
- Wheat, Chickpea, Mustard, Potato, Garlic, Peas, Lentil, Barley, Fenugreek, Coriander, Sunflower, Cabbage

### Zaid (Summer crops)
- Watermelon, Cucumber, Bitter Gourd, Sweet Corn, Moong Dal, Muskmelon, Sugarcane, Lemon, Capsicum, Okra, Turmeric, Jasmine

Each crop includes:
- Duration (days)
- Water requirements
- Soil pH range
- Profit potential
- Expected yield
- Common pests
- Fertilizer recommendations

## 💡 Key Functionalities

### 1. Leaf Disease Analysis
Users can upload leaf images for AI analysis that provides:
- Disease identification
- Affected crop species
- Visible symptoms
- Treatment plans
- Organic alternatives
- Prevention tips
- Recovery timeline
- Urgency level assessment

### 2. Voice-Based Queries
Farmers can ask farming questions in their local language and receive:
- Crop-specific advice
- Soil management guidance
- Pest and disease strategies
- Weather-related tips
- Government scheme information

### 3. Nutrient Deficiency Checker
Identify nutrient deficiencies based on symptoms:
- Deficiency diagnosis
- Explanation of symptoms
- Recommended Indian fertilizer products with dosages
- Organic alternatives
- Recovery timeline
- Practical tips

### 4. Market Price Information
Real-time market data from major APMCs:
- Chennai APMC
- Coimbatore
- Madurai
- Salem
- Hyderabad
- Bangalore
- Pune
- Nagpur

## 🔐 Authentication

- Simple session-based authentication
- Stores farmer name, phone number, and language preference
- Maintains user session for personalized experience

## 🤖 AI Integration

Built with **Claude Opus 4.5** for:
- Advanced image analysis for disease detection
- Natural language understanding for farming queries
- Multi-language response generation
- Context-aware agricultural guidance

## 📱 User Interface

- Clean, responsive design optimized for mobile farmers
- Emoji-based tab navigation for visual clarity
- Photo upload/capture functionality
- Voice input support
- Real-time market price displays
- Language selector

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Main application interface |
| `/api/login` | POST | User authentication |
| `/api/logout` | POST | User logout |
| `/api/analyze_leaf` | POST | Analyze leaf disease |
| `/api/voice_query` | POST | Process voice/text query |
| `/api/nutrient_check` | POST | Check nutrient deficiency |

## 📊 Technical Stack

- **Backend**: Flask (Python)
- **Frontend**: HTML, CSS, JavaScript
- **AI Model**: Claude Opus 4.5 (Anthropic)
- **Session Management**: Flask Sessions
- **API**: RESTful endpoints

## 🌍 Regional Focus

Specifically designed for **Indian agriculture**:
- Crops relevant to Indian farming zones
- Indian fertilizer products and dosages
- Market data from major Indian APMCs
- Regional language support
- Government scheme awareness (mention capability)
- Advice tailored to Indian climate and soil conditions

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 📧 Contact

For questions or suggestions, please reach out to the project maintainer.

## 🙏 Acknowledgments

- Built for Indian farmers to improve agricultural productivity
- Powered by Claude AI for advanced agricultural expertise
- Multi-language support for regional accessibility

---

**Empowering Indian farmers with AI-driven agricultural wisdom** 🌾✨
