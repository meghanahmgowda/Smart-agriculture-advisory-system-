import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Bug,
  Upload,
  Loader2,
  Camera,
  Leaf,
  AlertCircle,
  CheckCircle,
  FlaskConical,
  ShieldCheck,
  Volume2,
  RotateCcw,
  Brain,
} from "lucide-react";
import type { View } from "./Navbar";
import { analyzePlantImage, type Diagnosis, loadModel } from "../utils/plantDisease";

interface DiseaseIdentifierProps {
  setView: (view: View) => void;
}

function speak(text: string) {
  if ("speechSynthesis" in window) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-IN";
    window.speechSynthesis.speak(utter);
  }
}

export default function DiseaseIdentifier({ setView }: DiseaseIdentifierProps) {
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [modelStatus, setModelStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [result, setResult] = useState<Diagnosis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const ensureModel = async () => {
    if (modelStatus === "ready") return true;
    setModelStatus("loading");
    const m = await loadModel();
    if (m) {
      setModelStatus("ready");
      return true;
    }
    setModelStatus("error");
    return false;
  };

  const runAnalysis = async (selectedFile: File) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const ready = await ensureModel();
      if (!ready) {
        setError("AI model could not be loaded. Please check your connection and try again.");
        setLoading(false);
        return;
      }
      const diagnosis = await analyzePlantImage(selectedFile);
      setResult(diagnosis);
    } catch (err) {
      console.error(err);
      setError("AI analysis failed. Please try a clearer photo.");
    } finally {
      setLoading(false);
    }
  };

  const handleFile = (selected?: File) => {
    if (!selected) return;
    if (image) URL.revokeObjectURL(image);
    const url = URL.createObjectURL(selected);
    setImage(url);
    setFile(selected);
    setResult(null);
    setError(null);
    // Auto-analyze as soon as an image is selected
    runAnalysis(selected);
  };

  const reset = () => {
    if (image) URL.revokeObjectURL(image);
    setImage(null);
    setFile(null);
    setResult(null);
    setError(null);
  };

  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image);
    };
  }, [image]);

  const speakResult = () => {
    if (!result) return;
    const text = `The model identified this as ${result.crop}. The condition is ${result.disease} with ${result.confidence} percent confidence. Spoilage is about ${result.spoilage} percent. ${result.cause} Symptoms: ${result.symptoms.join(", ")}. Organic cure: ${result.organicCure.join(", ")}. Chemical cure: ${result.chemicalCure.join(", ")}. Prevention: ${result.prevention.join(", ")}.`;
    speak(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4 md:p-6">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => setView("dashboard")}
          className="mb-4 flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-green-700 shadow-sm hover:bg-green-50"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>

        <h2 className="mb-6 flex items-center gap-2 text-3xl font-bold text-green-800">
          <Brain className="h-8 w-8 text-red-500" /> AI Disease Identifier
        </h2>
        <p className="mb-4 text-sm text-gray-600">
          Powered by a deep-learning model trained on the PlantVillage dataset. Upload a leaf image and
          the AI will identify both the plant and the disease.
        </p>

        {modelStatus === "loading" && (
          <div className="mb-4 rounded-xl bg-blue-50 p-3 text-sm text-blue-800">
            <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
            Loading AI vision model... this may take a few seconds the first time.
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">
            {error}
            <button
              onClick={() => file && runAnalysis(file)}
              className="ml-3 underline"
            >
              Retry
            </button>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Upload panel */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-800">
                <Camera className="h-5 w-5 text-blue-500" /> Upload leaf, fruit or vegetable photo
              </h3>
              <div
                onClick={() => fileRef.current?.click()}
                className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-green-200 bg-green-50 p-6 text-center transition hover:border-green-400"
              >
                {image ? (
                  <img src={image} alt="Crop" className="h-56 w-full rounded-xl object-cover" />
                ) : (
                  <>
                    <Upload className="mb-3 h-12 w-12 text-green-400" />
                    <p className="font-medium text-green-700">Click to upload image</p>
                    <p className="mt-1 text-xs text-gray-500">Supports leaf, fruit & vegetable photos</p>
                  </>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => file && runAnalysis(file)}
                  disabled={!file || loading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 py-3 font-medium text-white shadow transition hover:bg-red-600 disabled:opacity-60"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Bug className="h-5 w-5" />}
                  {loading ? "Scanning..." : "Identify Disease"}
                </button>
                {result && (
                  <button
                    onClick={reset}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-200"
                  >
                    <RotateCcw className="h-5 w-5" /> New
                  </button>
                )}
              </div>

              <div className="mt-4 rounded-xl bg-blue-50 p-3 text-xs text-blue-800">
                <span className="font-semibold">Tip:</span> For best results, take the photo in good
                natural light, keep the leaf/fruit in focus, and avoid strong shadows.
              </div>
            </div>
          </div>

          {/* Result panel */}
          <div className="lg:col-span-3">
            <div className="min-h-full rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 md:p-8">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-xl font-bold text-gray-800">
                  <Leaf className="h-5 w-5 text-green-600" /> Diagnosis & Cure
                </h3>
                {result && (
                  <button
                    onClick={speakResult}
                    className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
                  >
                    <Volume2 className="h-3.5 w-3.5" /> Listen
                  </button>
                )}
              </div>

              {!result && !loading && !error && (
                <div className="flex h-72 flex-col items-center justify-center text-center text-gray-400">
                  <Bug className="mb-3 h-14 w-14" />
                  <p>Upload a clear photo of a leaf, fruit, or vegetable. The AI will automatically identify the plant and disease.</p>
                </div>
              )}

              {loading && (
                <div className="flex h-72 flex-col items-center justify-center text-center text-gray-500">
                  <Loader2 className="mb-3 h-12 w-12 animate-spin text-green-600" />
                  <p>Running AI vision model on your image...</p>
                </div>
              )}

              {result && result.disease === "Not a leaf, vegetable or fruit" && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <AlertCircle className="h-8 w-8" />
                  </div>
                  <h4 className="text-xl font-bold text-red-800">{result.disease}</h4>
                  <p className="mt-2 text-red-700">{result.cause}</p>
                  <ul className="mt-4 inline-block text-left text-sm text-red-700">
                    {result.prevention.map((p, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result && result.disease !== "Not a leaf, vegetable or fruit" && (
                <div className="space-y-5">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl bg-green-50 p-4">
                      <p className="text-xs text-green-700">Plant Identified</p>
                      <p className="text-lg font-bold text-green-900">{result.crop}</p>
                      <p className="text-xs text-green-700">{result.plantType}</p>
                    </div>
                    <div className="rounded-xl bg-red-50 p-4">
                      <p className="text-xs text-red-700">Disease Identified</p>
                      <p className="text-lg font-bold text-red-900">
                        {result.disease.toLowerCase().includes("healthy") ? "Healthy" : result.disease}
                      </p>
                      <p className="text-xs text-red-700">
                        {result.disease.toLowerCase().includes("healthy") ? "No disease" : "Detected condition"}
                      </p>
                    </div>
                    <div className="rounded-xl bg-blue-50 p-4">
                      <p className="text-xs text-blue-700">AI Confidence</p>
                      <p className="text-lg font-bold text-blue-900">{result.confidence}%</p>
                      <p className="text-xs text-blue-700">Model match</p>
                    </div>
                    <div className="rounded-xl bg-amber-50 p-4">
                      <p className="text-xs text-amber-700">Spoilage / Damage</p>
                      <p className="text-lg font-bold text-amber-900">{result.spoilage}%</p>
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-amber-100">
                        <div
                          className="h-full rounded-full bg-amber-500"
                          style={{ width: `${result.spoilage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {result.confidence < 60 && result.confidence > 0 && (
                    <div className="rounded-xl bg-yellow-50 p-3 text-sm text-yellow-800">
                      Low confidence prediction. The leaf may not be in the training dataset, or the photo quality may be poor. Try a clearer image.
                    </div>
                  )}

                  <div className="rounded-xl bg-amber-50 p-4">
                    <p className="font-semibold text-amber-800">Cause</p>
                    <p className="mt-1 text-amber-900">{result.cause}</p>
                  </div>

                  <div>
                    <p className="mb-2 font-semibold text-gray-800">Symptoms</p>
                    <ul className="space-y-2">
                      {result.symptoms.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-700">
                          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                      <p className="mb-2 flex items-center gap-2 font-semibold text-green-800">
                        <CheckCircle className="h-4 w-4" /> Organic Cure
                      </p>
                      <ul className="space-y-2">
                        {result.organicCure.map((c, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-green-900">
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green-600" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                      <p className="mb-2 flex items-center gap-2 font-semibold text-blue-800">
                        <FlaskConical className="h-4 w-4" /> Chemical Cure
                      </p>
                      <ul className="space-y-2">
                        {result.chemicalCure.map((c, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-blue-900">
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="rounded-xl border border-purple-100 bg-purple-50 p-4">
                    <p className="mb-2 flex items-center gap-2 font-semibold text-purple-800">
                      <ShieldCheck className="h-4 w-4" /> Prevention
                    </p>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {result.prevention.map((p, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-purple-900">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-600" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
