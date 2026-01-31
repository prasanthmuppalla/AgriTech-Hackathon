from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from datetime import datetime
import requests

app = Flask(__name__)
CORS(app)

# Mock AI models and data for demo
CROP_RECOMMENDATIONS = {
    'rice': {
        'season': 'kharif',
        'soil': ['clay', 'loam'],
        'water': 'high',
        'fertilizer': 'NPK 20:10:10',
        'diseases': ['blast', 'blight']
    },
    'wheat': {
        'season': 'rabi',
        'soil': ['loam', 'sandy'],
        'water': 'medium',
        'fertilizer': 'NPK 12:32:16',
        'diseases': ['rust', 'smut']
    },
    'tomato': {
        'season': 'all',
        'soil': ['loam', 'sandy'],
        'water': 'medium',
        'fertilizer': 'NPK 19:19:19',
        'diseases': ['blight', 'wilt']
    }
}

MARKET_PRICES = {
    'rice': {'min': 2000, 'max': 2300, 'current': 2150},
    'wheat': {'min': 2200, 'max': 2500, 'current': 2350},
    'tomato': {'min': 30, 'max': 60, 'current': 45},
    'onion': {'min': 20, 'max': 40, 'current': 35}
}

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'OK', 'service': 'AI Advisory'})

@app.route('/chat', methods=['POST'])
def chat_advisory():
    try:
        data = request.json
        message = data.get('message', '')
        language = data.get('language', 'en')
        farmer_profile = data.get('farmer_profile', {})
        
        # Generate AI response based on message content
        response = generate_advisory_response(message, farmer_profile)
        
        return jsonify({
            'response': response,
            'language': language,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def generate_advisory_response(message, farmer_profile):
    message_lower = message.lower()
    
    # Crop recommendations
    if any(word in message_lower for word in ['crop', 'plant', 'grow', 'recommend']):
        season = get_current_season()
        
        if 'rice' in message_lower:
            crop_info = CROP_RECOMMENDATIONS['rice']
            return f"For rice cultivation in {season} season: Use {crop_info['fertilizer']} fertilizer. Ensure adequate water supply. Watch for {', '.join(crop_info['diseases'])} diseases. Best planted in {', '.join(crop_info['soil'])} soil."
        
        return f"Based on current {season} season, I recommend: Rice (if you have clay/loam soil), Wheat (for rabi season), or Tomato (year-round). Would you like specific advice for any crop?"
    
    # Weather queries
    elif any(word in message_lower for word in ['weather', 'rain', 'temperature']):
        return "Current weather: Partly cloudy, 28°C. Light rain expected tomorrow (5mm). Good for most crops but cover sensitive vegetables. Humidity: 65%. Wind: 12 km/h from southwest."
    
    # Pest and disease
    elif any(word in message_lower for word in ['pest', 'disease', 'insect', 'bug']):
        return "Common pests this season: Aphids, whiteflies, and bollworms. Use neem oil spray (organic) or contact your local agriculture officer for chemical recommendations. Check plants daily and remove affected leaves."
    
    # Market prices
    elif any(word in message_lower for word in ['price', 'market', 'sell', 'rate']):
        prices_text = "Current market prices:\n"
        for crop, price_info in MARKET_PRICES.items():
            prices_text += f"• {crop.title()}: ₹{price_info['current']} (Range: ₹{price_info['min']}-{price_info['max']})\n"
        return prices_text + "Prices updated 2 hours ago. Consider group selling for better rates."
    
    # Government schemes
    elif any(word in message_lower for word in ['scheme', 'subsidy', 'government', 'loan']):
        return "Available schemes: 1) PM-KISAN (₹6000/year), 2) Crop Insurance (PMFBY), 3) Soil Health Card, 4) Drip Irrigation Subsidy (90%), 5) KCC Loan (4% interest). Visit your nearest CSC or agriculture office to apply."
    
    # Fertilizer advice
    elif any(word in message_lower for word in ['fertilizer', 'manure', 'nutrients']):
        return "Soil testing recommended first. General advice: Use organic compost + NPK based on crop. For vegetables: NPK 19:19:19. For cereals: NPK 12:32:16. Apply in split doses. Avoid over-fertilization."
    
    # Default response
    else:
        return "I'm here to help with farming advice! Ask me about: 🌾 Crop recommendations, 🌤️ Weather updates, 🐛 Pest control, 💰 Market prices, 🏛️ Government schemes, or 🧪 Fertilizer advice."

def get_current_season():
    month = datetime.now().month
    if month in [6, 7, 8, 9]:
        return 'kharif'
    elif month in [10, 11, 12, 1, 2, 3]:
        return 'rabi'
    else:
        return 'summer'

@app.route('/image-analysis', methods=['POST'])
def analyze_image():
    try:
        data = request.json
        analysis_type = data.get('type', 'pest')
        
        # Mock computer vision analysis for demo
        if analysis_type == 'pest':
            result = {
                'detected': 'Aphids',
                'confidence': 0.85,
                'treatment': 'Spray neem oil solution (5ml per liter water) in evening. Repeat after 3 days if needed.',
                'severity': 'Medium'
            }
        elif analysis_type == 'disease':
            result = {
                'detected': 'Leaf Blight',
                'confidence': 0.78,
                'treatment': 'Remove affected leaves. Spray copper fungicide. Improve air circulation.',
                'severity': 'Low'
            }
        else:
            result = {
                'detected': 'Tomato Plant',
                'confidence': 0.92,
                'growth_stage': 'Flowering',
                'health': 'Good'
            }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)