import { useState, useCallback, useRef, useEffect } from "react";
import { ref, getDownloadURL } from "firebase/storage";
import { ANIMAL_MAP, ALL_ANIMALS } from "../data/animals";
import { BIRD_MAP } from "../data/birds";
import { COLOR_MAP } from "../data/colors";
import type { Animal, Bird, ColorItem, GameMode } from "../types";
import { playClickSound, pcmToWav } from "../utils/audioUtils";
import { playPianoNote } from "../utils/pianoUtils";
import { genAI } from "../utils/ai";
import { storage } from "../firebase";

export const useGameLogic = () => {
  const [gameMode, setGameMode] = useState<GameMode>("animals");
  const [displayType, setDisplayType] = useState<"single" | "multiple">("single");
  const [currentItems, setCurrentItems] = useState<(Animal | Bird | ColorItem)[]>([]);
  const [lastKeyPressed, setLastKeyPressed] = useState<string | null>(null);
  const [lastPressId, setLastPressId] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const imageCache = useRef<Record<string, string>>({});
  const soundCache = useRef<Record<string, string>>({});
  const processingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getRandomAnimal = () =>
    ALL_ANIMALS[Math.floor(Math.random() * ALL_ANIMALS.length)];

  const generateAIImage = async (name: string, folder: string = "animals") => {
    const localStorageKey = `cached_image_${name}`;
    
    try {
      const cached = localStorage.getItem(localStorageKey);
      if (cached) return cached;
    } catch (e) {}

    if (imageCache.current[name]) return imageCache.current[name];

    try {
      setIsGeneratingImage(true);
      const sanitizedName = name.toLowerCase().replace(/\s+/g, '-');
      const storageRef = ref(storage, `${folder}/${sanitizedName}.png`);

      const url = await getDownloadURL(storageRef);
      
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Fetch failed");
        
        const blob = await response.blob();
        
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result as string;
            imageCache.current[name] = base64data;
            try {
              localStorage.setItem(localStorageKey, base64data);
            } catch (e) {}
            setIsGeneratingImage(false);
            resolve(base64data);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (fetchErr) {
        setIsGeneratingImage(false);
        return url;
      }
    } catch (err) {
      setIsGeneratingImage(false);
      return null;
    }
  };

  const speakText = async (text: string, cacheKey: string) => {
    if (isSpeaking) return;
    
    if (soundCache.current[cacheKey]) {
        setIsSpeaking(true);
        const audio = new Audio(soundCache.current[cacheKey]);
        audio.onended = () => setIsSpeaking(false);
        await audio.play();
        return;
    }

    setIsSpeaking(true);
    setError(null);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-tts" });
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text }] }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } } },
        } as any,
      });

      const response = await result.response;
      const audioPart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      
      if (!audioPart || !audioPart.inlineData) throw new Error("No audio data");

      const audioBlob = pcmToWav(audioPart.inlineData.data, 24000);
      const audioUrl = URL.createObjectURL(audioBlob);
      
      soundCache.current[cacheKey] = audioUrl;

      const audio = new Audio(audioUrl);
      audio.onended = () => setIsSpeaking(false);
      await audio.play();
    } catch (err) {
      console.error(err);
      setError("Couldn't hear that right now.");
      setIsSpeaking(false);
    }
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key;
      setLastKeyPressed(key === " " ? "Space" : key);
      setLastPressId(Date.now());
      playClickSound();

      if (key === " ") event.preventDefault();

      if (processingTimeout.current) clearTimeout(processingTimeout.current);

      processingTimeout.current = setTimeout(async () => {
        if (/^\d$/.test(key)) {
          const count = parseInt(key, 10);
          if (count === 0) {
            setDisplayType("single");
            setCurrentItems([]);
          } else {
            const baseAnimal = getRandomAnimal();
            const batch = Array(count).fill(baseAnimal);
            setDisplayType("multiple");
            setCurrentItems(batch);
          }
          return;
        }

        if (key === " ") {
          const animal = getRandomAnimal();
          setDisplayType("single");
          setCurrentItems([animal]);
          speakText(`Make a short, funny, silly sound effect for a ${animal.name}. Then say something funny as the ${animal.name}.`, `${animal.name}-funny`);
          return;
        }

        if (/^[a-zA-Z]$/.test(key)) {
          const char = key.toLowerCase();
          
          if (gameMode === "piano") {
            playPianoNote(key);
            setCurrentItems([]);
            return;
          }

          if (gameMode === "colors") {
            const color = COLOR_MAP[char];
            if (color) {
              setDisplayType("single");
              setCurrentItems([color]);
              speakText(color.sound, color.name);
            } else {
              setError(`No color found for ${key.toUpperCase()}!`);
            }
            return;
          }

          const map = gameMode === "birds" ? BIRD_MAP : ANIMAL_MAP;
          const folder = gameMode === "birds" ? "birds" : "animals";
          const itemsForChar = map[char];

          if (itemsForChar && itemsForChar.length > 0) {
            const item = itemsForChar[Math.floor(Math.random() * itemsForChar.length)];
            setDisplayType("single");
            setCurrentItems([item]);

            speakText(`Say in the style of a nature documentary narrator: ${item.sound}`, `${item.name}-doc`);

            const imageUrl = await generateAIImage(item.name, folder);
            if (imageUrl) {
              setCurrentItems([{ ...item, imageUrl }]);
            }
          } else {
            setError(`No ${gameMode.slice(0, -1)} found for ${key.toUpperCase()}!`);
          }
        }
      }, 300);
    },
    [gameMode, isSpeaking]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (processingTimeout.current) clearTimeout(processingTimeout.current);
    };
  }, [handleKeyDown]);

  return {
    gameMode,
    setGameMode,
    displayType,
    currentItems,
    lastKeyPressed,
    lastPressId,
    isSpeaking,
    isGeneratingImage,
    error
  };
};
