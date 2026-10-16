import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";

const productRef = doc(db, "products", "iaaetP1S5N34xaW4eN7i");

// Storing the icon name as a string to save in Firestore
const features = [
  {
    icon: "FaBrain",
    title: "Brain Training Meets Fun",
    desc: "Sharpen memory, focus, and cognitive speed through a playful card-picking experience designed to challenge the mind without feeling like work.",
  },
  {
    icon: "FaGamepad",
    title: "Immersive & Challenging Gameplay",
    desc: "Progress through increasingly demanding levels that reward skill, attention, and strategy — keeping players engaged and motivated.",
  },
  {
    icon: "FaBolt",
    title: "Power-Ups & Boosts",
    desc: "Unlock special power-ups that enhance gameplay, give tactical advantages, and help you overcome tougher stages.",
  },
  {
    icon: "FaShoppingCart",
    title: "In-Game Shop",
    desc: "Use earned coins to purchase power-ups, bonuses, and enhancements that personalize your gameplay experience.",
  },
  {
    icon: "FaTrophy",
    title: "Achievements & Milestones",
    desc: "Complete challenges and unlock achievements that showcase your progress, skill, and dedication.",
  },
  {
    icon: "FaChartBar",
    title: "Detailed Player Stats",
    desc: "Track performance metrics such as high scores, progress history, and gameplay trends over time.",
  },
  {
    icon: "FaCog",
    title: "Custom Game Settings",
    desc: "Adjust sound, difficulty, and gameplay preferences to suit your style — whether casual or competitive.",
  },
  {
    icon: "FaMobileAlt",
    title: "Coming Soon on Android & iOS",
    desc: "The full mobile experience is on the way, bringing optimized performance, native controls, and seamless gameplay to Android and iOS devices.",
  },
];

// const colors = {
//   primary: "#8a2be2",
//   secondary: "#4b0082",
//   accent: "#e595e4",
//   bg: "#fffff0",
// };

async function addFeaturesToProduct() {
  try {
    await updateDoc(productRef, { features });
    console.log("Product features updated successfully!");
  } catch (error) {
    console.error("Error updating product features: ", error);
  }
}

// async function addColorsToProduct() {
//   try {
//     await updateDoc(productRef, { colors });
//     console.log("Product colors updated successfully!");
//   } catch (error) {
//     console.error("Error updating product colors: ", error);
//   }
// }

addFeaturesToProduct();
// addColorsToProduct();
