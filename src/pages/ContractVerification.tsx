import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Upload, FileText, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

const ContractVerification: React.FC = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (validTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
    } else {
      alert("Por favor sube un archivo válido (PDF o Word)");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);

    try {
      // 1. Obtener ID del usuario
      const userDataStr = localStorage.getItem('userData');
      if (!userDataStr) {
         alert("Debes iniciar sesión para verificar tu contrato.");
         setIsUploading(false);
         navigate('/');
         return;
      }
      const userData = JSON.parse(userDataStr);

      // 2. Leer archivo como Base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
         const base64File = reader.result as string;

         try {
           // IMPORTANTE: Cambia esta URL por la URL real de tu Cloud Function (local o en producción)
           const functionUrl = "http://127.0.0.1:5001/studio-6576745927-6cf87/us-central1/verifyContractUpload";

           const response = await fetch(functionUrl, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
                userId: userData.id,
                base64File: base64File,
                fileName: file.name,
                mimeType: file.type
             })
           });

           const jsonResult = await response.json();

           if (response.ok && jsonResult.data?.success) {
             setIsUploading(false);
             setIsSuccess(true);
             
             const updatedUserData = { ...userData, isVerified: true };
             localStorage.setItem('userData', JSON.stringify(updatedUserData));
             
             setTimeout(() => {
               navigate('/profile');
             }, 3000);
           } else {
             alert(`Documento Rechazado: ${jsonResult.data?.error || 'No cumple con las reglas'}`);
             setIsUploading(false);
           }
         } catch (fetchError) {
           console.error("Error llamando a la function:", fetchError);
           alert("Error al intentar validar con IA. Revisa tu consola.");
           setIsUploading(false);
         }
      };

      reader.onerror = () => {
         alert("Error leyendo el archivo local.");
         setIsUploading(false);
      }

    } catch (err) {
      console.error(err);
      setIsUploading(false);
      alert("Ha ocurrido un error inesperado.");
    }
  };

  return (
    <main className="pt-24 pb-12 px-4 md:px-8 max-w-5xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        
        {/* Left Column: Context */}
        <aside className="md:w-1/3 flex flex-col gap-6">
          <div className="space-y-4">
            <h1 className="font-headline font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight leading-tight">
              Verificación de <span className="text-blue-600">Contrato.</span>
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed">
              Sube una copia de tu contrato actual o certificado de antigüedad. Esta información es crucial para garantizar transferencias seguras y transparentes.
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex gap-4">
            <div className="bg-white p-3 rounded-xl shadow-sm h-fit">
              <ShieldCheck className="text-teal-500" size={24} />
            </div>
            <div>
              <h3 className="font-headline font-bold text-slate-900 mb-1">Privacidad Garantizada</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Tus documentos están encriptados y solo serán visualizados de manera confidencial para la validación de tu permuta.
              </p>
            </div>
          </div>
        </aside>

        {/* Right Column: Upload Area */}
        <section className="md:w-2/3 w-full">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl shadow-blue-900/5 border border-slate-100 relative overflow-hidden">
            
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle size={48} />
                </div>
                <h2 className="text-2xl font-bold font-headline text-slate-900 mb-2">¡Documento validado!</h2>
                <p className="text-slate-500">Todo listo, redirigiendo a tu panel principal...</p>
              </motion.div>
            ) : (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="font-headline font-bold text-xl text-slate-900">Sube tu documento</h2>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">PASO 2 DE 2</span>
                </div>

                <div 
                  className={`border-3 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center transition-all ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'} ${file ? 'border-teal-500 bg-teal-50/30' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input 
                    type="file" 
                    id="file-upload" 
                    className="hidden" 
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange}
                  />
                  
                  {file ? (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm text-teal-600 flex items-center justify-center mb-4">
                        <FileText size={32} />
                      </div>
                      <p className="font-bold text-slate-800 mb-1">{file.name}</p>
                      <p className="text-sm text-slate-500 mb-6">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      <label htmlFor="file-upload" className="cursor-pointer text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                        Seleccionar otro archivo
                      </label>
                    </motion.div>
                  ) : (
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center w-full">
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors ${isDragging ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white text-blue-500 shadow-sm'}`}>
                        <Upload size={32} />
                      </div>
                      <p className="font-headline font-bold text-lg text-slate-800 mb-2">Arrastra y suelta aquí</p>
                      <p className="text-slate-500 text-sm mb-6">o haz clic para explorar en tu computadora</p>
                      <div className="text-xs font-medium bg-white px-4 py-2 border border-slate-200 rounded-lg text-slate-600">
                        Soporta PDF o Word (Max. 10MB)
                      </div>
                    </label>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-slate-100">
                  <button 
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="text-slate-500 font-headline font-bold hover:text-blue-600 transition-colors px-6 py-3"
                  >
                    Verificar más tarde
                  </button>
                  <button 
                    type="submit" 
                    disabled={!file || isUploading}
                    className={`w-full sm:w-auto px-8 py-4 font-headline font-extrabold text-lg rounded-xl transition-all flex items-center justify-center gap-2 ${!file ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-blue-500/20'}`}
                  >
                    {isUploading ? 'Subiendo...' : 'Enviar y Completar'}
                    {!isUploading && file && <ArrowRight size={20} />}
                  </button>
                </div>
              </div>
            )}
            
          </form>
        </section>
      </div>
    </main>
  );
};

export default ContractVerification;
