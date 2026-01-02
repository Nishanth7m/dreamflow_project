
import React, { useRef, useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';

interface CameraCaptureProps {
  onActionComplete: (msg: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onActionComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
    } catch (err) {
      setError("Unable to access camera. Please ensure permissions are granted in your browser settings.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    // Use actual video dimensions for capture
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    
    const base64Image = canvasRef.current.toDataURL('image/jpeg', 0.8).split(',')[1];
    
    setIsProcessing(true);
    setResult(null);
    setError(null);
    
    try {
      const analysis = await geminiService.analyzeInvoice(base64Image);
      setResult(analysis);
      onActionComplete("Document scanned and intelligence extracted.");
    } catch (err: any) {
      setError(err.message || "AI analysis failed. Please check your connection and try again.");
      onActionComplete("Document scan failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="relative aspect-video bg-black rounded-xl overflow-hidden border-2 border-gray-800 neon-border">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-red-950/20">
            <span className="text-3xl mb-2">⚠️</span>
            <p className="text-red-400 font-medium mb-4">{error}</p>
            <button onClick={startCamera} className="text-xs text-white underline font-mono">Retry Camera Access</button>
          </div>
        ) : (
          <>
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            {isProcessing && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-4 backdrop-blur-sm">
                <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
                <div className="text-center">
                  <p className="text-teal-500 font-mono text-sm tracking-widest animate-pulse">EXTRACTING INTELLIGENCE</p>
                  <p className="text-gray-500 text-[10px] uppercase mt-1">Analyzing Document Structure...</p>
                </div>
              </div>
            )}
          </>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex justify-center gap-4">
        {!result && (
          <button 
            onClick={captureImage}
            disabled={isProcessing || !!error}
            className="group relative bg-teal-600 hover:bg-teal-500 disabled:bg-gray-700 text-white font-bold py-4 px-10 rounded-full transition-all active:scale-95 flex items-center gap-3 overflow-hidden"
          >
            <span className="relative z-10">📸 CAPTURE DOCUMENT</span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        )}
        {result && (
          <button 
            onClick={() => {setResult(null); startCamera();}}
            className="border border-teal-500/50 text-teal-500 hover:bg-teal-500/10 font-bold py-3 px-8 rounded-full transition-all"
          >
            Clear & Scan New
          </button>
        )}
      </div>

      {result && (
        <div className="bg-[#0a0a0a] border border-gray-800 p-8 rounded-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-teal-500" />
          <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
            <div>
              <h3 className="text-teal-500 font-mono font-bold tracking-tighter">SCAN_RESULTS_EXTRACTED</h3>
              <p className="text-[10px] text-gray-500 font-mono uppercase">Status: Pending Verification</p>
            </div>
            <span className="text-xs text-gray-600 font-mono">ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
          </div>
          
          <div className="prose prose-invert max-w-none text-sm leading-relaxed text-gray-300 font-mono whitespace-pre-wrap mb-8">
            {result}
          </div>

          <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-800">
            <p className="text-[10px] text-gray-500 italic">Please review data before committing to the cloud database.</p>
            <button 
              onClick={() => {
                onActionComplete("Document data approved and pushed to ERP.");
                setResult(null);
                startCamera();
              }}
              className="bg-teal-500 hover:bg-teal-400 text-black text-xs font-black uppercase tracking-widest py-3 px-8 rounded flex items-center gap-2 shadow-[0_0_15px_rgba(45,212,191,0.3)]"
            >
              Confirm & Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
