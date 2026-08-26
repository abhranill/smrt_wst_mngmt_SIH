import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import MapPicker from '../components/MapPicker';
import {
  Camera,
  UploadCloud,
  Sparkles,
  MapPin,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Info,
  HelpCircle,
  Tag,
  ShieldCheck
} from 'lucide-react';

const SAMPLE_PRESETS = [
  { id: 'plastic', label: 'Plastic Bottles', icon: '🍾', category: 'Plastic' },
  { id: 'organic', label: 'Organic Kitchen', icon: '🥦', category: 'Organic/Wet waste' },
  { id: 'paper', label: 'Cardboard Box', icon: '📦', category: 'Paper' },
  { id: 'glass', label: 'Glass Bottles', icon: '🍶', category: 'Glass' },
  { id: 'metal', label: 'Metal Cans', icon: '🥫', category: 'Metal' },
  { id: 'mixed', label: 'Mixed Dump', icon: '🗑️', category: 'Mixed waste' }
];

export const ReportWastePage = ({ onNavigate }) => {
  const { user, isAuthenticated, demoLogin } = useAuth();

  // Form State
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [analyzingAI, setAnalyzingAI] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // Category & Details
  const [categories, setCategories] = useState([
    'Plastic',
    'Organic/Wet waste',
    'Paper',
    'Glass',
    'Metal',
    'Mixed waste',
    'Other'
  ]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');

  // Location State
  const [latitude, setLatitude] = useState(28.6328);
  const [longitude, setLongitude] = useState(77.2197);
  const [address, setAddress] = useState('Central Market Area, Connaught Place, Ward 1');
  const [landmark, setLandmark] = useState('Opposite Metro Station Gate 3');

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState(null);
  const [error, setError] = useState('');

  // Fetch categories metadata
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.getCategories();
        if (res.success && res.categories) {
          setCategories(res.categories);
        }
      } catch (e) {
        // use fallback categories
      }
    };
    fetchCats();
  }, []);

  // Handle image upload from computer/phone
  const handleImageChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Validate size (< 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image file is too large (Maximum 10 MB).');
      return;
    }

    setError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));

    // Send to AI for analysis
    await triggerAiAnalysis(file);
  };

  // Trigger AI analysis with file
  const triggerAiAnalysis = async (file) => {
    setAnalyzingAI(true);
    setAiResult(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await api.analyzeImage(formData);
      if (res.success) {
        setAiResult(res.analysis);
        setSelectedCategory(res.analysis.category);
        if (res.imageUrl) {
          setImagePreview(res.imageUrl);
        }
      }
    } catch (err) {
      console.warn('AI analysis error, using fallback:', err);
      // Fallback
      setAiResult({
        category: 'Plastic',
        confidence: 0.88,
        confidencePercent: '88%',
        detectedCues: ['Polymer gloss', 'Synthetic outline'],
        suggestedBin: 'Blue (Dry Waste)',
        handlingAdvice: 'Recyclable packaging material.',
        modelName: 'CleanCity Edge Heuristic v1.4 (Fallback)',
        isPrototype: true
      });
      setSelectedCategory('Plastic');
    } finally {
      setAnalyzingAI(false);
    }
  };

  // Select a preset sample image (Instant Hackathon Demo)
  const handlePresetSelect = async (preset) => {
    setError('');
    setAnalyzingAI(true);
    setAiResult(null);

    try {
      const res = await api.analyzePreset(preset.id);
      if (res.success) {
        setImagePreview(res.imageUrl);
        setImageFile(null); // Marked as server-stored sample
        setAiResult(res.analysis);
        setSelectedCategory(res.analysis.category);

        // Pre-fill contextual description if empty
        if (!description) {
          setDescription(`Observed discarded ${preset.category.toLowerCase()} waste accumulation along the pedestrian pavement. Emitting odors and attracting pests.`);
        }
      }
    } catch (err) {
      setError('Failed to load sample image');
    } finally {
      setAnalyzingAI(false);
    }
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // If not authenticated, prompt demo login
    if (!isAuthenticated) {
      setError('Please log in or click "Login as Demo Citizen" to submit a verified complaint.');
      return;
    }

    if (!imagePreview) {
      setError('Please capture or upload a garbage photograph.');
      return;
    }

    if (!selectedCategory) {
      setError('Please select or confirm a waste category.');
      return;
    }

    if (!description || description.trim().length < 5) {
      setError('Please provide a brief description of the waste problem.');
      return;
    }

    if (!address) {
      setError('Please provide the street address or location name.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        category: selectedCategory,
        description: description.trim(),
        imageUrl: imagePreview,
        latitude,
        longitude,
        address: address.trim(),
        landmark: landmark ? landmark.trim() : '',
        priority,
        aiSuggestedCategory: aiResult?.category || selectedCategory,
        aiConfidence: aiResult?.confidence || 0.85
      };

      const res = await api.createComplaint(payload);
      if (res.success) {
        setSubmittedComplaint(res.complaint);
        // Confetti celebration
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Quick Citizen Demo Login Trigger
  const handleQuickLogin = async () => {
    try {
      await demoLogin('citizen');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Citizen Grievance Filing</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Report Waste or Illegal Dump
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Upload a photograph of the garbage pile. Our AI assistant will triage the waste material and route your report directly to the zonal municipal sanitation unit.
        </p>
      </div>

      {/* Auth Banner if guest */}
      {!isAuthenticated && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-800">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              You are viewing as guest. To submit your complaint and receive a tracked ID:
            </span>
          </div>
          <button
            onClick={handleQuickLogin}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs transition cursor-pointer shrink-0"
          >
            1-Click Login as Citizen
          </button>
        </div>
      )}

      {/* Submission Success Modal */}
      {submittedComplaint && (
        <div className="p-6 sm:p-8 bg-emerald-50 border-2 border-emerald-300 rounded-3xl space-y-5 animate-in fade-in zoom-in-95 duration-300 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Grievance Registered Successfully
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Complaint ID: {submittedComplaint.id}
              </h2>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-emerald-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Category:</span>
              <strong className="text-slate-900">{submittedComplaint.category} Waste</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Location:</span>
              <span className="text-slate-900 font-medium text-right">{submittedComplaint.address}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Initial Status:</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                Reported
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate(`/track?id=${submittedComplaint.id}`)}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Track Live Status</span>
            </button>

            <button
              onClick={() => onNavigate('/citizen')}
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl font-bold text-xs transition cursor-pointer"
            >
              View in My Reports
            </button>

            <button
              onClick={() => {
                setSubmittedComplaint(null);
                setImagePreview('');
                setImageFile(null);
                setAiResult(null);
                setDescription('');
              }}
              className="w-full sm:w-auto px-4 py-3 text-xs text-slate-500 hover:text-slate-700 font-medium"
            >
              File Another Report
            </button>
          </div>
        </div>
      )}

      {/* Main Form */}
      {!submittedComplaint && (
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Photograph & AI Analysis */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>1. Garbage Photograph & AI Triage</span>
              </h2>
              <span className="text-[11px] text-slate-400 font-medium">Required</span>
            </div>

            {/* Quick Demo Sample Presets Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Hackathon Demo Test Presets (1-Click Sample Images):</span>
                </span>
                <span className="text-[10px] text-slate-400">Click any preset to test AI</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {SAMPLE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handlePresetSelect(preset)}
                    className="p-2 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 rounded-xl text-center transition cursor-pointer text-xs flex flex-col items-center gap-1 group"
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform">
                      {preset.icon}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-700 group-hover:text-emerald-700">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Zone / Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {/* File Input Box */}
              <label className="relative border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-emerald-50/30 min-h-[180px]">
                <UploadCloud className="w-8 h-8 text-emerald-600 mb-2" />
                <span className="text-xs font-bold text-slate-800">
                  Click to Upload or Drag Garbage Photo
                </span>
                <span className="text-[11px] text-slate-500 mt-1">
                  Supports JPEG, PNG, WebP up to 10MB
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {/* Image Preview Box */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 min-h-[180px] flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Waste Preview"
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="text-center p-4 text-slate-400 text-xs">
                    <Camera className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                    <span>No image selected yet</span>
                  </div>
                )}

                {/* AI Analyzing Radar overlay */}
                {analyzingAI && (
                  <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center">
                    <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin mb-2" />
                    <span className="text-xs font-bold text-emerald-400">
                      AI Vision Classifier Analyzing...
                    </span>
                    <span className="text-[10px] text-slate-300">
                      Scanning texture, colors, and material geometry
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* AI Suggestion Card Result */}
            {aiResult && (
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-300 space-y-3 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-600 text-white rounded-lg">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-emerald-950">
                        AI Suggested Category: {aiResult.category}
                      </h4>
                      <p className="text-[10px] text-emerald-700 font-mono">
                        Model: {aiResult.modelName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-emerald-200 text-emerald-900 rounded-full font-bold text-xs">
                      Confidence: {aiResult.confidencePercent}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Recommended Segregation Bin:</span>
                    <strong className="text-slate-800">{aiResult.suggestedBin}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Handling Advice:</span>
                    <p className="text-slate-700 text-[11px]">{aiResult.handlingAdvice}</p>
                  </div>
                </div>

                {aiResult.detectedCues && aiResult.detectedCues.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[10px] text-slate-500 font-semibold">Detected Cues:</span>
                    {aiResult.detectedCues.map((cue, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-white/80 border border-emerald-200 rounded text-[10px] text-emerald-800 font-medium"
                      >
                        #{cue}
                      </span>
                    ))}
                  </div>
                )}

                <div className="p-2 bg-emerald-100/50 rounded-lg text-[10px] text-emerald-800 flex items-center justify-between">
                  <span>
                    💡 <strong>Prototype Notice:</strong> AI suggestions are automated assists. You can verify or change below.
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(aiResult.category)}
                    className="px-2 py-0.5 bg-emerald-600 text-white rounded font-bold hover:bg-emerald-700 transition"
                  >
                    Confirm Category
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Category Confirmation & Urgency */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-600" />
              <span>2. Confirm Waste Category & Severity</span>
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Waste Category (Select to confirm or correct AI)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`p-3 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <span>{cat}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Urgency / Priority */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Priority Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['Low', 'Medium', 'High', 'Critical'].map((p) => {
                  const isSelected = priority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-2 text-center rounded-xl border text-xs font-bold transition cursor-pointer ${
                        isSelected
                          ? p === 'Critical'
                            ? 'bg-rose-600 text-white border-rose-600'
                            : p === 'High'
                            ? 'bg-orange-600 text-white border-orange-600'
                            : p === 'Medium'
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-slate-700 text-white border-slate-700'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 3: Location on Interactive Map */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>3. Exact Geo-Location & Address</span>
            </h2>

            {/* Interactive Leaflet Map Picker */}
            <MapPicker
              latitude={latitude}
              longitude={longitude}
              onLocationChange={(lat, lng) => {
                setLatitude(lat);
                setLongitude(lng);
              }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Street Address / Area Name:
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Near Bus Stand, Connaught Place, Ward 1"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nearby Landmark (Optional):
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Opposite State Bank ATM, Beside Tea Stall"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Problem Description */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>4. Problem Description</span>
            </h2>

            <div>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the condition of the garbage dump (e.g. overflowing onto sidewalk, foul smell, blocking storm drain, unattended for 3 days)..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-emerald-500"
                required
              />
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-2xl font-extrabold text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Submitting Grievance to Municipal Control Room...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Submit Complaint & Generate Tracking ID</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ReportWastePage;
