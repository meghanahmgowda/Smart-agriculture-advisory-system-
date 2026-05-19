from flask import Flask, render_template, request, jsonify, session
import anthropic
import base64
import os

app = Flask(__name__)
app.secret_key = "agri_secret_2025"

client = anthropic.Anthropic()

# ─── translations ──────────────────────────────────────────────
TRANSLATIONS = {
    "en": {
        "app_name": "Smart Agriculture Advisory",
        "tagline": "AI-powered guidance for healthy, thriving crops",
        "login_title": "Welcome, Farmer!",
        "login_sub": "Sign in to get personalised crop advice",
        "username": "Full Name",
        "phone": "Phone Number",
        "choose_lang": "Choose your language",
        "login_btn": "Enter App →",
        "tabs": ["🔬 Leaf Disease","🌤 Weather","💧 Watering","🌿 Nutrients","🛡 Pesticides","🌱 Crop Selector","⚗️ Soil pH","📈 Market Prices"],
        "analyze_btn": "Analyze Leaf with AI",
        "analyzing": "Analyzing your leaf…",
        "upload_label": "Tap to upload or capture a leaf photo",
        "upload_hint": "JPG / PNG – works best with close-up shots",
        "voice_placeholder": "Tap 🎙 and speak your farming question…",
        "ask_ai": "Ask AI",
        "logout": "Logout",
    },
    "ta": {
        "app_name": "விவசாய ஆலோசனை அமைப்பு",
        "tagline": "AI உதவியால் நல்ல பயிர் வளர்ப்பு",
        "login_title": "வரவேற்கிறோம், விவசாயி!",
        "login_sub": "உங்கள் பயிர் ஆலோசனைக்கு உள்நுழையுங்கள்",
        "username": "பூர்த்தி பெயர்",
        "phone": "தொலைபேசி எண்",
        "choose_lang": "மொழியை தேர்ந்தெடுக்கவும்",
        "login_btn": "உள்நுழை →",
        "tabs": ["🔬 இலை நோய்","🌤 வானிலை","💧 நீர்ப்பாசனம்","🌿 ஊட்டச்சத்து","🛡 பூச்சிக்கொல்லி","🌱 பயிர் தேர்வு","⚗️ மண் pH","📈 சந்தை விலை"],
        "analyze_btn": "AI மூலம் இலை பகுப்பாய்வு",
        "analyzing": "இலையை பகுப்பாய்வு செய்கிறோம்…",
        "upload_label": "இலை புகைப்படத்தை பதிவேற்றவும்",
        "upload_hint": "JPG / PNG – தெளிவான படம் சிறந்தது",
        "voice_placeholder": "🎙 அழுத்தி உங்கள் கேள்வியை கூறுங்கள்…",
        "ask_ai": "AI கேள்",
        "logout": "வெளியேறு",
    },
    "hi": {
        "app_name": "स्मार्ट कृषि सलाह प्रणाली",
        "tagline": "AI की मदद से बेहतर खेती करें",
        "login_title": "स्वागत है, किसान!",
        "login_sub": "फसल सलाह के लिए लॉगिन करें",
        "username": "पूरा नाम",
        "phone": "फोन नंबर",
        "choose_lang": "अपनी भाषा चुनें",
        "login_btn": "प्रवेश करें →",
        "tabs": ["🔬 पत्ता रोग","🌤 मौसम","💧 सिंचाई","🌿 पोषण","🛡 कीटनाशक","🌱 फसल चयन","⚗️ मिट्टी pH","📈 बाजार भाव"],
        "analyze_btn": "AI से पत्ते का विश्लेषण",
        "analyzing": "पत्ते का विश्लेषण हो रहा है…",
        "upload_label": "पत्ते की फोटो अपलोड करें",
        "upload_hint": "JPG / PNG – नज़दीक की स्पष्ट तस्वीर सबसे अच्छी है",
        "voice_placeholder": "🎙 दबाएं और अपना सवाल बोलें…",
        "ask_ai": "AI से पूछें",
        "logout": "लॉगआउट",
    },
    "te": {
        "app_name": "స్మార్ట్ వ్యవసాయ సలహా వ్యవస్థ",
        "tagline": "AI సహాయంతో మెరుగైన వ్యవసాయం",
        "login_title": "స్వాగతం, రైతు!",
        "login_sub": "పంట సలహా కోసం లాగిన్ అవ్వండి",
        "username": "పూర్తి పేరు",
        "phone": "ఫోన్ నంబర్",
        "choose_lang": "మీ భాషను ఎంచుకోండి",
        "login_btn": "లాగిన్ →",
        "tabs": ["🔬 ఆకు వ్యాధి","🌤 వాతావరణం","💧 నీటిపారుదల","🌿 పోషకాలు","🛡 పురుగుమందు","🌱 పంట ఎంపిక","⚗️ నేల pH","📈 మార్కెట్ ధరలు"],
        "analyze_btn": "AI తో ఆకు విశ్లేషణ",
        "analyzing": "ఆకు విశ్లేషిస్తున్నాం…",
        "upload_label": "ఆకు ఫోటో అప్లోడ్ చేయండి",
        "upload_hint": "JPG / PNG – దగ్గరి స్పష్టమైన చిత్రం మంచిది",
        "voice_placeholder": "🎙 నొక్కి మీ ప్రశ్న చెప్పండి…",
        "ask_ai": "AI అడగండి",
        "logout": "లాగ్అవుట్",
    },
    "kn": {
        "app_name": "ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಸಲಹಾ ವ್ಯವಸ್ಥೆ",
        "tagline": "AI ಸಹಾಯದಿಂದ ಉತ್ತಮ ಕೃಷಿ",
        "login_title": "ಸ್ವಾಗತ, ರೈತರೇ!",
        "login_sub": "ಬೆಳೆ ಸಲಹೆಗಾಗಿ ಲಾಗಿನ್ ಮಾಡಿ",
        "username": "ಪೂರ್ಣ ಹೆಸರು",
        "phone": "ಫೋನ್ ಸಂಖ್ಯೆ",
        "choose_lang": "ನಿಮ್ಮ ಭಾಷೆ ಆಯ್ಕೆ ಮಾಡಿ",
        "login_btn": "ಪ್ರವೇಶಿಸಿ →",
        "tabs": ["🔬 ಎಲೆ ರೋಗ","🌤 ಹವಾಮಾನ","💧 ನೀರಾವರಿ","🌿 ಪೋಷಕಾಂಶ","🛡 ಕೀಟನಾಶಕ","🌱 ಬೆಳೆ ಆಯ್ಕೆ","⚗️ ಮಣ್ಣು pH","📈 ಮಾರುಕಟ್ಟೆ ಬೆಲೆ"],
        "analyze_btn": "AI ಮೂಲಕ ಎಲೆ ವಿಶ್ಲೇಷಣೆ",
        "analyzing": "ಎಲೆ ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ…",
        "upload_label": "ಎಲೆ ಚಿತ್ರ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
        "upload_hint": "JPG / PNG – ಸ್ಪಷ್ಟ ಚಿತ್ರ ಉತ್ತಮ",
        "voice_placeholder": "🎙 ಒತ್ತಿ ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಹೇಳಿ…",
        "ask_ai": "AI ಕೇಳಿ",
        "logout": "ಲಾಗ್‌ಔಟ್",
    },
    "mr": {
        "app_name": "स्मार्ट शेती सल्ला प्रणाली",
        "tagline": "AI च्या मदतीने चांगली शेती करा",
        "login_title": "स्वागत आहे, शेतकरी!",
        "login_sub": "पीक सल्ल्यासाठी लॉगिन करा",
        "username": "पूर्ण नाव",
        "phone": "फोन नंबर",
        "choose_lang": "आपली भाषा निवडा",
        "login_btn": "प्रवेश करा →",
        "tabs": ["🔬 पान रोग","🌤 हवामान","💧 सिंचन","🌿 पोषण","🛡 कीटकनाशक","🌱 पीक निवड","⚗️ माती pH","📈 बाजार भाव"],
        "analyze_btn": "AI ने पान तपासा",
        "analyzing": "पानाचे विश्लेषण सुरू…",
        "upload_label": "पानाचा फोटो अपलोड करा",
        "upload_hint": "JPG / PNG – जवळचा स्पष्ट फोटो सर्वोत्तम",
        "voice_placeholder": "🎙 दाबा आणि आपला प्रश्न सांगा…",
        "ask_ai": "AI ला विचारा",
        "logout": "लॉगआउट",
    },
}

