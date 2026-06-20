import * as tf from "@tensorflow/tfjs";

export interface Diagnosis {
  crop: string;
  plantType: string;
  disease: string;
  confidence: number;
  spoilage: number;
  cause: string;
  symptoms: string[];
  organicCure: string[];
  chemicalCure: string[];
  prevention: string[];
}

const MODEL_URL =
  "https://cdn.jsdelivr.net/gh/Rishit-dagli/Greenathon-Plant-AI@main/models/plant_disease_tfjs/model.json";

const classNames: Record<number, string> = {
  0: "Apple___Apple_scab",
  1: "Apple___Black_rot",
  2: "Apple___Cedar_apple_rust",
  3: "Apple___healthy",
  4: "Blueberry___healthy",
  5: "Cherry_(including_sour)___Powdery_mildew",
  6: "Cherry_(including_sour)___healthy",
  7: "Corn_(maize)___Cercospora_leaf_spot_Gray_leaf_spot",
  8: "Corn_(maize)___Common_rust_",
  9: "Corn_(maize)___Northern_Leaf_Blight",
  10: "Corn_(maize)___healthy",
  11: "Grape___Black_rot",
  12: "Grape___Esca_(Black_Measles)",
  13: "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
  14: "Grape___healthy",
  15: "Orange___Haunglongbing_(Citrus_greening)",
  16: "Peach___Bacterial_spot",
  17: "Peach___healthy",
  18: "Pepper_bell___Bacterial_spot",
  19: "Pepper_bell___healthy",
  20: "Potato___Early_blight",
  21: "Potato___Late_blight",
  22: "Potato___healthy",
  23: "Raspberry___healthy",
  24: "Soybean___healthy",
  25: "Squash___Powdery_mildew",
  26: "Strawberry___Leaf_scorch",
  27: "Strawberry___healthy",
  28: "Tomato___Bacterial_spot",
  29: "Tomato___Early_blight",
  30: "Tomato___Late_blight",
  31: "Tomato___Leaf_Mold",
  32: "Tomato___Septoria_leaf_spot",
  33: "Tomato___Spider_mites_Two-spotted_spider_mite",
  34: "Tomato___Target_Spot",
  35: "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
  36: "Tomato___Tomato_mosaic_virus",
  37: "Tomato___healthy",
};

let model: tf.LayersModel | null = null;

export async function loadModel(): Promise<tf.LayersModel | null> {
  if (model) return model;
  try {
    await tf.ready();
    model = await tf.loadLayersModel(MODEL_URL);
    return model;
  } catch (err) {
    console.error("Failed to load plant disease model", err);
    return null;
  }
}

function parseLabel(label: string): { crop: string; diseaseName: string } {
  const parts = label.split("___");
  const cropPart = parts[0]
    .replace(/[()]/g, "")
    .replace(/_/g, " ")
    .replace(/including sour/gi, "sour")
    .trim();
  const diseasePart = parts[1]
    ? parts[1]
        .replace(/_/g, " ")
        .replace(/  +/g, " ")
        .replace(/ $/, "")
        .trim()
    : "";
  return { crop: cropPart, diseaseName: diseasePart || "Unknown condition" };
}

function getDiseaseKey(label: string): string {
  const lower = label.toLowerCase();
  if (lower.includes("healthy")) return "healthy";
  const disease = lower.split("___")[1] || "";
  if (disease.includes("mildew")) return "powderyMildew";
  if (disease.includes("blight")) return disease.includes("late") ? "lateBlight" : "leafBlight";
  if (
    disease.includes("yellow_leaf_curl") ||
    disease.includes("mosaic") ||
    disease.includes("greening") ||
    disease.includes("curl")
  )
    return "leafCurlVirus";
  if (disease.includes("mite") || disease.includes("pest") || disease.includes("insect"))
    return "pestDamage";
  return "fungalSpot";
}

function analyzeSpoilage(file: File): Promise<number> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      const size = 224;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(0);
        return;
      }
      ctx.drawImage(img, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size).data;

      let total = 0;
      let diseased = 0;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        if (r > 240 && g > 240 && b > 240) continue;
        total++;

        const brightness = (r + g + b) / 3;
        const isGreen = g > r && g > b && g > 60;
        const isYellow = r > 140 && g > 140 && b < 100;
        const isBrown = r > g && r > b && g > 40 && b < g && brightness < 160;
        const isDark = brightness < 60;
        const isWhitePatch = r > 200 && g > 200 && b > 200;

        if (!isGreen || isYellow || isBrown || isDark || isWhitePatch) {
          diseased++;
        }
      }
      resolve(total ? Math.min(100, Math.round((diseased / total) * 100)) : 0);
    };
    img.onerror = () => resolve(0);
    img.src = url;
  });
}

