import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const generateBotResponse = async (history: { role: string; text: string }[], userMessage: string): Promise<string> => {
  if (!apiKey) {
    return "Maaf, sistem AI sedang offline (API Key missing).";
  }

  try {
    const model = 'gemini-3-pro-preview';
    
    // Convert history to format expected by Chat (though we are using generateContent here for simplicity with system instruction in every call or managing context manually, 
    // but best practice for chat is usually maintaining a ChatSession. 
    // Here we will use a fresh generation with context to keep it stateless in the service for this demo).
    
    const systemInstruction = `
      Anda adalah asisten virtual cerdas untuk Bengkel TEFA (Teaching Factory) SMKS Muhammadiyah Cangkringan.
      Semboyan sekolah: "Religius, Unggul, dan Kompeten".
      
      Peran Anda:
      1. Membantu pelanggan mengetahui status servis.
      2. Memberikan edukasi ringan tentang perawatan kendaraan (Mobil/TKRO dan Motor/TBSM).
      3. Menjelaskan fasilitas bengkel (Ruang tunggu nyaman, Mushola, Kantin TEFA, Free WiFi).
      4. Bersikap sopan, Islami (mengucapkan salam jika disapa), dan profesional.
      
      Jangan memberikan diagnosa mekanis mendalam yang berbahaya, sarankan selalu untuk membawa ke bengkel kami untuk pengecekan langsung oleh siswa kompeten kami.
    `;

    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: systemInstruction,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message: userMessage });
    return result.text || "Maaf, saya tidak dapat memproses permintaan Anda saat ini.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Terjadi kesalahan pada sistem kecerdasan buatan. Silakan coba lagi nanti.";
  }
};