CROPS = {
    "kharif": [
        {"emoji":"🌾","name":"Paddy (Rice)","duration":"120–150 days","water":"High","ph":"5.5–6.5","profit":"Stable","yield":"4–6 t/ha","pests":"Stem borer, Blast","fertilizer":"Urea 120 kg/ha, DAP 60 kg/ha","states":"TN, AP, WB, UP"},
        {"emoji":"🌽","name":"Maize","duration":"80–110 days","water":"Medium","ph":"6.0–7.0","profit":"Good","yield":"5–7 t/ha","pests":"Armyworm, Aphids","fertilizer":"NPK 80:60:40 kg/ha","states":"KA, AP, TN, RJ"},
        {"emoji":"🫘","name":"Groundnut","duration":"100–130 days","water":"Medium","ph":"6.0–6.5","profit":"High","yield":"1.5–2 t/ha","pests":"Leaf miner, Aphids","fertilizer":"Gypsum 400 kg/ha, DAP 80 kg/ha","states":"TN, AP, GJ, RJ"},
        {"emoji":"🌻","name":"Sunflower","duration":"85–95 days","water":"Low-Med","ph":"6.0–7.5","profit":"Good","yield":"1.2–1.8 t/ha","pests":"Head borer","fertilizer":"NPK 60:60:30 kg/ha","states":"KA, AP, MH"},
        {"emoji":"🧅","name":"Onion","duration":"110–130 days","water":"Medium","ph":"6.0–7.0","profit":"High","yield":"20–25 t/ha","pests":"Thrips, Purple blotch","fertilizer":"NPK 100:50:50 kg/ha","states":"MH, KA, MP, GJ"},
        {"emoji":"🍅","name":"Tomato","duration":"60–80 days","water":"Medium","ph":"6.0–7.0","profit":"High","yield":"25–35 t/ha","pests":"Whitefly, Leaf curl","fertilizer":"NPK 120:60:60 kg/ha","states":"AP, TN, KA, HP"},
        {"emoji":"🫙","name":"Soybean","duration":"90–110 days","water":"Medium","ph":"6.0–7.0","profit":"Good","yield":"1.5–2.5 t/ha","pests":"Girdle beetle, Aphids","fertilizer":"Rhizobium inoculation, DAP 80 kg/ha","states":"MP, MH, RJ, KA"},
        {"emoji":"🌿","name":"Green gram (Moong)","duration":"55–65 days","water":"Low","ph":"6.0–7.5","profit":"Good","yield":"0.8–1.2 t/ha","pests":"Yellow mosaic virus","fertilizer":"Rhizobium + DAP 40 kg/ha","states":"TN, AP, RJ, MP"},
        {"emoji":"🌶","name":"Chilli","duration":"90–120 days","water":"Medium","ph":"6.0–7.0","profit":"Very High","yield":"8–12 t/ha fresh","pests":"Thrips, Mites","fertilizer":"NPK 120:60:60 kg/ha","states":"AP, TN, KA, MH"},
        {"emoji":"🍆","name":"Brinjal","duration":"70–90 days","water":"Medium","ph":"5.5–6.8","profit":"Good","yield":"20–25 t/ha","pests":"Shoot & fruit borer","fertilizer":"NPK 100:50:50 kg/ha","states":"WB, UP, TN, AP"},
        {"emoji":"🥜","name":"Black gram (Urad)","duration":"60–90 days","water":"Low-Med","ph":"6.0–7.5","profit":"Good","yield":"0.8–1.0 t/ha","pests":"Whitefly, Aphids","fertilizer":"Rhizobium + SSP 200 kg/ha","states":"TN, AP, MP, UP"},
        {"emoji":"🌴","name":"Coconut","duration":"6–10 years","water":"High","ph":"5.5–7.0","profit":"Very High","yield":"80–100 nuts/tree/yr","pests":"Rhinoceros beetle, Red palm weevil","fertilizer":"NPK 1300:700:2700 g/tree/yr","states":"KL, TN, KA, AP"},
    ],
    "rabi": [
        {"emoji":"🌾","name":"Wheat","duration":"110–130 days","water":"Medium","ph":"6.0–7.0","profit":"Stable","yield":"3–4 t/ha","pests":"Rust, Aphids","fertilizer":"NPK 120:60:40 kg/ha","states":"UP, PB, HR, MP"},
        {"emoji":"🫘","name":"Chickpea","duration":"90–110 days","water":"Low","ph":"6.0–8.0","profit":"Good","yield":"1–1.5 t/ha","pests":"Pod borer","fertilizer":"DAP 60 kg/ha + Rhizobium","states":"MP, RJ, MH, UP"},
        {"emoji":"🥜","name":"Mustard","duration":"110–140 days","water":"Low","ph":"6.0–7.5","profit":"Good","yield":"1–1.5 t/ha","pests":"Aphids, Sawfly","fertilizer":"NPK 80:40:40 kg/ha","states":"RJ, UP, HR, MP"},
        {"emoji":"🥔","name":"Potato","duration":"70–90 days","water":"Medium","ph":"5.5–6.5","profit":"High","yield":"20–30 t/ha","pests":"Late blight, Tuber moth","fertilizer":"NPK 180:80:100 kg/ha","states":"UP, WB, PB, GJ"},
        {"emoji":"🧄","name":"Garlic","duration":"130–150 days","water":"Medium","ph":"6.0–7.0","profit":"Very High","yield":"8–10 t/ha","pests":"Thrips, Purple blotch","fertilizer":"NPK 100:50:50 kg/ha","states":"MP, GJ, RJ, UP"},
        {"emoji":"🫛","name":"Peas","duration":"60–90 days","water":"Low-Med","ph":"6.0–7.5","profit":"Good","yield":"8–10 t/ha","pests":"Pod borer, Powdery mildew","fertilizer":"DAP 80 kg/ha + Rhizobium","states":"UP, HP, PB, WB"},
        {"emoji":"🧅","name":"Lentil (Masoor)","duration":"100–120 days","water":"Low","ph":"6.0–7.5","profit":"Good","yield":"0.8–1.2 t/ha","pests":"Aphids, Stem fly","fertilizer":"DAP 60 kg/ha","states":"MP, UP, WB, BI"},
        {"emoji":"🌱","name":"Barley","duration":"90–120 days","water":"Low","ph":"6.5–8.0","profit":"Stable","yield":"2–4 t/ha","pests":"Rust, Aphids","fertilizer":"NPK 60:30:20 kg/ha","states":"RJ, UP, HR, MP"},
        {"emoji":"🥗","name":"Fenugreek","duration":"90–120 days","water":"Low","ph":"6.0–7.0","profit":"High","yield":"1.5–2 t/ha","pests":"Powdery mildew","fertilizer":"NPK 20:40:20 kg/ha","states":"RJ, GJ, MP, UP"},
        {"emoji":"🌿","name":"Coriander","duration":"60–90 days","water":"Low-Med","ph":"6.0–7.5","profit":"High","yield":"0.8–1.2 t/ha","pests":"Aphids, Powdery mildew","fertilizer":"NPK 30:20:20 kg/ha","states":"RJ, MP, AP, GJ"},
        {"emoji":"🧆","name":"Sunflower (Rabi)","duration":"85–95 days","water":"Low-Med","ph":"6.0–7.5","profit":"Good","yield":"1.5–2.2 t/ha","pests":"Head borer, Aphids","fertilizer":"NPK 60:60:30 kg/ha","states":"KA, AP, MH, TN"},
        {"emoji":"🥬","name":"Cabbage","duration":"60–90 days","water":"Medium","ph":"6.0–7.5","profit":"Good","yield":"30–40 t/ha","pests":"Diamond-back moth","fertilizer":"NPK 100:50:50 kg/ha","states":"HP, WB, UP, KA"},
    ],
    "zaid": [
        {"emoji":"🍉","name":"Watermelon","duration":"70–90 days","water":"Medium","ph":"6.0–7.0","profit":"Very High","yield":"25–30 t/ha","pests":"Aphids, Fruit fly","fertilizer":"NPK 100:50:75 kg/ha","states":"UP, AP, KA, RJ"},
        {"emoji":"🥒","name":"Cucumber","duration":"55–65 days","water":"Medium","ph":"5.5–7.0","profit":"Good","yield":"15–20 t/ha","pests":"Aphids, Downy mildew","fertilizer":"NPK 80:40:40 kg/ha","states":"UP, TN, KA, AP"},
        {"emoji":"🎃","name":"Bitter Gourd","duration":"55–65 days","water":"Medium","ph":"6.0–7.0","profit":"High","yield":"10–15 t/ha","pests":"Fruit fly, Aphids","fertilizer":"NPK 80:60:60 kg/ha","states":"TN, AP, UP, WB"},
        {"emoji":"🌽","name":"Sweet Corn","duration":"80–90 days","water":"Medium","ph":"5.8–7.0","profit":"High","yield":"8–12 t/ha","pests":"Stem borer, Armyworm","fertilizer":"NPK 120:60:40 kg/ha","states":"KA, TN, HP, UP"},
        {"emoji":"🫘","name":"Moong Dal","duration":"55–65 days","water":"Low","ph":"6.0–7.5","profit":"Good","yield":"0.8–1.2 t/ha","pests":"Yellow mosaic virus","fertilizer":"Rhizobium + DAP 40 kg/ha","states":"AP, TN, RJ, MP"},
        {"emoji":"🍈","name":"Muskmelon","duration":"80–100 days","water":"Medium","ph":"6.0–7.5","profit":"High","yield":"18–22 t/ha","pests":"Aphids, Powdery mildew","fertilizer":"NPK 80:40:60 kg/ha","states":"UP, AP, TN, GJ"},
        {"emoji":"🎋","name":"Sugarcane","duration":"300–365 days","water":"High","ph":"6.0–8.0","profit":"Stable","yield":"70–100 t/ha","pests":"Top shoot borer, Pyrilla","fertilizer":"NPK 250:85:85 kg/ha","states":"UP, MH, KA, TN"},
        {"emoji":"🍋","name":"Lemon / Citrus","duration":"Perennial","water":"Medium","ph":"5.5–7.0","profit":"Very High","yield":"30–50 kg/tree/yr","pests":"Leaf miner, Aphids, Canker","fertilizer":"NPK 400:200:400 g/tree/yr","states":"AP, MH, PB, RJ"},
        {"emoji":"🫑","name":"Capsicum","duration":"60–90 days","water":"Medium","ph":"6.0–7.0","profit":"Very High","yield":"15–25 t/ha","pests":"Thrips, Mites, Anthracnose","fertilizer":"NPK 120:80:80 kg/ha","states":"HP, MH, KA, AP"},
        {"emoji":"🥝","name":"Okra (Bhindi)","duration":"50–65 days","water":"Medium","ph":"6.0–6.8","profit":"Good","yield":"10–15 t/ha","pests":"Jassids, Yellow vein mosaic","fertilizer":"NPK 100:50:50 kg/ha","states":"TN, AP, UP, WB"},
        {"emoji":"🌿","name":"Turmeric","duration":"200–260 days","water":"Medium","ph":"5.5–7.0","profit":"Very High","yield":"20–30 t/ha","pests":"Shoot borer, Rhizome rot","fertilizer":"NPK 60:50:120 kg/ha","states":"AP, TN, MH, OR"},
        {"emoji":"🌺","name":"Jasmine","duration":"Perennial","water":"Medium","ph":"6.0–7.5","profit":"Very High","yield":"3–5 t/ha flowers","pests":"Bud worm, Mites","fertilizer":"NPK 100:50:75 kg/ha","states":"TN, KA, AP, MH"},
    ],
}