export async function analyzePlantImage(file: File): Promise<Diagnosis> {
  const spoilage = await analyzeSpoilage(file);

  const loadedModel = await loadModel();
  if (!loadedModel) {
    throw new Error("AI model failed to load. Please check your internet connection and try again.");
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      canvas.width = 224;
      canvas.height = 224;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not process image."));
        return;
      }
      ctx.drawImage(img, 0, 0, 224, 224);

      try {
        const tensor = tf.tidy(() => {
          return tf.browser.fromPixels(canvas).expandDims(0).toFloat().div(255);
        });
        const logits = loadedModel.predict(tensor) as tf.Tensor;
        const probs = tf.softmax(logits).dataSync();
        tf.dispose([tensor, logits]);

        let bestIndex = 0;
        let bestProb = probs[0];
        for (let i = 1; i < probs.length; i++) {
          if (probs[i] > bestProb) {
            bestProb = probs[i];
            bestIndex = i;
          }
        }

        const label = classNames[bestIndex] || "Unknown";
        const confidence = Math.round(bestProb * 100);
        resolve(buildDiagnosis(label, confidence, spoilage));
      } catch (err) {
        console.error(err);
        reject(new Error("Failed to analyze image with AI model."));
      }
    };
    img.onerror = () => reject(new Error("Failed to read image."));
    img.src = url;
  });
}

function buildDiagnosis(
  label: string,
  confidence: number,
  spoilage: number
): Diagnosis {
  const { crop: labelCrop, diseaseName } = parseLabel(label);
  const key = getDiseaseKey(label);
  const base = diseaseCures[key] || diseaseCures.stressDeficiency;

  const cropName = labelCrop;
  const plantType = base.plantType || "Plant";

  const isHealthy = key === "healthy";
  const finalSpoilage = isHealthy ? 0 : Math.max(spoilage, Math.round((100 - confidence) * 0.3));

  return {
    crop: cropName,
    plantType,
    disease: isHealthy ? "Healthy / No disease detected" : diseaseName,
    confidence: Math.min(99, Math.max(0, confidence)),
    spoilage: Math.min(99, finalSpoilage),
    cause: base.cause || "",
    symptoms: base.symptoms || [],
    organicCure: base.organicCure || [],
    chemicalCure: base.chemicalCure || [],
    prevention: base.prevention || [],
  };
}

