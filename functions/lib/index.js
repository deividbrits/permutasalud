"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.enviarCorreoBienvenida = exports.verifyContractUpload = void 0;
const https_1 = require("firebase-functions/v2/https");
const generative_ai_1 = require("@google/generative-ai");
const admin = __importStar(require("firebase-admin"));
const firestore_1 = require("firebase-admin/firestore");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const functions = __importStar(require("firebase-functions"));
const nodemailer = __importStar(require("nodemailer"));
const cors = require("cors");
// Intenta cargar la llave de servicio real para que Firebase Admin no falle (invalid_grant)
const serviceAccountPath = path.resolve(__dirname, "../../serviceAccountKey.json");
if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: `${serviceAccount.project_id}.appspot.com`
    });
}
else {
    admin.initializeApp();
}
const db = admin.firestore();
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const corsHandler = cors({ origin: true });
exports.verifyContractUpload = (0, https_1.onRequest)({ timeoutSeconds: 120 }, (req, res) => {
    corsHandler(req, res, async () => {
        try {
            const { userId, base64File, fileName, mimeType } = req.body;
            if (!userId || !base64File) {
                res.status(400).json({ data: { success: false, error: 'Faltan parámetros requeridos (userId o base64File).' } });
                return;
            }
            // 2. Decode the base64 string
            // base64File is expected to be just the raw base64 string (without data:application/pdf;base64,)
            const cleanBase64 = base64File.replace(/^data:.*\/.*;base64,/, "");
            const buffer = Buffer.from(cleanBase64, 'base64');
            const fileMimeType = mimeType || "application/pdf";
            const safeName = fileName || 'contrato.pdf';
            const filePath = `contracts/${userId}/${Date.now()}_${safeName}`;
            const uid = userId; // Compatibility variable
            // 3. Setup Storage and Save the file
            let fileUri = "Archivos locales no guardados. Activa Firebase Storage.";
            try {
                const bucket = admin.storage().bucket();
                const file = bucket.file(filePath);
                await file.save(buffer, {
                    metadata: { contentType: fileMimeType }
                });
                console.log("Archivo guardado en:", filePath);
                fileUri = `gs://${bucket.name}/${filePath}`;
            }
            catch (storageError) {
                console.warn("No se pudo guardar en Storage (¿No habilitado o bucket incorrecto?). Omitiendo guardado en disco...", storageError);
            }
            // Note: for this example we assume PDF since it's a contract.
            // Gemini supports application/pdf natively via inlineData. 
            // We can determine mimeType properly based on the file extension/metadata in a production app. (e.g. image/jpeg, application/pdf)
            // Note: we already have the fileMimeType from the request body
            // 4. Construct Prompt
            const prompt = `
     Eres un agente legal asistente especializado en el sistema de salud público de Chile.
     Analiza este documento y determina si cumple EXACTA Y ESTRICTAMENTE con los siguientes 4 puntos:
     1. Es Efectivamente un contrato de trabajo válido (o decreto de nombramiento).
     2. Es de un funcionario de la salud.
     3. Indica explícitamente que su calidad contractual es "titular", "indefinido" o "plazo fijo" indicando su pertenencia de planta. Principalmente buscando "titular indefinido".
     4. Pertenece a la dotación de planta de funcionarios de Atención Primaria (APS / Departamento de Salud Municipal / CESFAM).
     
     Formato de respuesta OBLIGATORIO en JSON puro (sin marcas de formato markdown (\`\`\`json) ):
     {
       "isValid": true o false (sólo true si cumple todos los criterios suficientes),
       "reason": "Explicación breve de por qué se aprueba o rechaza. Qué partes cumple y qué le falta.",
       "isWorkContract": true o false,
       "isHealthWorker": true o false,
       "isPermanent": true o false,
       "isPrimaryCare": true o false
     }
     `;
            // 5. Send to Gemini
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const result_ai = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        data: buffer.toString("base64"),
                        mimeType: fileMimeType
                    }
                }
            ]);
            const text = result_ai.response.text() || "{}";
            // Clean JSON response (in case the LLM returned markdown despite instructions)
            const cleanedText = text.replace(/```json/gi, '').replace(/```/gi, '').trim();
            let result;
            try {
                result = JSON.parse(cleanedText);
            }
            catch (parseError) {
                throw new Error("Respuesta inválida estructurada desde la IA.");
            }
            // 6. Update user's profile in Firestore
            await db.collection("users").doc(uid).update({
                contractVerification: {
                    status: result.isValid ? 'VERIFIED' : 'REJECTED',
                    reason: result.reason,
                    verifiedAt: firestore_1.FieldValue.serverTimestamp(),
                    fileUri: fileUri,
                    aiDetails: {
                        isWorkContract: result.isWorkContract,
                        isHealthWorker: result.isHealthWorker,
                        isPermanent: result.isPermanent,
                        isPrimaryCare: result.isPrimaryCare
                    }
                }
            });
            // 7. Return to the frontend
            res.json({ data: { success: true, data: result } });
        }
        catch (error) {
            console.error("Error validando el contrato:", error);
            res.status(500).json({ data: { success: false, error: 'Ocurrió un error en la verificación: ' + error.message } });
        }
    }); // End of cors wrapper
}); // End of onRequest
// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_EMAIL || "contacto.permutasalud@gmail.com",
        pass: process.env.GMAIL_PASSWORD || "",
    },
});
// 1. Correo de Bienvenida (Se activa al registrarse un usuario nuevo en la colección 'users')
exports.enviarCorreoBienvenida = functions.firestore
    .document("users/{userId}")
    .onCreate(async (snap, context) => {
    const userData = snap.data();
    const email = userData.email;
    const displayName = userData.firstName ? `${userData.firstName} ${userData.lastName}` : "Profesional de la Salud";
    if (!email)
        return;
    const mailOptions = {
        from: `"PermutaSalud" <contacto.permutasalud@gmail.com>`,
        to: email,
        subject: "¡Bienvenido a PermutaSalud! 🎉",
        html: `
        <h2>Hola ${displayName},</h2>
        <p>Gracias por registrarte en PermutaSalud. Estamos felices de tenerte con nosotros.</p>
        <p>Ya puedes completar tu perfil y subir tu contrato para que comencemos a buscar tu permuta ideal.</p>
        <br>
        <p>Saludos,<br>El equipo de PermutaSalud</p>
      `,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log("Correo de bienvenida enviado a:", email);
    }
    catch (error) {
        console.error("Error enviando correo de bienvenida:", error);
    }
});
//# sourceMappingURL=index.js.map