MARKET_DATA = {
    "Chennai APMC":  [("Paddy",2200,2183,"▲"),("Maize",1850,1962,"▼"),("Groundnut",5900,5850,"▲"),("Onion",1200,None,"—"),("Tomato",800,None,"▲"),("Banana",1400,None,"—"),("Chilli (dry)",9500,None,"▲"),("Turmeric",7200,None,"▲")],
    "Coimbatore":    [("Paddy",2150,2183,"—"),("Maize",1920,1962,"▲"),("Cotton",6500,6620,"▼"),("Sugarcane",285,315,"—"),("Turmeric",7400,None,"▲"),("Coconut",1800,None,"▲"),("Chilli",9200,None,"▲"),("Brinjal",650,None,"▼")],
    "Madurai":       [("Paddy",2250,2183,"▲"),("Brinjal",600,None,"▼"),("Banana",1350,None,"—"),("Jasmine",400,None,"▲"),("Chilli (dry)",9500,None,"▲"),("Tamarind",4800,None,"—"),("Onion",1100,None,"—"),("Tomato",750,None,"▲")],
    "Salem":         [("Paddy",2180,2183,"—"),("Mango",2200,None,"▲"),("Turmeric",7400,None,"▲"),("Maize",1900,1962,"—"),("Groundnut",5800,5850,"▼"),("Tomato",750,None,"▼"),("Capsicum",3200,None,"▲"),("Okra",1100,None,"—")],
    "Hyderabad":     [("Paddy",2220,2183,"▲"),("Chilli",9800,None,"▲"),("Cotton",6700,6620,"▲"),("Groundnut",5950,5850,"▲"),("Maize",1900,1962,"—"),("Turmeric",7500,None,"▲"),("Soybean",3900,3950,"▼"),("Onion",1300,None,"▲")],
    "Bangalore":     [("Paddy",2160,2183,"—"),("Tomato",900,None,"▲"),("Onion",1250,None,"—"),("Potato",1400,None,"—"),("Capsicum",3500,None,"▲"),("Maize",1880,1962,"▼"),("Brinjal",700,None,"—"),("Okra",1200,None,"▲")],
    "Pune":          [("Wheat",2400,2275,"▲"),("Onion",1150,None,"▼"),("Potato",1350,None,"—"),("Soybean",3850,3950,"▼"),("Tomato",850,None,"▲"),("Cabbage",600,None,"—"),("Garlic",6500,None,"▲"),("Chilli",9200,None,"▲")],
    "Nagpur":        [("Soybean",3900,3950,"—"),("Cotton",6600,6620,"▼"),("Wheat",2380,2275,"▲"),("Onion",1200,None,"—"),("Orange",4500,None,"▲"),("Lemon",5000,None,"▲"),("Chilli",9100,None,"▲"),("Garlic",6200,None,"—")],
}