const diseaseCures: Record<string, Partial<Diagnosis>> = {
  healthy: {
    cause: "No significant disease symptoms were found in the image.",
    symptoms: ["Normal leaf/fruit color", "No visible lesions, spots, or rot"],
    organicCure: ["Continue good crop management", "Use compost and balanced organic fertilizers"],
    chemicalCure: ["No chemical treatment needed at this stage"],
    prevention: [
      "Monitor fields every 7-10 days",
      "Maintain proper irrigation and nutrition",
      "Use disease-free seeds and seedlings",
      "Practice crop rotation",
    ],
  },
  powderyMildew: {
    cause: "Fungal infection producing white powdery patches on leaves and fruits.",
    symptoms: [
      "White powdery coating on leaf/fruit surface",
      "Leaves curl, turn yellow, and dry",
      "Fruit skin becomes rough and cracked",
    ],
    organicCure: [
      "Spray a milk solution (1 part milk to 9 parts water) weekly",
      "Apply neem oil (3-5 ml/litre) with mild soap",
      "Remove and destroy severely infected leaves/fruits",
    ],
    chemicalCure: [
      "Spray Sulfur 80% WP @ 2 g/litre",
      "Use Dinocap 48% EC @ 1 ml/litre",
      "Hexaconazole 5% EC @ 1.5 ml/litre as a follow-up",
    ],
    prevention: [
      "Ensure good sunlight and air circulation",
      "Avoid excess nitrogen fertilization",
      "Water at the base; avoid wetting foliage",
      "Plant resistant varieties",
    ],
  },
  leafBlight: {
    cause: "Fungal pathogen (Alternaria / Helminthosporium). Common in warm, humid weather.",
    symptoms: [
      "Brown to black spots with concentric rings",
      "Yellowing around spots",
      "Leaves dry and drop prematurely",
    ],
    organicCure: [
      "Prune and burn infected leaves immediately",
      "Spray neem oil (3-5 ml/litre) every 7-10 days",
      "Apply compost tea or baking soda spray (1 tsp/litre)",
    ],
    chemicalCure: [
      "Spray Mancozeb 75% WP @ 2 g/litre",
      "Use Copper oxychloride 50% WP @ 3 g/litre",
      "Azoxystrobin 23% SC @ 1 ml/litre for severe cases",
    ],
    prevention: [
      "Use disease-free seeds and resistant varieties",
      "Maintain proper plant spacing",
      "Avoid overhead irrigation",
      "Mulch soil to prevent spore splash",
    ],
  },
  lateBlight: {
    cause: "Oomycete/fungal infection spreading rapidly in cool, wet conditions.",
    symptoms: [
      "Water-soaked dark green to brown spots",
      "White fungal growth on undersides in humid weather",
      "Fruits develop firm, sunken brown lesions",
    ],
    organicCure: [
      "Remove infected plant parts and burn them",
      "Spray copper-based organic fungicide",
      "Use a diluted milk spray (1:9) as preventive",
    ],
    chemicalCure: [
      "Apply Metalaxyl + Mancozeb @ 2 g/litre",
      "Use Copper hydroxide or Copper oxychloride sprays",
      "Repeat every 7 days during wet weather",
    ],
    prevention: [
      "Plant resistant varieties",
      "Avoid low, poorly drained fields",
      "Ensure good ventilation",
      "Destroy volunteer host plants",
    ],
  },
  leafCurlVirus: {
    cause: "Virus transmitted by whiteflies or aphids.",
    symptoms: [
      "Upward curling of young leaves",
      "Yellow mosaic or vein thickening",
      "Stunted growth and reduced fruiting",
    ],
    organicCure: [
      "Uproot severely infected plants to stop spread",
      "Control vectors with yellow sticky traps and neem oil",
      "Encourage natural predators like ladybird beetles",
    ],
    chemicalCure: [
      "Spray Imidacloprid 17.8% SL @ 0.5 ml/litre for whiteflies",
      "Use Thiamethoxam 25% WG @ 0.3 g/litre for vectors",
      "Alternate chemical groups to avoid resistance",
    ],
    prevention: [
      "Use virus-free seedlings and resistant hybrids",
      "Control weeds that host vectors",
      "Install insect-proof nets in nurseries",
      "Avoid planting near infected fields",
    ],
  },
  anthracnose: {
    cause: "Colletotrichum fungus. Common on fruits and leaves in warm, wet weather.",
    symptoms: [
      "Dark sunken lesions on leaves, stems, or fruits",
      "Pink spore masses in wet conditions",
      "Rotting of ripening fruits",
    ],
    organicCure: [
      "Remove and destroy infected fruits and leaves",
      "Spray neem oil or garlic-chili extract",
      "Apply Trichoderma-based bio-fungicides",
    ],
    chemicalCure: [
      "Spray Mancozeb @ 2 g/litre",
      "Use Carbendazim 50% WP @ 1 g/litre",
      "Copper oxychloride for fruit rot control",
    ],
    prevention: [
      "Use disease-free seeds",
      "Avoid overcrowding and overhead irrigation",
      "Mulch to reduce soil splash",
      "Harvest fruits before over-ripening",
    ],
  },
  fungalSpot: {
    cause: "Fungal or bacterial infection causing spots, rot, or lesions on leaves and fruits.",
    symptoms: [
      "Small dark spots that enlarge over time",
      "Spots may have tan or gray centers",
      "Premature leaf drop or fruit blemishing",
    ],
    organicCure: [
      "Remove infected plant debris",
      "Spray neem oil or compost tea",
      "Apply Trichoderma bio-fungicide",
    ],
    chemicalCure: [
      "Spray Mancozeb @ 2 g/litre",
      "Use Copper oxychloride @ 3 g/litre",
      "Carbendazim 50% WP for severe infection",
    ],
    prevention: [
      "Rotate crops to break disease cycle",
      "Use balanced fertilization",
      "Avoid waterlogging",
      "Remove crop residues after harvest",
    ],
  },
  pestDamage: {
    cause: "Damage caused by sucking or chewing pests such as mites, aphids, or whiteflies.",
    symptoms: [
      "Tiny yellow or brown speckles on leaves",
      "Webbing or distorted growth in severe cases",
      "Reduced vigor and fruit quality",
    ],
    organicCure: [
      "Spray neem oil (3-5 ml/litre) with soap",
      "Use yellow sticky traps to catch flying insects",
      "Release natural enemies like ladybirds or lacewings",
    ],
    chemicalCure: [
      "Spray Imidacloprid 17.8% SL @ 0.5 ml/litre",
      "Use Abamectin 1.9% EC @ 1 ml/litre for mites",
      "Spiromesifen 22.9% SC for whiteflies",
    ],
    prevention: [
      "Monitor underside of leaves regularly",
      "Keep field weed-free",
      "Avoid excess nitrogen which attracts pests",
      "Use pest-resistant varieties",
    ],
  },
  stressDeficiency: {
    disease: "Nutrient Deficiency / Environmental Stress",
    cause: "Likely not a pathogen. Could be nitrogen deficiency, water stress, or sunscald.",
    symptoms: [
      "General yellowing or browning without clear spots",
      "Uniform discoloration on leaf edges",
      "Stunted or wilted appearance",
    ],
    organicCure: [
      "Apply well-decomposed compost or farmyard manure",
      "Use micronutrient-rich organic foliar sprays",
      "Ensure consistent soil moisture",
    ],
    chemicalCure: [
      "Apply balanced NPK fertilizer based on soil test",
      "Use micronutrient mixtures (Zn, Fe, Mg) if deficient",
    ],
    prevention: [
      "Test soil and fertilize accordingly",
      "Avoid drought stress and waterlogging",
      "Use mulching to regulate soil temperature",
      "Monitor crop health weekly",
    ],
  },
};
