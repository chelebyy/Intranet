import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

export const AIImageEditor: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResultImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage || !prompt) return;

    setLoading(true);
    setError(null);

    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        throw new Error("API Key not found in environment variables");
      }

      const ai = new GoogleGenAI({ apiKey });
      const base64Image = selectedImage.split(',')[1];
      const mimeType = selectedImage.split(';')[0].split(':')[1];

      // Using gemini-2.5-flash-image for image editing capability as per instructions
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                {
                    inlineData: {
                        data: base64Image,
                        mimeType: mimeType
                    }
                },
                {
                    text: prompt
                }
            ]
        }
      });
      
      let foundImage = false;
      if (response.candidates && response.candidates[0].content.parts) {
          for (const part of response.candidates[0].content.parts) {
              if (part.inlineData) {
                  const base64EncodeString = part.inlineData.data;
                  // Assuming PNG return or keeping original mime, usually PNG/JPEG from Gemini
                  const newImageUrl = `data:image/png;base64,${base64EncodeString}`;
                  setResultImage(newImageUrl);
                  foundImage = true;
                  break;
              }
          }
      }

      if (!foundImage) {
        // Fallback or error if no image returned
        setError("No image generated. The model might have returned text only: " + response.text);
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during generation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 w-full max-w-7xl mx-auto h-full flex flex-col">
       <div className="flex flex-col gap-1 mb-8">
            <h1 className="text-3xl font-black text-text-primary">AI Image Editor</h1>
            <p className="text-text-secondary">Edit images using natural language prompts powered by Gemini 2.5 Flash.</p>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-[500px]">
            <div className="flex flex-col gap-6">
                <div className="bg-card border border-border-color rounded-xl p-6 shadow-sm flex flex-col gap-4">
                    <h2 className="font-bold text-lg text-text-primary">1. Upload Image</h2>
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-border-color rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors relative overflow-hidden group"
                    >
                        {selectedImage ? (
                            <img src={selectedImage} alt="Original" className="w-full h-full object-contain" />
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-4xl text-text-muted mb-2">cloud_upload</span>
                                <p className="text-text-secondary font-medium">Click to upload an image</p>
                                <p className="text-xs text-text-muted">JPG, PNG supported</p>
                            </>
                        )}
                        {selectedImage && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-white font-medium">Change Image</p>
                            </div>
                        )}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleImageUpload} 
                            className="hidden" 
                            accept="image/*"
                        />
                    </div>
                </div>

                <div className="bg-card border border-border-color rounded-xl p-6 shadow-sm flex flex-col gap-4">
                    <h2 className="font-bold text-lg text-text-primary">2. Describe Edits</h2>
                    <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="E.g., 'Add a retro filter', 'Make the background black and white', 'Add fireworks in the sky'" 
                        className="form-textarea w-full rounded-lg border-border-color p-4 focus:ring-2 focus:ring-primary/50 focus:border-primary h-32 resize-none text-text-primary"
                    ></textarea>
                    
                    <button 
                        onClick={handleGenerate} 
                        disabled={!selectedImage || !prompt || loading}
                        className={`w-full py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all
                            ${!selectedImage || !prompt || loading 
                                ? 'bg-gray-300 cursor-not-allowed' 
                                : 'bg-primary hover:bg-primary-dark shadow-md hover:shadow-lg'}`}
                    >
                        {loading ? (
                            <>
                                <span className="material-symbols-outlined animate-spin">refresh</span>
                                Processing...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined fill">auto_awesome</span>
                                Generate Edit
                            </>
                        )}
                    </button>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>
            </div>

            <div className="bg-card border border-border-color rounded-xl p-6 shadow-sm flex flex-col gap-4 h-full">
                <h2 className="font-bold text-lg text-text-primary">Result</h2>
                <div className="flex-1 bg-slate-50 rounded-xl border border-border-color flex items-center justify-center relative overflow-hidden">
                    {resultImage ? (
                        <img src={resultImage} alt="Edited Result" className="w-full h-full object-contain" />
                    ) : (
                        <div className="text-center p-8">
                             <div className="w-16 h-16 rounded-full bg-slate-200 mx-auto mb-4 flex items-center justify-center text-slate-400">
                                <span className="material-symbols-outlined text-3xl">image</span>
                             </div>
                             <p className="text-text-muted">Generated image will appear here</p>
                        </div>
                    )}
                </div>
                {resultImage && (
                    <a href={resultImage} download="edited-image.png" className="w-full py-3 border border-border-color rounded-lg font-bold text-text-secondary hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors">
                        <span className="material-symbols-outlined">download</span> Download Image
                    </a>
                )}
            </div>
       </div>
    </div>
  );
};