LANG_NAMES = {"en":"English","ta":"தமிழ்","hi":"हिंदी","te":"తెలుగు","kn":"ಕನ್ನಡ","mr":"मराठी"}

# ─── routes ─────────────────────────────────────────────────────
@app.route("/")
def index():
    return render_template("index.html",
        translations=TRANSLATIONS,
        lang_names=LANG_NAMES,
        crops=CROPS,
        market_data=MARKET_DATA,
    )

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    name = data.get("name","").strip()
    phone = data.get("phone","").strip()
    lang = data.get("lang","en")
    if not name or len(phone) < 10:
        return jsonify({"ok": False, "msg": "Please enter valid name and 10-digit phone number."})
    session["user"] = {"name": name, "phone": phone, "lang": lang}
    return jsonify({"ok": True})

@app.route("/api/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"ok": True})

@app.route("/api/analyze_leaf", methods=["POST"])
def analyze_leaf():
    data = request.json
    img_b64 = data.get("image")
    lang = data.get("lang","en")
    if not img_b64:
        return jsonify({"error": "No image provided"}), 400

    lang_instruction = f"Respond in {LANG_NAMES.get(lang,'English')} language."
    try:
        msg = client.messages.create(
            model="claude-opus-4-5",
            max_tokens=1200,
            system=f"""You are an expert agricultural plant pathologist AI assistant. {lang_instruction}
Analyze the leaf image and respond in this EXACT format:

🔴 DISEASE DETECTED: [name or "No disease — leaf looks healthy"]
🌱 AFFECTED CROP: [identify crop species]
📋 SYMPTOMS OBSERVED: [describe visible symptoms clearly]

💊 TREATMENT PLAN:
• [Specific treatment step 1 with product name if applicable]
• [Specific treatment step 2]
• [Specific treatment step 3]

🌿 ORGANIC ALTERNATIVES:
• [Organic/natural remedy 1]
• [Organic/natural remedy 2]

🛡 PREVENTION TIPS:
• [Prevention measure 1]
• [Prevention measure 2]

⏱ RECOVERY TIME: [Expected recovery duration]
⚠️ URGENCY LEVEL: [Low / Medium / High — brief reason]

Keep advice practical for Indian farmers.""",
            messages=[{
                "role": "user",
                "content": [
                    {"type": "image", "source": {"type": "base64", "media_type": "image/jpeg", "data": img_b64}},
                    {"type": "text", "text": "Analyze this leaf image thoroughly. Identify any disease, deficiency, or pest damage and provide a complete treatment plan."}
                ]
            }]
        )
        return jsonify({"result": msg.content[0].text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/voice_query", methods=["POST"])
def voice_query():
    data = request.json
    query = data.get("query","").strip()
    lang = data.get("lang","en")
    if not query:
        return jsonify({"error": "Empty query"}), 400

    lang_instruction = f"Respond in {LANG_NAMES.get(lang,'English')} language."
    try:
        msg = client.messages.create(
            model="claude-opus-4-5",
            max_tokens=800,
            system=f"""You are a knowledgeable agricultural advisor for Indian farmers. {lang_instruction}
Answer farming questions clearly and practically. Cover crops, soil, weather, pests, market, government schemes as relevant.
Use bullet points for clarity. Keep advice region-aware (India focus). Be concise but complete.""",
            messages=[{"role": "user", "content": f"Farmer's question: {query}"}]
        )
        return jsonify({"result": msg.content[0].text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/nutrient_check", methods=["POST"])
def nutrient_check():
    data = request.json
    symptom = data.get("symptom","")
    lang = data.get("lang","en")
    lang_instruction = f"Respond in {LANG_NAMES.get(lang,'English')} language."
    try:
        msg = client.messages.create(
            model="claude-opus-4-5",
            max_tokens=500,
            system=f"""You are an agricultural nutrition expert. {lang_instruction}
Format response as:
🌿 LIKELY DEFICIENCY: [nutrient name]
📋 WHY: [1 clear sentence]
💊 REMEDY:
• [Indian fertilizer product 1 with dose]
• [Indian fertilizer product 2 with dose]
• [Organic option]
⏱ RECOVERY TIME: [estimate]
💡 TIP: [one practical tip]""",
            messages=[{"role": "user", "content": "My crop shows: {symptom}. What nutrient defic
