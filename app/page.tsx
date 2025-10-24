"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  Menu as MenuIcon,
  X,
  Languages,
  Search,
  ChevronRight,
  Coffee,
  Pizza,
  Sandwich,
  Soup,
  IceCream,
  Salad,
  CupSoda,
  Images,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function HomePage() {
  // --- Scroll optimization to prevent Chrome crash ---
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Replace this with your actual scroll logic or animations
          console.log("Scrolling..."); // Example
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  // -----------------------------------------------------

  return (
    <div className="h-[200vh]">
      {/* Example long page to allow scrolling */}
      <h1>Scroll Test Page</h1>
    </div>
  );
}


/* ============================================================================
   1) Types
   ========================================================================== */
type LangKey = "fr" | "en" | "nl";

type CategoryId =
  | "drinks"
  | "breakfast"
  | "entrees"
  | "plats"
  | "pastas"
  | "pizzas"
  | "aperitifs"
  | "burgers"
  | "crepes_savory"
  | "tacos"
  | "sandwiches"
  | "panini"
  | "sweets_crepes_gaufres_pancakes"
  | "desserts";

// 2.x) Category → image path (public assets)
const CATEGORY_IMAGES: Record<CategoryId, string> = {
  drinks: "/images/categories/matcha.jpg",       // use matcha.png for drinks
  breakfast: "/images/categories/toast.jpg",     // toast.jpg for breakfast
  entrees: "/images/categories/salmon.jpg",      // salmon.jpg for starters/entrées
  plats: "/images/categories/bun.jpg",           // bun.jpg for mains
  pastas: "/images/categories/pasta.jpg",        // pasta.jpg for pastas
  pizzas: "/images/categories/crepe.jpg",        // crepe.jpg as placeholder
  aperitifs: "/images/categories/frap.jpg",      // frap.jpg (frappé style drink) for aperitifs
  burgers: "/images/categories/burger.jpg",      // burger.jpg for burgers
  crepes_savory: "/images/categories/crepe.jpg", // crepe.jpg for savory crêpes
  tacos: "/images/categories/bsandwich.jpg",     // bsandwich.jpg as placeholder
  sandwiches: "/images/categories/sandwich.jpg", // sandwich.jpg for sandwiches
  panini: "/images/categories/bsandwich.jpg",    // bsandwich.jpg for panini
  sweets_crepes_gaufres_pancakes: "/images/categories/pancake.jpg", // pancake.jpg
  desserts: "/images/categories/dessert.jpg",    // dessert.jpg for desserts
};

// Optional: Subcategory heroes (use exact raw subcategory keys you already use)
// Put this where SUBCAT_HERO is defined
const SUBCAT_HERO: Partial<Record<CategoryId, Record<string, string>>> = {
  // ——— DRINKS
  drinks: {
    "Matcha": "/images/categories/matcha.jpg",                 // ← your file is .png
    "Café & Spécialités": "/images/categories/coffe-special.jpg",
    "Rafraîchissants": "/images/categories/ref.jpg",
    "Smoothies": "/images/categories/smoothie.jpg",
    "Redbull Crémeux": "/images/categories/creamy.jpg",
    "Boissons Fraîches": "/images/categories/soda.jpg", // note capital F to match data
    "Mojitos": "/images/categories/cock.jpg",
    "Thés glacés": "/images/categories/iced.jpg",
    "Cocktails sans alcool": "/images/categories/juicy.jpg",
    "Jus": "/images/categories/juice.jpg",
    "Jus pressés": "/images/categories/pressed.webp",
    "Nos Thé": "/images/categories/tea.jpg",
    "Boissons Chaudes": "/images/categories/black.jpg",
  },

  // ——— BREAKFAST
  breakfast: {
    "Espagnol": "/images/categories/spanish .webp",
    "Marocaine": "/images/categories/rghifa.jpg",
    "Bols": "/images/categories/boowl.jpg",
    "Tartines": "/images/categories/toast.jpg",
    "Petits pains briochés": "/images/categories/bun.jpg",
    "Sandwichs": "/images/categories/bsandwich.jpg",
    "Œufs": "/images/categories/egg.jpg",
    "À la Carte": "/images/categories/alacarte.jpg",
    "Toast Hollandais": "/images/categories/holland.jpg",
    "Formules Enfants": "/images/categories/pancake.webp",
    "Crêpes": "/images/categories/crepe.jpg",
  },

  // ——— ENTRÉES
  entrees: {
    "Entrées Froides": "/images/categories/salad.webp",
    "Entrées Chaudes": "/images/categories/soup.jpg",
    "À Base Poisson": "/images/categories/salmon.webp",
    "À Base Viande & Poulet": "/images/categories/burger.jpg",
    "Marocains": "/images/categories/tagine.webp",
  },

  // ——— MAINS (PLATS)
  plats: {
    "À Base Poisson": "/images/categories/salmon.webp",
    "À Base Viande & Poulet": "/images/categories/steak.jpg",
    "Marocains": "/images/categories/tagine.webp",
  },

  // ——— PÂTES (PASTAS)
  pastas: {
    "Pâtes": "/images/categories/pasta.webp",
  },

  // ——— PIZZAS
  pizzas: {
    "Pizzas": "/images/categories/pizza.webp",
    "pizzas": "/images/categories/pizza.webp", // one item uses lowercase; map both to be safe
  },

  // ——— APÉRITIFS + TEX-MEX
  aperitifs: {
    "Apéritifs": "/images/categories/mozza.jpg",
    "Tex Mex": "/images/categories/mozza.jpg",
  },

  // ——— TACOS
  tacos: {
    "Tacos": "/images/categories/tacos.webp",
  },

  // ——— SANDWICHES & PANINI
  sandwiches: {
    "Sandwiches": "/images/categories/sandwich.jpg",
  },
  panini: {
    "Panini": "/images/categories/panini.webp",
  },

  // ——— BURGERS
  burgers: {
    "Burgers": "/images/categories/burger.jpg",
  },

  // ——— CRÊPES SALÉES
  crepes_savory: {
    "Crêpes Salées": "/images/categories/crepe.jpg",
  },

  // ——— CRÊPES / GAUFRES / PANCAKES (SUCRÉS)
  sweets_crepes_gaufres_pancakes: {
    "Crêpes & Gauffres": "/images/categories/waffle.webp", // keep “Gauffres” to match your data
    "Pancake": "/images/categories/waffle.webp",
  },

  // ——— DESSERTS & ICE CREAM
  desserts: {
    "Desserts": "/images/categories/dessert.jpg",
    "Frappuccino": "/images/categories/frap.jpg",
    "freakshake": "/images/categories/freakshake.jpg",  // lowercase in data
    "Coupes glacées": "/images/categories/icea.jpg",
    "Composez Votre Glace": "/images/categories/icea.jpg",
  },
};

// Pick a hero for a subcategory with fallbacks
function subcatHeroImage(
  catId: CategoryId,
  rawSubcat: string,
  items: MenuItem[] = []
): string {
  // 1) explicit mapping
  const mapped = SUBCAT_HERO[catId]?.[rawSubcat];
  if (mapped) return mapped;

  // 2) item tagged as hero
  const tagged = items.find((i) => i.tags?.includes("hero") && i.image);
  if (tagged?.image) return tagged.image;

  // 3) any item with image
  const anyWithImage = items.find((i) => i.image);
  if (anyWithImage?.image) return anyWithImage.image;

  // 4) fallback to category banner
  return catImage(catId);
}

// Helper with a safe fallback image if a file is missing
function catImage(id: CategoryId) {
  return CATEGORY_IMAGES[id] ?? "/images/categories/placeholder.webp";
}


export type MenuItem = {
  id: string;
  price: number | null; // some prices TBD in your data
  category: CategoryId;
  subcategory?: string; // language-neutral slug-like label
  image?: string;
  tags?: string[];
};

/* ============================================================================
   2) Language meta + UI strings (brand, actions, headers)
   ========================================================================== */
const UI: Record<LangKey, { rtl?: boolean; brand: string; chooseLanguage:  string; menu:  string; search: string; storyTitle: string; story: string; all: string; itemsCount: (n: number) => string; priceMAD: (v: number) => string; }> = {
  fr: {
    brand: "WOODS",
    chooseLanguage: "Choisissez votre langue",
    menu: "Notre Carte",
    search: "Rechercher des plats, ingrédients…",
    storyTitle: "Notre histoire",
    story: "Chez WOODS, nous mêlons la chaleur marocaine à un esprit contemporain. Des produits de saison, locaux et respectés.",
    all: "Tout",
    itemsCount: (n) => `${n}`,
    priceMAD: (v) => `${v} DH`,
  },
  en: {
    brand: "WOODS",
    chooseLanguage: "Choose your language",
    menu: "Our Menu",
    search: "Search dishes, ingredients…",
    storyTitle: "Our Story",
    story: "At WOODS, we blend Moroccan warmth with modern craft. Seasonal, local produce handled with care.",
    all: "All",
    itemsCount: (n) => `${n}`,
    priceMAD: (v) => `${v} MAD`,
  },
  nl: {
    brand: "WOODS",
    chooseLanguage: "Kies je taal",
    menu: "Onze kaart",
    search: "Zoek gerechten of ingrediënten…",
    storyTitle: "Ons verhaal",
    story: "Bij WOODS combineren we Marokkaanse warmte met moderne ambacht. Seizoensgebonden en lokaal, met respect bereid.",
    all: "Alles",
    itemsCount: (n) => `${n}`,
    priceMAD: (v) => `${v} MAD`,
  },
};

/* ============================================================================
   3) Category & Subcategory labels
   - Keys are language-neutral; values are per-language strings.
   ========================================================================== */
const CAT_LABELS: Record<LangKey, Record<CategoryId, string>> = {
  fr: {
    drinks: "Boissons",
    breakfast: "Petit-déjeuner",
    entrees: "Entrées",
    plats: "Plats",
    pastas: "Pâtes",
    pizzas: "Pizzas",
    aperitifs: "Apéritifs",
    burgers: "Burgers",
    crepes_savory: "Crêpes salées",
    tacos: "Tacos",
    sandwiches: "Sandwichs",
    panini: "Panini",
    sweets_crepes_gaufres_pancakes: "Crêpes & Gaufres sucrées",
    desserts: "Desserts",
  },
  en: {
    drinks: "Drinks",
    breakfast: "Breakfast",
    entrees: "Starters",
    plats: "Mains",
    pastas: "Pastas",
    pizzas: "Pizzas",
    aperitifs: "Appetizers",
    burgers: "Burgers",
    crepes_savory: "Savory Crêpes",
    tacos: "Tacos",
    sandwiches: "Sandwiches",
    panini: "Panini",
    sweets_crepes_gaufres_pancakes: "Sweet Crêpes & Waffles",
    desserts: "Desserts",
  },
  nl: {
    drinks: "Dranken",
    breakfast: "Ontbijt",
    entrees: "Voorgerechten",
    plats: "Hoofdgerechten",
    pastas: "Pasta",
    pizzas: "Pizza’s",
    aperitifs: "Aperitief",
    burgers: "Burgers",
    crepes_savory: "Hartige crêpes",
    tacos: "Taco’s",
    sandwiches: "Broodjes",
    panini: "Panini",
    sweets_crepes_gaufres_pancakes: "Zoete crêpes & wafels",
    desserts: "Desserts",
  },
};

/** Curated subcategory labels you actually use */
const SUB_LABELS: Record<LangKey, Record<string, string>> = {
  fr: {
    "Matcha": "Matcha",
    "Café & Spécialités": "Café & Spécialités",
    "Rafraîchissants": "Rafraîchissants",
    "Smoothies": "Smoothies",
    "Redbull Crémeux": "Redbull Crémeux",
    "Boissons fraîches": "Boissons fraîches",
    "Mojitos": "Mojitos",
    "Thés glacés": "Thés glacés",
    "Cocktails sans alcool": "Mocktails",
    "Jus": "Jus",
    "Jus pressés": "Jus pressés",

    "Espagnol": "Espagnol",
    "Marocaine": "Marocaine",
    "Bols": "Bols",
    "Tartines": "Tartines",
    "Petits pains briochés": "Petits pains briochés",
    "Sandwichs": "Sandwichs",
    "Œufs": "Œufs",
    "À la Carte": "À la Carte",
    "Toast Hollandais": "Toast Hollandais",
    "Formules Enfants": "Formules Enfants",

    "Entrées Froides": "Entrées Froides",
    "Entrées Chaudes": "Entrées Chaudes",
    "À Base Poisson": "À Base Poisson",
    "À Base Viande & Poulet": "À Base Viande & Poulet",
    "Marocains": "Marocains",

    "Crêpes Salées": "Crêpes Salées",
    "Crêpes & Gauffres": "Crêpes & Gaufres",
    "Pancake": "Pancakes",

    "Frappuccino": "Frappuccino",
    "freakshake": "Freakshake",
    "Coupes glacées": "Coupes glacées",
    "Composez Votre Glace": "Composez Votre Glace",
  },
  en: {
    "Matcha": "Matcha",
    "Café & Spécialités": "Coffee & Signatures",
    "Rafraîchissants": "Refreshers",
    "Smoothies": "Smoothies",
    "Redbull Crémeux": "Creamy Red Bull",
    "Boissons fraîches": "Cold Drinks",
    "Mojitos": "Mojitos (Non-alcoholic)",
    "Thés glacés": "Iced Teas",
    "Cocktails sans alcool": "Mocktails",
    "Jus": "Juices",
    "Jus pressés": "Pressed Juices",

    "Espagnol": "Spanish Set",
    "Marocaine": "Moroccan Set",
    "Bols": "Bowls",
    "Tartines": "Open-Face Toasts",
    "Petits pains briochés": "Brioche Buns",
    "Sandwichs": "Sandwiches",
    "Œufs": "Eggs",
    "À la Carte": "À la carte",
    "Toast Hollandais": "Dutch Toast",
    "Formules Enfants": "Kids Menu",

    "Entrées Froides": "Cold Starters",
    "Entrées Chaudes": "Hot Starters",
    "À Base Poisson": "Fish",
    "À Base Viande & Poulet": "Meat & Chicken",
    "Marocains": "Moroccan",

    "Crêpes Salées": "Savory Crêpes",
    "Crêpes & Gauffres": "Crêpes & Waffles",
    "Pancake": "Pancakes",

    "Frappuccino": "Frappuccino",
    "freakshake": "Freakshake",
    "Coupes glacées": "Ice-Cream Coupes",
    "Composez Votre Glace": "Build Your Ice-Cream",
  },
  nl: {
    "Matcha": "Matcha",
    "Café & Spécialités": "Koffie & Specials",
    "Rafraîchissants": "Refreshers",
    "Smoothies": "Smoothies",
    "Redbull Crémeux": "Romige Red Bull",
    "Boissons fraîches": "Koude dranken",
    "Mojitos": "Mojito’s (alcoholvrij)",
    "Thés glacés": "IJsthee",
    "Cocktails sans alcool": "Mocktails",
    "Jus": "Sappen",
    "Jus pressés": "Versgeperste sappen",

    "Espagnol": "Spaans menu",
    "Marocaine": "Marokkaans menu",
    "Bols": "Bowls",
    "Tartines": "Open toasts",
    "Petits pains briochés": "Brioches",
    "Sandwichs": "Broodjes",
    "Œufs": "Eieren",
    "À la Carte": "À la carte",
    "Toast Hollandais": "Hollandse toast",
    "Formules Enfants": "Kinderformules",

    "Entrées Froides": "Koude voorgerechten",
    "Entrées Chaudes": "Warme voorgerechten",
    "À Base Poisson": "Vis",
    "À Base Viande & Poulet": "Vlees & Kip",
    "Marocains": "Marokkaans",

    "Crêpes Salées": "Hartige crêpes",
    "Crêpes & Gauffres": "Crêpes & wafels",
    "Pancake": "Pannenkoeken",

    "Frappuccino": "Frappuccino",
    "freakshake": "Freakshake",
    "Coupes glacées": "Ijscoupes",
    "Composez Votre Glace": "Stel je ijs samen",
  },
};

/* ============================================================================
   4) Item translations (name + desc) — keyed by item id
   - FR is the authoritative source (complete).
   - EN/NL contain curated culinary translations.
   - Any missing key falls back to FR.
   ========================================================================== */
type ItemText = { name: string; desc?: string };

type ItemsTextPack = Record<string, ItemText>;

const ITEMS_FR: ItemsTextPack = {
  // ——— Drinks (Matcha)
"matcha-latte": { name: "Matcha Latte / Glacé", desc: "Thé matcha, lait au choix" },
"matcha-coco": { name: "Matcha Coco", desc: "Matcha, lait de coco" },
"matcha-pink-foam": { name: "Matcha Mousse Rose", desc: "Matcha, mousse sucrée rose" },
"matcha-fraise": { name: "Matcha Fraise", desc: "Matcha, fraise" },
"matcha-mangue": { name: "Matcha Mangue", desc: "Matcha, mangue" },

// ——— Drinks (Café & Spécialités)
"coffee-coco-latte": { name: "Latte Coco", desc: "Expresso, lait de coco" },
"coffee-creme-brulee-latte": { name: "Latte Crème Brûlée", desc: "Latte sucré, caramel croquant" },
"coffee-spanish-latte": { name: "Latte Espagnol", desc: "Latte sucré façon espagnole" },
"coffee-saffron-latte": { name: "Latte Safran", desc: "Infusion de safran, latte" },

// ——— Drinks (Rafraîchissants)
"refresher-hibiscus": { name: "Hibiscus", desc: "Infusion d’hibiscus glacée" },
"refresher-hibiscus-peche": { name: "Hibiscus Pêche", desc: "Hibiscus, pêche" },
"refresher-tropical-ginger": { name: "Gingembre Tropical", desc: "Gingembre, fruits exotiques" },
"refresher-watermelon-fizz": { name: "Fizz Pastèque", desc: "Pastèque, pétillant" },

// ——— Drinks (Smoothies)
"smoothie-multivitamine": { name: "Multivitamines", desc: "Mélange de fruits variés" },
"smoothie-california-dream": { name: "California Dream", desc: "Fruits tropicaux" },
"smoothie-jack-special": { name: "Jack Spécial", desc: "Signature maison" },
"smoothie-coco-mango": { name: "Coco Mangue", desc: "Noix de coco, mangue" },
"smoothie-bananasa": { name: "Bananasa", desc: "Banane, lait au choix" },

// ——— Drinks (Redbull Crémeux)
"creamy-redbull-blueberry": { name: "Redbull Crémeux Myrtille", desc: "Boisson énergisante, crème, myrtille" },
"creamy-redbull-strawberry": { name: "Redbull Crémeux Fraise", desc: "Boisson énergisante, crème, fraise" },
"creamy-redbull-peach": { name: "Redbull Crémeux Pêche", desc: "Boisson énergisante, crème, pêche" },


// ——— Drinks (Mojitos sans alcool)
"mojito-green": { name: "Mojito Vert", desc: "Citron vert, menthe, pétillant" },
"mojito-strawberry": { name: "Mojito Fraise", desc: "Fraise, citron vert, menthe" },
"mojito-passion": { name: "Mojito Passion", desc: "Fruit de la passion, menthe" },
"mojito-redbull": { name: "Mojito Redbull", desc: "Red Bull, citron vert, menthe" },
"mojito-strawberry-bull": { name: "Mojito Bull Fraise", desc: "Red Bull, fraise, menthe" },
"mojito-black": { name: "Mojito Noir", desc: "Cassonade foncée, menthe" },

// ——— Drinks (Thés glacés)
"icedtea-raspberry": { name: "Thé Glacé Framboise", desc: "Infusion froide framboise" },
"icedtea-lemon": { name: "Thé Glacé Citron", desc: "Infusion froide citron" },

// ——— Drinks (Cocktails sans alcool)
"mocktail-florida": { name: "Florida", desc: "Agrumes, pétillant" },
"mocktail-bora-bora": { name: "Bora Bora", desc: "Ananas, coco" },
"mocktail-pinacolada": { name: "Piñacolada", desc: "Coco, ananas" },
"mocktail-ocean-11": { name: "Ocean 11", desc: "Bleuet, agrumes" },

// ——— Drinks (Jus)
"juice-orange": { name: "Jus d’Orange", desc: "Pressé minute ou nectar" },
"juice-lemon": { name: "Jus de Citron", desc: "Citron frais" },
"juice-lemon-mint": { name: "Citron & Menthe", desc: "Citron, menthe" },
"juice-carrot": { name: "Jus de Carotte", desc: "Carotte fraîche" },
"juice-banana": { name: "Jus de Banane", desc: "Banane, lait au choix" },
"juice-strawberry": { name: "Jus de Fraise", desc: "Fraise mixée" },
"juice-apple": { name: "Jus de Pomme", desc: "Pomme douce" },
"juice-peach": { name: "Jus de Pêche", desc: "Pêche, douceur" },
"juice-avocado": { name: "Jus d’Avocat", desc: "Avocat onctueux" },
"juice-mango": { name: "Jus de Mangue", desc: "Mangue mûre" },
"juice-pineapple": { name: "Jus d’Ananas", desc: "Ananas tropical" },
"juice-kiwi": { name: "Jus de Kiwi", desc: "Kiwi acidulé" },

// ——— Drinks (Jus pressés)
"pressed-apple": { name: "Jus de Pomme Pressé", desc: "Pomme pressée à froid" },
"pressed-pineapple": { name: "Jus d’Ananas Pressé", desc: "Ananas pressé à froid" },
"pressed-carrot": { name: "Jus de Carotte Pressé", desc: "Carotte pressée à froid" },
"pressed-pomegranate": { name: "Jus de Grenade Pressé", desc: "Grenade pressée à froid" },
"pressed-watermelon": { name: "Jus de Pastèque Pressé", desc: "Pastèque pressée à froid" },

// ——— Drinks (Boissons fraîches)
"drink-water-33cl": { name: "Eau minérale 33 cl", desc: "" },
"drink-water-50cl": { name: "Eau minérale 1/2 l", desc: "" },
"drink-soda": { name: "Boissons gazeuses", desc: "" },
"drink-iced-tea": { name: "Thé glacé citron/pêche", desc: "" },
"drink-beer-na": { name: "Bière sans alcool", desc: "" },
"drink-redbull": { name: "Red Bull", desc: "" },

// ——— Drinks (Nos Thés)
"tea-mint": { name: "Thé à la menthe", desc: "" },
"tea-american": { name: "Thé américain", desc: "" },
"tea-infusion": { name: "Infusion", desc: "" },
"tea-black": { name: "Thé noir", desc: "" },
"tea-special": { name: "Thé spécial", desc: "" },
"tea-black-special": { name: "Thé noir spécial", desc: "" },

// ——— Drinks (Boissons Chaudes)
"hot-espresso": { name: "Expresso", desc: "" },
"hot-americano": { name: "Café américain", desc: "" },
"hot-milk": { name: "Lait chaud", desc: "" },
"hot-nespresso": { name: "Nespresso", desc: "" },
"hot-capp-italian": { name: "Cappuccino italien (mousse de lait)", desc: "" },
"hot-nespresso-creme": { name: "Nespresso crème", desc: "" },
"hot-nespresso-double": { name: "Nespresso Double", desc: "" },
"hot-flavored": { name: "Café aromatisé (caramel / noisette / vanille)", desc: "" },
"hot-cafe-creme": { name: "Café crème", desc: "" },
"hot-nescafe-lait": { name: "Nescafé au lait", desc: "" },
"hot-chocolate": { name: "Chocolat chaud", desc: "" },
"hot-capp-vanille-noisette": { name: "Cappuccino vanille/noisette chantilly", desc: "" },
"hot-royal": { name: "Café royal", desc: "" },
"hot-double": { name: "Café double", desc: "" },
"hot-choc-chantilly": { name: "Chocolat chantilly", desc: "" },
"hot-latte-macchiato": { name: "Latte Macchiato", desc: "" },
"hot-bonbon": { name: "Café Bonbon", desc: "" },

//BREAKFAST

// ——— Breakfast (Formules)
"breakfast-formule-espagnole": { name: "Espagnole", desc: "2 œufs, panier de pain; purée de tomate, manchego, huile d’ail; boisson chaude; mini jus d’orange; eau minérale" },
"breakfast-formule-marocaine": { name: "Marocaine", desc: "Harcha, rghayf, baghrir, pain de blé; accompagnement (beurre, fromage, miel, amlou); boisson chaude; mini jus d’orange; eau minérale" },

// ——— Breakfast (Bols)
"bowl-original-yogurt": { name: "Yaourt Original", desc: "Yaourt, granola, fruits de saison, miel" },
"bowl-amlou-yogurt": { name: "Yaourt Amlou", desc: "Yaourt, granola, amlou, fruits de saison, miel" },
"bowl-chia-pudding": { name: "Pudding de Chia", desc: "Chia, granola, fruits de saison" },

// ——— Breakfast (Tartines)
"toast-avo-poached": { name: "Tartine Avocat & Œuf Poché", desc: "Avocat, œuf poché, roquette" },
"toast-burrata": { name: "Tartine Burrata", desc: "Burrata, tomate cerise, glaçage balsamique, noix" },
"toast-figtastic": { name: "Tartine Figtastic", desc: "Brie, figue, miel, noix" },
"toast-salmon": { name: "Tartine Saumon", desc: "Saumon, fromage à tartiner, roquette, flocons de piment" },

// ——— Breakfast (Petits pains briochés)
"bun-egg": { name: "Pain brioché Œuf", desc: "Œufs brouillés, cheddar" },
"bun-avo-herb": { name: "Pain brioché Avocat & Herbes", desc: "Œufs brouillés, avocat, fromage à tartiner, cheddar" },
"bun-woods": { name: "Pain brioché Woods", desc: "Œufs brouillés, cheddar, oignons caramélisés" },

// ——— Breakfast (Sandwichs)
"sandwich-tunacado": { name: "Tunacado", desc: "Avocat, mousse de thon, pesto, tomate" },
"sandwich-spicytuna": { name: "Spicytuna", desc: "Mousse de thon, tomate, jalapeño, tabasco, pesto" },
"sandwich-mozacado": { name: "Mozacado", desc: "Mozzarella, avocat, tomate, pesto" },
"sandwich-toast-hollandais": { name: "Toast Hollandais", desc: "Tartine à la hollandaise" },
"sandwich-chicken-woods": { name: "Chicken Woods", desc: "Poulet grillé, tomate, roquette, sauce maison" },
"sandwich-chicken-parm": { name: "Chicken Parm", desc: "Poulet grillé, aïoli, tomate, parmesan" },

// ——— Breakfast (Œufs)
"egg-fried-1": { name: "1 Œuf au Plat", desc: "Œuf au plat" },
"egg-fried-2": { name: "2 Œufs au Plat", desc: "Œufs au plat" },
"egg-fried-3": { name: "3 Œufs au Plat", desc: "Œufs au plat" },
"omelette-plain": { name: "Omelette Nature", desc: "Simple et moelleuse" },
"omelette-cheese": { name: "Omelette au Fromage", desc: "Fromage fondant" },
"omelette-cheese-turkey": { name: "Omelette Fromage & Dinde", desc: "Fromage et dinde" },
"omelette-khlie": { name: "Omelette Spéciale Khlie", desc: "Viande séchée marocaine" },
"omelette-tuna": { name: "Omelette Spéciale Thon", desc: "Thon" },
"omelette-shrimp": { name: "Omelette aux Crevettes", desc: "Crevettes sautées" },

// ——— Breakfast (À la Carte)
"alacarte-chocolate-bread": { name: "Pain au Chocolat, Croissant", desc: "Viennoiseries : pain au chocolat, croissant" },
"alacarte-turnover": { name: "Chausson au Fromage ou aux Amandes", desc: "Feuilleté garni au fromage ou aux amandes" },
"alacarte-bread-plate": { name: "Assortiment de Pains avec 2 Accompagnements", desc: "Pain de blé, harcha, rghayf ou baghrir avec 2 accompagnements (beurre, fromage blanc, confiture, huile d’olive, amlou, miel)" },
"alacarte-cheese-toast": { name: "Toast au Fromage", desc: "Pain toasté avec fromage" },
"alacarte-turkey-cheese-toast": { name: "Toast Dinde & Fromage", desc: "Pain toasté garni de dinde et fromage" },
"alacarte-croque-cheese": { name: "Croque Fromage", desc: "Croque garni au fromage" },
"alacarte-baghrir-amlou": { name: "Baghrir avec Amlou", desc: "Mini crêpes marocaines servies avec amlou" },
"alacarte-croque-turkey-cheese": { name: "Croque Dinde & Fromage", desc: "Croque garni de dinde et fromage" },
"alacarte-khlie-eggs": { name: "Khlie avec 2 Œufs", desc: "Viande séchée marocaine (khlie) servie avec 2 œufs" },

// ——— Breakfast (Toast Hollandais)
"toast-amsterdam": { name: "Amsterdam", desc: "Toast hollandais" },
"toast-rotterdam": { name: "Rotterdam", desc: "Toast hollandais" },

// ——— Breakfast (Formules Enfants)
"kids-formula-1": { name: "Formule Enfant I", desc: "Baghrir avec amlou; mini crêpes au chocolat; cornflakes; chocolat froid ou lait chaud" },
"kids-formula-2": { name: "Formule Enfant II", desc: "Pancake au chocolat; cornflakes; chocolat froid ou lait chaud" },

// ——— Entrées Froides
"salade-marocaine": { name: "Salade marocaine", desc: "" },
"salade-nicoise": { name: "Salade niçoise", desc: "" },
"salade-cesar": { name: "Salade César", desc: "" },
"salade-exotique": { name: "Salade exotique", desc: "" },
"salade-avocat-crevettes": { name: "Salade d’avocat aux crevettes", desc: "" },
"salade-marine": { name: "Salade marine", desc: "" },
"salade-woods": { name: "Salade Woods", desc: "quinoa, mangue, kiwi, ananas, avocat, crevettes, saumon fumé" },

// ——— Entrées Chaudes
"soupe-fruits-de-mer": { name: "Soupe aux fruits de mer", desc: "" },
"creme-legumes": { name: "Crème de légumes", desc: "" },
"gratin-fruits-de-mer": { name: "Gratin aux fruits de mer", desc: "" },
"pilpil-crevettes": { name: "Pilpil de crevettes", desc: "" },
// ——— Plats (À Base Poisson)
"merlan": { name: "Filet de merlan", desc: "" },
"crevettes-grillees": { name: "Crevettes grillées", desc: "" },
"thon": { name: "Filet de thon", desc: "" },
"espadon": { name: "Filet d’espadon grillé", desc: "" },
"saumon-papillote": { name: "Darne de saumon en papillote", desc: "" },
"friture-1p": { name: "Friture 1 personne", desc: "entrée, plat, dessert" },
"friture-2p": { name: "Friture 2 personnes", desc: "entrée, plat, dessert" },

// ——— Plats (À Base Viande & Poulet)
"emince-poulet": { name: "Émincé de poulet", desc: "" },
"brochettes-poulet": { name: "Brochettes de poulet", desc: "" },
"filet-poulet": { name: "Filet de poulet grillé", desc: "" },
"mixed-grill": { name: "Mixed grill", desc: "" },
"emince-boeuf": { name: "Émincé de bœuf", desc: "" },
"stroganoff": { name: "Émincé stroganoff", desc: "" },
"entrecote": { name: "Entrecôte", desc: "" },
"filet-boeuf": { name: "Filet de bœuf", desc: "" },

// ——— Plats Marocains
"tajine-viande-hachee": { name: "Tajine de viande hachée", desc: "" },
"tajine-pruneaux": { name: "Tajine de viande aux pruneaux", desc: "" },
"tajine-coquelet-citron": { name: "Tajine de coquelet au citron confit", desc: "" },
"tangia": { name: "Tangia", desc: "" },
"pastilla-poulet": { name: "Pastilla de poulet", desc: "" },
"pastilla-poisson": { name: "Pastilla de poisson", desc: "" },
"couscous-veg": { name: "Couscous végétarien (vendredi)", desc: "" },
"couscous-poulet": { name: "Couscous au poulet (vendredi)", desc: "" },
"couscous-viande": { name: "Couscous à la viande (vendredi)", desc: "" },


// ——— Pastas
"pasta-annalisa": { name: "Pasta alla Annalisa", desc: "" },
"pasta-carbonara": { name: "Pasta alla Carbonara", desc: "Dinde fumée, sauce carbonara, parmesan" },
"linguine-scampi": { name: "Linguine alla Scampi", desc: "Crevettes sautées au beurre, ail, citron" },
"pasta-bolognaise": { name: "Pasta alla Bolognaise", desc: "Sauce bolognaise, basilic, parmesan" },
"farfalle-crema-gamberi": { name: "Farfalle alla Crema e Gamberi", desc: "" },
"pasta-pollo": { name: "Pasta alla Pollo", desc: "Poulet, crème fraîche, basilic, parmesan" },
"pasta-pollo-pesto": { name: "Pasta con Pollo al Pesto", desc: "Penne, poulet, pesto, basilic" },
"pasta-tonno": { name: "Pasta alla Tonno", desc: "Thon, tomate, oignon, olives, parmesan" },
"pasta-casa": { name: "Pasta alla Casa", desc: "" },
"pasta-frutti-di-mare": { name: "Pasta alla Frutti di Mare", desc: "Fruits de mer, sauce au choix, parmesan" },
"lasagnes-bolognaise": { name: "Lasagnes alla Bolognaise", desc: "" },
"pasta-arrabiata": { name: "Pasta alla Arrabiata", desc: "Sauce tomate pimentée, ail, basilic" },
"spaghetti-noir-mer": { name: "Spaghetti noir, fruits de mer", desc: "Sauce au choix, parmesan" },

// ——— Pizzas
"pz-margherita": { name: "Margherita", desc: "Tomates, mozzarella, olives noires" },
"pz-frutti": { name: "Frutti di Mare", desc: "Tomates, mozzarella, calmars, crevettes, surimi, moules, olive noire" },
"pz-primavera": { name: "Primavera", desc: "Tomates, mozzarella, aubergine, courgette, champignon, poivron, oignon, tomate cerise" },
"pz-4formaggi": { name: "Quattro Formaggi", desc: "Tomates, mozzarella, edam, roquefort, parmesan" },
"pz-prosciutto": { name: "Prosciutto (dinde fumée)", desc: "Tomates, mozzarella, dinde fumée" },
"pz-diavola": { name: "Diavola", desc: "Tomates, mozzarella, pepperoni, olive noire" },
"pz-tonno": { name: "Al Tonno", desc: "Tomates, mozzarella, thon, oignons, poivrons, olive noire" },
"pz-4stagioni": { name: "Quattro Stagioni", desc: "Tomates, mozzarella, viande hachée, fruits de mer, thon, poulet, olive noire" },
"pz-pollo-griglia": { name: "Al Pollo alla Griglia", desc: "Poulet grillé, sauce barbecue" },
"pz-royale-mixte": { name: "Royale Mixte", desc: "Tomates, mozzarella, mixte" },
"pz-bolognaise": { name: "Bolognaise", desc: "Tomates, mozzarella, viande hachée, olive noire" },
"pz-woods": { name: "WOODS", desc: "Tomates, espadon, crevettes grises, thon" },
"pz-puttanesca": { name: "Puttanesca", desc: "Anchois, câpres, ail, olives noires" },


// ——— Apéritifs
"onion-rings-4": { name: "Rondelles d’oignon (4p)", desc: "" },
"onion-rings-6": { name: "Rondelles d’oignon (6p)", desc: "" },
"onion-rings-9": { name: "Rondelles d’oignon (9p)", desc: "" },
"mozza-sticks-4": { name: "Bâtonnets de mozzarella (4p)", desc: "" },
"mozza-sticks-6": { name: "Bâtonnets de mozzarella (6p)", desc: "" },
"mozza-sticks-9": { name: "Bâtonnets de mozzarella (9p)", desc: "" },
"jalapenos-cheddar-4": { name: "Jalapeños au cheddar (4p)", desc: "" },
"jalapenos-cheddar-6": { name: "Jalapeños au cheddar (6p)", desc: "" },
"jalapenos-cheddar-9": { name: "Jalapeños au cheddar (9p)", desc: "" },

// ——— Tex Mex
"nuggets-4": { name: "Nuggets (4p)", desc: "" },
"nuggets-6": { name: "Nuggets (6p)", desc: "" },
"nuggets-9": { name: "Nuggets (9p)", desc: "" },
"drumsticks-4": { name: "Cuisses de poulet (4p)", desc: "" },
"drumsticks-6": { name: "Cuisses de poulet (6p)", desc: "" },
"jalapenos-bites-4": { name: "Jalapeños Bites (4p)", desc: "" },
"jalapenos-bites-6": { name: "Jalapeños Bites (6p)", desc: "" },
"jalapenos-bites-9": { name: "Jalapeños Bites (9p)", desc: "" },


// ——— Burgers
"burger-chicken": { name: "Chicken Burger", desc: "Steak de poulet, cheddar, salade, tomate" },
"burger-cheese": { name: "Cheeseburger", desc: "Viande hachée, salade, tomate" },
"burger-double-cheese": { name: "Double Cheeseburger", desc: "Double viande hachée, 2x cheddar, salade, tomate" },
"burger-american": { name: "American Burger", desc: "Viande hachée, œuf, cheddar, salade, tomate" },
"burger-cheese-jalapenos": { name: "Cheese Jalapeños", desc: "Viande hachée, salade, tomate, oignon, mayo chipotle" },
"burger-chicken-ananas": { name: "Chicken Ananas", desc: "Poulet grillé, salade, tomate, oignon, champignons, ananas" },

// ——— Crêpes Salées
"crepe-fromage": { name: "Crêpe au fromage", desc: "Fromage, sauce béchamel" },
"crepe-thon": { name: "Crêpe au thon", desc: "Thon, fromage, origan, sauce tomate" },
"crepe-dinde-fromage": { name: "Crêpe dinde & fromage", desc: "Dinde fumée, fromage, œuf, béchamel" },
"crepe-poulet-champignons": { name: "Crêpe poulet & champignon", desc: "Poulet, fromage, champignon, béchamel" },
"crepe-viande-hachee": { name: "Crêpe viande hachée", desc: "Viande hachée, fromage, origan, sauce tomate" },
"crepe-mixte": { name: "Crêpe mixte", desc: "Viande hachée, poulet, dinde fumée, fromage, béchamel" },

// ——— Tacos
"tacos-poulet": { name: "Tacos au poulet", desc: "" },
"tacos-cordon-bleu": { name: "Tacos au cordon bleu", desc: "" },
"tacos-viande": { name: "Tacos à la viande hachée", desc: "" },
"tacos-woods-mixte": { name: "Tacos WOODS mixte", desc: "" },

// ——— Sandwiches
"sandwich-fajitas-poulet": { name: "Sandwich fajitas au poulet", desc: "" },
"sandwich-american-bbq": { name: "Sandwich American BBQ", desc: "Deux steaks grillés, œuf, cheddar, salade, sauce BBQ" },
"sandwich-woods": { name: "Sandwich WOODS", desc: "Viande haché, poulet, cheddar, salade, sauce au choix" },

// ——— Panini
"panini-classic-italien": { name: "Panini Classic italien", desc: "Mozzarella, tomate, pesto, basilic" },
"panini-poulet-pesto": { name: "Panini Poulet Pesto", desc: "Poulet grillé, mozzarella, pesto, poivron rouge, oignon" },
"panini-tuna-melt": { name: "Panini Tuna Melt", desc: "Salade de thon, mozzarella" },

// ——— Crêpes & Gaufres Sucrées
"sweet-crepe-simple": { name: "Crêpe / Gaufre sucrée", desc: "" },
"sweet-crepe-miel": { name: "Crêpe / Gaufre au miel", desc: "" },
"sweet-crepe-caramel": { name: "Crêpe / Gaufre au caramel", desc: "" },
"sweet-crepe-amlou": { name: "Crêpe / Gaufre à l’amlou", desc: "" },
"sweet-crepe-choco": { name: "Crêpe / Gaufre au chocolat", desc: "" },
"sweet-crepe-choco-banane": { name: "Crêpe / Gaufre chocolat banane", desc: "" },
"sweet-crepe-choco-blanc": { name: "Crêpe / Gaufre chocolat blanc", desc: "" },
"sweet-crepe-nutella": { name: "Crêpe / Gaufre au Nutella", desc: "" },
"sweet-crepe-black-white": { name: "Crêpe / Gaufre Black & White", desc: "" },
"sweet-crepe-nutella-noix": { name: "Crêpe / Gaufre Nutella-noix", desc: "" },
"sweet-crepe-nutella-banane": { name: "Crêpe / Gaufre Nutella-banane", desc: "" },
"sweet-crepe-pistache": { name: "Crêpe / Gaufre pistache", desc: "" },
"sweet-crepe-mix": { name: "Crêpe / Gaufre Oreo / Kinder / Lotus / KitKat", desc: "" },
"sweet-crepe-woods": { name: "Crêpe / Gaufre WOODS", desc: "Nutella, noix, boule de glace" },

// ——— Pancakes
"pancake-simple": { name: "Pancake sucré", desc: "" },
"pancake-miel": { name: "Pancake au miel", desc: "" },
"pancake-caramel": { name: "Pancake au caramel", desc: "" },
"pancake-amlou": { name: "Pancake à l’amlou", desc: "" },
"pancake-choco": { name: "Pancake au chocolat", desc: "" },
"pancake-choco-banane": { name: "Pancake chocolat banane", desc: "" },
"pancake-choco-blanc": { name: "Pancake chocolat blanc", desc: "" },
"pancake-nutella": { name: "Pancake au Nutella", desc: "" },
"pancake-black-white": { name: "Pancake Black & White", desc: "" },
"pancake-nutella-noix": { name: "Pancake Nutella-noix", desc: "" },
"pancake-nutella-banane": { name: "Pancake Nutella-banane", desc: "" },
"pancake-pistache": { name: "Pancake pistache", desc: "" },
"pancake-mix": { name: "Pancake Oreo / Kinder / Lotus / KitKat", desc: "" },
"pancake-woods": { name: "Pancake WOODS", desc: "Nutella, noix, boule de glace" },

// ——— Desserts (Pâtisserie & Salades de fruits)
"dess-patisserie": { name: "Pâtisserie", desc: "" },
"dess-fruit-salad-1": { name: "Salade de fruits (1 personne)", desc: "" },
"dess-fruit-salad-2": { name: "Salade de fruits (2 personnes)", desc: "" },
"dess-fondant": { name: "Fondant au chocolat", desc: "avec boule de glace" },

// ——— Desserts (Frappuccino & Freakshake)
"frappuccino": { name: "Frappuccino", desc: "chocolat / caramel / vanille / noisette" },
"milkshake": { name: "Milkshake / Orange shake", desc: "" },
"freakshake": { name: "FreakShake", desc: "Oreo / Nutella / Chocolat / Caramel / Cookies" },

// ——— Desserts (Coupes glacées)
"coupe-fruit-rouge": { name: "Coupe Fruit Rouge", desc: "1 fraise, 2 cerise, chantilly" },
"coupe-rocher": { name: "Coupe Rocher", desc: "2x Ferrero Rocher, chantilly" },
"coupe-kitkat": { name: "Coupe Kit-Kat", desc: "2x Kit-Kat, chantilly" },
"coupe-banana-split": { name: "Coupe Banana Split", desc: "Vanille, chocolat, fraise, banane, chantilly" },
"coupe-fraise-melba": { name: "Coupe Fraise Melba", desc: "2x fraise, vanille, chantilly, fraise nature" },
"coupe-caraibes": { name: "Coupe Caraïbes", desc: "Solero, fraise, citron, chantilly" },
"coupe-caramelo": { name: "Coupe Caramelo", desc: "2x caramel, speculoos, chantilly" },
"coupe-bisutto": { name: "Coupe Bisutto", desc: "Speculoos, Oreo, cookies, chantilly" },
"coupe-negrisco": { name: "Coupe Negrisco", desc: "Chocolat, noisette, pistache, chantilly" },
"coupe-exotique": { name: "Coupe Exotique", desc: "Ananas, Solero, citron, fraise, fruits, chantilly" },
"coupe-woods": { name: "Coupe WOODS", desc: "6 boules variées, glace & sorbet, chantilly" },

// ——— Desserts (Composez votre glace)
"ice-chantilly": { name: "Crème chantilly", desc: "" },
"ice-1-boule": { name: "1 boule de glace", desc: "" },
"ice-2-boules": { name: "2 boules de glace", desc: "" },
"ice-3-boules": { name: "3 boules de glace", desc: "" },
"ice-4-boules": { name: "4 boules de glace", desc: "" },
"ice-500g": { name: "½ kg de glace", desc: "" },
"ice-1kg": { name: "1 kg de glace", desc: "" },
"ice-tarte": { name: "Nos tartes glacées", desc: "" },

  // … FR texts for the rest of your categories (entrées, plats, pastas, pizzas, etc.) are already in your data and will be used as fallback.
};

/** English culinary translations */
const ITEMS_EN: ItemsTextPack = {
// ——— Drinks (Matcha)
"matcha-latte": { name: "Matcha Latte / Iced", desc: "Ceremonial matcha with your choice of milk" },
"matcha-coco": { name: "Coconut Matcha", desc: "Matcha blended with creamy coconut milk" },
"matcha-pink-foam": { name: "Pink Foam Matcha", desc: "Matcha topped with a sweet pink foam" },
"matcha-fraise": { name: "Strawberry Matcha", desc: "Matcha infused with fresh strawberry" },
"matcha-mangue": { name: "Mango Matcha", desc: "Matcha mixed with ripe mango" },

// ——— Drinks (Coffee & Specialties)
"coffee-coco-latte": { name: "Coconut Latte", desc: "Espresso with smooth coconut milk" },
"coffee-creme-brulee-latte": { name: "Crème Brûlée Latte", desc: "Sweet latte with a caramelized crunch" },
"coffee-spanish-latte": { name: "Spanish Latte", desc: "A sweetened latte in Spanish style" },
"coffee-saffron-latte": { name: "Saffron Latte", desc: "Latte infused with aromatic saffron" },

// ——— Drinks (Refreshers)
"refresher-hibiscus": { name: "Iced Hibiscus", desc: "Chilled hibiscus infusion" },
"refresher-hibiscus-peche": { name: "Peach Hibiscus", desc: "Hibiscus tea with peach" },
"refresher-tropical-ginger": { name: "Tropical Ginger", desc: "Ginger with exotic fruits" },
"refresher-watermelon-fizz": { name: "Watermelon Fizz", desc: "Sparkling watermelon cooler" },

// ——— Drinks (Smoothies)
"smoothie-multivitamine": { name: "Multivitamin Smoothie", desc: "Mixed seasonal fruits" },
"smoothie-california-dream": { name: "California Dream", desc: "Tropical fruit blend" },
"smoothie-jack-special": { name: "Jack’s Special", desc: "Our house signature mix" },
"smoothie-coco-mango": { name: "Coco Mango", desc: "Coconut and mango smoothie" },
"smoothie-bananasa": { name: "Bananasa", desc: "Banana with your choice of milk" },

// ——— Drinks (Creamy Red Bull)
"creamy-redbull-blueberry": { name: "Creamy Blueberry Red Bull", desc: "Energy drink with cream and blueberry" },
"creamy-redbull-strawberry": { name: "Creamy Strawberry Red Bull", desc: "Energy drink with cream and strawberry" },
"creamy-redbull-peach": { name: "Creamy Peach Red Bull", desc: "Energy drink with cream and peach" },


// ——— Drinks (Mojitos – Non-Alcoholic)
"mojito-green": { name: "Classic Mojito", desc: "Lime, mint and sparkling soda" },
"mojito-strawberry": { name: "Strawberry Mojito", desc: "Strawberry, lime and mint" },
"mojito-passion": { name: "Passion Fruit Mojito", desc: "Passion fruit, mint and soda" },
"mojito-redbull": { name: "Red Bull Mojito", desc: "Red Bull with lime and mint" },
"mojito-strawberry-bull": { name: "Strawberry Bull Mojito", desc: "Red Bull with strawberry and mint" },
"mojito-black": { name: "Dark Mojito", desc: "Brown sugar with mint and soda" },

// ——— Drinks (Iced Teas)
"icedtea-raspberry": { name: "Raspberry Iced Tea", desc: "Cold-brewed raspberry infusion" },
"icedtea-lemon": { name: "Lemon Iced Tea", desc: "Cold-brewed lemon infusion" },

// ——— Drinks (Mocktails – Non-Alcoholic Cocktails)
"mocktail-florida": { name: "Florida", desc: "Citrus fruits with a sparkling twist" },
"mocktail-bora-bora": { name: "Bora Bora", desc: "Pineapple and coconut blend" },
"mocktail-pinacolada": { name: "Piña Colada", desc: "Classic mix of coconut and pineapple" },
"mocktail-ocean-11": { name: "Ocean 11", desc: "Blueberry and citrus fusion" },

// ——— Drinks (Juices)
"juice-orange": { name: "Orange Juice", desc: "Freshly squeezed or nectar" },
"juice-lemon": { name: "Lemon Juice", desc: "Fresh lemon juice" },
"juice-lemon-mint": { name: "Lemon Mint", desc: "Fresh lemon with mint" },
"juice-carrot": { name: "Carrot Juice", desc: "Fresh carrot juice" },
"juice-banana": { name: "Banana Juice", desc: "Banana blended with milk" },
"juice-strawberry": { name: "Strawberry Juice", desc: "Fresh strawberry blend" },
"juice-apple": { name: "Apple Juice", desc: "Sweet apple juice" },
"juice-peach": { name: "Peach Juice", desc: "Peach nectar" },
"juice-avocado": { name: "Avocado Juice", desc: "Smooth and creamy avocado" },
"juice-mango": { name: "Mango Juice", desc: "Ripe mango juice" },
"juice-pineapple": { name: "Pineapple Juice", desc: "Tropical pineapple juice" },
"juice-kiwi": { name: "Kiwi Juice", desc: "Tangy kiwi juice" },

// ——— Drinks (Cold-Pressed Juices)
"pressed-apple": { name: "Cold-Pressed Apple", desc: "Freshly pressed apple juice" },
"pressed-pineapple": { name: "Cold-Pressed Pineapple", desc: "Freshly pressed pineapple juice" },
"pressed-carrot": { name: "Cold-Pressed Carrot", desc: "Freshly pressed carrot juice" },
"pressed-pomegranate": { name: "Cold-Pressed Pomegranate", desc: "Freshly pressed pomegranate juice" },
"pressed-watermelon": { name: "Cold-Pressed Watermelon", desc: "Freshly pressed watermelon juice" },

// ——— Drinks (Cold Drinks)
"drink-water-33cl": { name: "Mineral Water 33cl", desc: "" },
"drink-water-50cl": { name: "Mineral Water 50cl", desc: "" },
"drink-soda": { name: "Soft Drinks", desc: "" },
"drink-iced-tea": { name: "Iced Tea (Lemon/Peach)", desc: "" },
"drink-beer-na": { name: "Non-Alcoholic Beer", desc: "" },

// ——— Drinks (Teas)
"tea-mint": { name: "Moroccan Mint Tea", desc: "" },
"tea-american": { name: "American Tea", desc: "" },
"tea-infusion": { name: "Herbal Infusion", desc: "" },
"tea-black": { name: "Black Tea", desc: "" },
"tea-special": { name: "House Special Tea", desc: "" },
"tea-black-special": { name: "Premium Black Tea", desc: "" },

// ——— Drinks (Hot Drinks)
"hot-espresso": { name: "Espresso", desc: "" },
"hot-americano": { name: "Americano", desc: "" },
"hot-milk": { name: "Hot Milk", desc: "" },
"hot-nespresso": { name: "Nespresso", desc: "" },
"hot-capp-italian": { name: "Italian Cappuccino", desc: "With frothed milk" },
"hot-nespresso-creme": { name: "Nespresso Crème", desc: "" },
"hot-nespresso-double": { name: "Double Nespresso", desc: "" },
"hot-flavored": { name: "Flavored Coffee", desc: "Caramel / Hazelnut / Vanilla" },
"hot-cafe-creme": { name: "Café Crème", desc: "" },
"hot-nescafe-lait": { name: "Nescafé with Milk", desc: "" },
"hot-chocolate": { name: "Hot Chocolate", desc: "" },
"hot-capp-vanille-noisette": { name: "Vanilla & Hazelnut Cappuccino", desc: "With whipped cream" },
"hot-royal": { name: "Royal Coffee", desc: "" },
"hot-double": { name: "Double Coffee", desc: "" },
"hot-choc-chantilly": { name: "Hot Chocolate with Whipped Cream", desc: "" },
"hot-latte-macchiato": { name: "Latte Macchiato", desc: "" },
"hot-bonbon": { name: "Café Bonbon", desc: "" },

// ——— Breakfast Formulas
"breakfast-formule-espagnole": { name: "Spanish Breakfast", desc: "2 eggs, bread basket, tomato purée, manchego cheese, garlic oil, hot drink, mini orange juice, mineral water" },
"breakfast-formule-marocaine": { name: "Moroccan Breakfast", desc: "Harcha, msemen, baghrir, wheat bread, spreads (butter, cheese, honey, amlou), hot drink, mini orange juice, mineral water" },

// ——— Bowls
"bowl-original-yogurt": { name: "Original Yogurt Bowl", desc: "Yogurt with granola, seasonal fruits and honey" },
"bowl-amlou-yogurt": { name: "Amlou Yogurt Bowl", desc: "Yogurt with granola, amlou, seasonal fruits and honey" },
"bowl-chia-pudding": { name: "Chia Pudding Bowl", desc: "Chia seeds with granola and seasonal fruits" },

// ——— Tartines
"toast-avo-poached": { name: "Avocado & Poached Egg Toast", desc: "Avocado, poached egg, arugula" },
"toast-burrata": { name: "Burrata Toast", desc: "Burrata, cherry tomato, balsamic glaze, walnuts" },
"toast-figtastic": { name: "Figtastic Toast", desc: "Brie, figs, honey, walnuts" },
"toast-salmon": { name: "Smoked Salmon Toast", desc: "Smoked salmon, cream cheese, arugula, chili flakes" },

// ——— Brioche Buns
"bun-egg": { name: "Egg Brioche Bun", desc: "Scrambled eggs, cheddar cheese" },
"bun-avo-herb": { name: "Avocado & Herb Brioche Bun", desc: "Scrambled eggs, avocado, cream cheese, cheddar" },
"bun-woods": { name: "Woods Brioche Bun", desc: "Scrambled eggs, cheddar, caramelized onions" },

// ——— Sandwiches
"sandwich-tunacado": { name: "Tunacado Sandwich", desc: "Avocado, tuna mousse, pesto, tomato" },
"sandwich-spicytuna": { name: "Spicy Tuna Sandwich", desc: "Tuna mousse, tomato, jalapeño, tabasco, pesto" },
"sandwich-mozacado": { name: "Mozacado Sandwich", desc: "Mozzarella, avocado, tomato, pesto" },
"sandwich-toast-hollandais": { name: "Dutch Toast", desc: "Hollandaise-style tartine" },
"sandwich-chicken-woods": { name: "Chicken Woods Sandwich", desc: "Grilled chicken, tomato, arugula, house sauce" },
"sandwich-chicken-parm": { name: "Chicken Parm Sandwich", desc: "Grilled chicken, aioli, tomato, parmesan" },

// ——— Eggs
"egg-fried-1": { name: "1 Fried Egg", desc: "" },
"egg-fried-2": { name: "2 Fried Eggs", desc: "" },
"egg-fried-3": { name: "3 Fried Eggs", desc: "" },
"omelette-plain": { name: "Plain Omelette", desc: "Simple and fluffy" },
"omelette-cheese": { name: "Cheese Omelette", desc: "With melted cheese" },
"omelette-cheese-turkey": { name: "Cheese & Turkey Omelette", desc: "With cheese and turkey" },
"omelette-khlie": { name: "Khlie Omelette", desc: "Traditional Moroccan dried beef" },
"omelette-tuna": { name: "Tuna Omelette", desc: "With tuna" },
"omelette-shrimp": { name: "Shrimp Omelette", desc: "With sautéed shrimp" },

// ——— À la Carte
"alacarte-chocolate-bread": { name: "Chocolate Croissant", desc: "Chocolate bread or croissant" },
"alacarte-turnover": { name: "Cheese or Almond Turnover", desc: "Flaky pastry filled with cheese or almonds" },
"alacarte-bread-plate": { name: "Bread Assortment", desc: "Wheat bread, harcha, msemen or baghrir with 2 spreads (butter, cream cheese, jam, olive oil, amlou, honey)" },
"alacarte-cheese-toast": { name: "Cheese Toast", desc: "Toasted bread with melted cheese" },
"alacarte-turkey-cheese-toast": { name: "Turkey & Cheese Toast", desc: "Toasted bread with turkey and cheese" },
"alacarte-croque-cheese": { name: "Croque Cheese", desc: "Classic cheese croque" },
"alacarte-baghrir-amlou": { name: "Baghrir with Amlou", desc: "Moroccan semolina pancakes with amlou" },
"alacarte-croque-turkey-cheese": { name: "Croque Turkey & Cheese", desc: "Croque filled with turkey and cheese" },
"alacarte-khlie-eggs": { name: "Khlie with 2 Eggs", desc: "Traditional dried beef served with 2 eggs" },

// ——— Dutch Toast Variations
"toast-amsterdam": { name: "Amsterdam Toast", desc: "Dutch-style toast" },
"toast-rotterdam": { name: "Rotterdam Toast", desc: "Dutch-style toast" },

// ——— Kids Formula
"kids-formula-1": { name: "Kids Formula I", desc: "Baghrir with amlou, mini chocolate pancakes, cornflakes, choice of cold chocolate milk or hot milk" },
"kids-formula-2": { name: "Kids Formula II", desc: "Chocolate pancake, cornflakes, choice of cold chocolate milk or hot milk" },
// ——— Starters (Cold)
"salade-marocaine": { name: "Moroccan Salad", desc: "" },
"salade-nicoise": { name: "Niçoise Salad", desc: "" },
"salade-cesar": { name: "Caesar Salad", desc: "" },
"salade-exotique": { name: "Exotic Salad", desc: "" },
"salade-avocat-crevettes": { name: "Avocado & Shrimp Salad", desc: "" },
"salade-marine": { name: "Seafood Salad", desc: "" },
"salade-woods": { name: "Woods Signature Salad", desc: "Quinoa, mango, kiwi, pineapple, avocado, shrimp, smoked salmon" },

// ——— Starters (Hot)
"soupe-fruits-de-mer": { name: "Seafood Soup", desc: "" },
"creme-legumes": { name: "Vegetable Cream Soup", desc: "" },
"gratin-fruits-de-mer": { name: "Seafood Gratin", desc: "" },
"pilpil-crevettes": { name: "Pil-Pil Shrimp", desc: "" },

// ——— Mains: Fish
"merlan": { name: "Fried Whiting Fillet", desc: "" },
"crevettes-grillees": { name: "Grilled Shrimp", desc: "" },
"thon": { name: "Tuna Fillet", desc: "" },
"espadon": { name: "Grilled Swordfish Fillet", desc: "" },
"saumon-papillote": { name: "Salmon en Papillote", desc: "" },
"friture-1p": { name: "Fried Fish Menu (1 person)", desc: "Starter, main course & dessert" },
"friture-2p": { name: "Fried Fish Menu (2 people)", desc: "Starter, main course & dessert" },

// ——— Mains: Meat & Poultry
"emince-poulet": { name: "Sautéed Chicken Strips", desc: "" },
"brochettes-poulet": { name: "Chicken Skewers", desc: "" },
"filet-poulet": { name: "Grilled Chicken Fillet", desc: "" },
"mixed-grill": { name: "Mixed Grill", desc: "" },
"emince-boeuf": { name: "Sautéed Beef Strips", desc: "" },
"stroganoff": { name: "Beef Stroganoff", desc: "" },
"entrecote": { name: "Entrecôte Steak", desc: "" },
"filet-boeuf": { name: "Beef Tenderloin", desc: "" },

// ——— Moroccan Dishes
"tajine-viande-hachee": { name: "Minced Meat Tagine", desc: "" },
"tajine-pruneaux": { name: "Beef Tagine with Prunes", desc: "" },
"tajine-coquelet-citron": { name: "Baby Chicken Tagine with Preserved Lemon", desc: "" },
"tangia": { name: "Tangia Marrakchia", desc: "" },
"pastilla-poulet": { name: "Chicken Pastilla", desc: "" },
"pastilla-poisson": { name: "Fish Pastilla", desc: "" },
"couscous-veg": { name: "Vegetarian Couscous (Friday)", desc: "" },
"couscous-poulet": { name: "Chicken Couscous (Friday)", desc: "" },
"couscous-viande": { name: "Beef Couscous (Friday)", desc: "" },

// ——— Pastas
"pasta-annalisa": { name: "Pasta alla Annalisa", desc: "" },
"pasta-carbonara": { name: "Spaghetti alla Carbonara", desc: "Smoked turkey, carbonara sauce, parmesan" },
"linguine-scampi": { name: "Linguine Scampi", desc: "Shrimp sautéed with butter, garlic & lemon" },
"pasta-bolognaise": { name: "Spaghetti Bolognese", desc: "Rich meat sauce with basil & parmesan" },
"farfalle-crema-gamberi": { name: "Farfalle with Cream & Shrimp", desc: "" },
"pasta-pollo": { name: "Pasta al Pollo", desc: "Chicken, fresh cream, basil, parmesan" },
"pasta-pollo-pesto": { name: "Chicken Pesto Penne", desc: "Penne with chicken, pesto, basil" },
"pasta-tonno": { name: "Tuna Pasta", desc: "Tuna, tomato, onion, olives, parmesan" },
"pasta-casa": { name: "House Pasta", desc: "" },
"pasta-frutti-di-mare": { name: "Seafood Pasta", desc: "Seafood with sauce of your choice, parmesan" },
"lasagnes-bolognaise": { name: "Lasagna Bolognese", desc: "" },
"pasta-arrabiata": { name: "Penne Arrabbiata", desc: "Spicy tomato sauce with garlic and basil" },
"spaghetti-noir-mer": { name: "Black Spaghetti with Seafood", desc: "With sauce of your choice, parmesan" },

// ——— Pizzas
"pz-margherita": { name: "Margherita", desc: "Tomato, mozzarella, black olives" },
"pz-frutti": { name: "Frutti di Mare", desc: "Tomato, mozzarella, calamari, shrimp, surimi, mussels, black olives" },
"pz-primavera": { name: "Primavera", desc: "Tomato, mozzarella, eggplant, zucchini, mushrooms, bell pepper, onion, cherry tomato" },
"pz-4formaggi": { name: "Quattro Formaggi", desc: "Tomato, mozzarella, edam, blue cheese, parmesan" },
"pz-prosciutto": { name: "Prosciutto", desc: "Tomato, mozzarella, smoked turkey" },
"pz-diavola": { name: "Diavola", desc: "Tomato, mozzarella, pepperoni, black olives" },
"pz-tonno": { name: "Al Tonno", desc: "Tomato, mozzarella, tuna, onions, bell pepper, black olives" },
"pz-4stagioni": { name: "Quattro Stagioni", desc: "Tomato, mozzarella, ground beef, seafood, tuna, chicken, black olives" },
"pz-pollo-griglia": { name: "Pollo alla Griglia", desc: "Tomato, mozzarella, grilled chicken, BBQ sauce" },
"pz-royale-mixte": { name: "Royal Mix", desc: "Tomato, mozzarella, assorted toppings" },
"pz-bolognaise": { name: "Bolognese", desc: "Tomato, mozzarella, minced beef, black olives" },
"pz-woods": { name: "Woods Special", desc: "Tomato, swordfish, grey shrimp, tuna" },
"pz-puttanesca": { name: "Puttanesca", desc: "Anchovies, capers, garlic, black olives" },

// ——— Starters (Apéritifs)
"onion-rings-4": { name: "Onion Rings (4 pcs)", desc: "" },
"onion-rings-6": { name: "Onion Rings (6 pcs)", desc: "" },
"onion-rings-9": { name: "Onion Rings (9 pcs)", desc: "" },
"mozza-sticks-4": { name: "Mozzarella Sticks (4 pcs)", desc: "" },
"mozza-sticks-6": { name: "Mozzarella Sticks (6 pcs)", desc: "" },
"mozza-sticks-9": { name: "Mozzarella Sticks (9 pcs)", desc: "" },
"jalapenos-cheddar-4": { name: "Cheddar Jalapeños (4 pcs)", desc: "" },
"jalapenos-cheddar-6": { name: "Cheddar Jalapeños (6 pcs)", desc: "" },
"jalapenos-cheddar-9": { name: "Cheddar Jalapeños (9 pcs)", desc: "" },

// ——— Tex-Mex
"nuggets-4": { name: "Chicken Nuggets (4 pcs)", desc: "" },
"nuggets-6": { name: "Chicken Nuggets (6 pcs)", desc: "" },
"nuggets-9": { name: "Chicken Nuggets (9 pcs)", desc: "" },
"drumsticks-4": { name: "Chicken Drumsticks (4 pcs)", desc: "" },
"drumsticks-6": { name: "Chicken Drumsticks (6 pcs)", desc: "" },
"jalapenos-bites-4": { name: "Jalapeño Bites (4 pcs)", desc: "" },
"jalapenos-bites-6": { name: "Jalapeño Bites (6 pcs)", desc: "" },
"jalapenos-bites-9": { name: "Jalapeño Bites (9 pcs)", desc: "" },

// ——— Burgers
"burger-chicken": { name: "Chicken Burger", desc: "Chicken patty, cheddar cheese, lettuce, tomato" },
"burger-cheese": { name: "Cheeseburger", desc: "Beef patty, lettuce, tomato" },
"burger-double-cheese": { name: "Double Cheeseburger", desc: "Double beef, double cheddar, lettuce, tomato" },
"burger-american": { name: "American Burger", desc: "Beef patty, fried egg, cheddar, lettuce, tomato" },
"burger-cheese-jalapenos": { name: "Cheese Jalapeños Burger", desc: "Beef patty, lettuce, tomato, onion, chipotle mayo" },
"burger-chicken-ananas": { name: "Pineapple Chicken Burger", desc: "Grilled chicken, lettuce, tomato, onion, mushrooms, pineapple" },

// ——— Savory Crêpes
"crepe-fromage": { name: "Cheese Crêpe", desc: "Cheese with béchamel sauce" },
"crepe-thon": { name: "Tuna Crêpe", desc: "Tuna, cheese, oregano, tomato sauce" },
"crepe-dinde-fromage": { name: "Turkey & Cheese Crêpe", desc: "Smoked turkey, cheese, egg, béchamel" },
"crepe-poulet-champignons": { name: "Chicken & Mushroom Crêpe", desc: "Chicken, cheese, mushrooms, béchamel" },
"crepe-viande-hachee": { name: "Minced Beef Crêpe", desc: "Ground beef, cheese, oregano, tomato sauce" },
"crepe-mixte": { name: "Mixed Crêpe", desc: "Ground beef, chicken, smoked turkey, cheese, béchamel" },

// ——— Tacos
"tacos-poulet": { name: "Chicken Taco", desc: "" },
"tacos-cordon-bleu": { name: "Cordon Bleu Taco", desc: "" },
"tacos-viande": { name: "Beef Taco", desc: "" },
"tacos-woods-mixte": { name: "Woods Mixed Taco", desc: "" },

// ——— Sandwiches & Panini
"sandwich-fajitas-poulet": { name: "Chicken Fajita Sandwich", desc: "" },
"sandwich-american-bbq": { name: "American BBQ Sandwich", desc: "Two grilled beef patties, egg, cheddar, lettuce, BBQ sauce" },
"sandwich-woods": { name: "Woods Sandwich", desc: "Beef patty, chicken, cheddar, lettuce, sauce of choice" },
"panini-classic-italien": { name: "Classic Italian Panini", desc: "Mozzarella, tomato, pesto, basil" },
"panini-poulet-pesto": { name: "Chicken Pesto Panini", desc: "Grilled chicken, mozzarella, pesto, red pepper, onion" },
"panini-tuna-melt": { name: "Tuna Melt Panini", desc: "Tuna salad with melted mozzarella" },

// ——— Sweet Crêpes / Waffles / Pancakes
"sweet-crepe-simple": { name: "Sweet Crêpe / Waffle", desc: "" },
"sweet-crepe-miel": { name: "Honey Crêpe / Waffle", desc: "" },
"sweet-crepe-caramel": { name: "Caramel Crêpe / Waffle", desc: "" },
"sweet-crepe-amlou": { name: "Amlou Crêpe / Waffle", desc: "" },
"sweet-crepe-choco": { name: "Chocolate Crêpe / Waffle", desc: "" },
"sweet-crepe-choco-banane": { name: "Chocolate Banana Crêpe / Waffle", desc: "" },
"sweet-crepe-choco-blanc": { name: "White Chocolate Crêpe / Waffle", desc: "" },
"sweet-crepe-nutella": { name: "Nutella Crêpe / Waffle", desc: "" },
"sweet-crepe-black-white": { name: "Black & White Crêpe / Waffle", desc: "" },
"sweet-crepe-nutella-noix": { name: "Nutella Walnut Crêpe / Waffle", desc: "" },
"sweet-crepe-nutella-banane": { name: "Nutella Banana Crêpe / Waffle", desc: "" },
"sweet-crepe-pistache": { name: "Pistachio Crêpe / Waffle", desc: "" },
"sweet-crepe-mix": { name: "Oreo / Kinder / Lotus / KitKat Crêpe", desc: "" },
"sweet-crepe-woods": { name: "Woods Crêpe", desc: "Nutella, walnuts, scoop of ice cream" },

"pancake-simple": { name: "Pancake", desc: "" },
"pancake-miel": { name: "Honey Pancake", desc: "" },
"pancake-caramel": { name: "Caramel Pancake", desc: "" },
"pancake-amlou": { name: "Amlou Pancake", desc: "" },
"pancake-choco": { name: "Chocolate Pancake", desc: "" },
"pancake-choco-banane": { name: "Chocolate Banana Pancake", desc: "" },
"pancake-choco-blanc": { name: "White Chocolate Pancake", desc: "" },
"pancake-nutella": { name: "Nutella Pancake", desc: "" },
"pancake-black-white": { name: "Black & White Pancake", desc: "" },
"pancake-nutella-noix": { name: "Nutella Walnut Pancake", desc: "" },
"pancake-nutella-banane": { name: "Nutella Banana Pancake", desc: "" },
"pancake-pistache": { name: "Pistachio Pancake", desc: "" },
"pancake-mix": { name: "Oreo / Kinder / Lotus / KitKat Pancake", desc: "" },
"pancake-woods": { name: "Woods Pancake", desc: "Nutella, walnuts, scoop of ice cream" },

// ——— Desserts
"dess-patisserie": { name: "Pastry", desc: "" },
"dess-fruit-salad-1": { name: "Fruit Salad (1 person)", desc: "" },
"dess-fruit-salad-2": { name: "Fruit Salad (2 people)", desc: "" },
"dess-fondant": { name: "Chocolate Fondant", desc: "With a scoop of ice cream" },

// ——— Frappuccino & Freakshake
"frappuccino": { name: "Frappuccino", desc: "Choice of chocolate / caramel / vanilla / hazelnut" },
"milkshake": { name: "Milkshake / Orange Shake", desc: "" },
"freakshake": { name: "Freakshake", desc: "Oreo, Nutella, chocolate, caramel or cookies" },

// ——— Ice Cream Sundaes
"coupe-fruit-rouge": { name: "Red Fruit Sundae", desc: "Strawberry, cherry, whipped cream" },
"coupe-rocher": { name: "Rocher Sundae", desc: "Ferrero Rocher with whipped cream" },
"coupe-kitkat": { name: "KitKat Sundae", desc: "KitKat with whipped cream" },
"coupe-banana-split": { name: "Banana Split", desc: "Vanilla, chocolate, strawberry, banana, whipped cream" },
"coupe-fraise-melba": { name: "Strawberry Melba", desc: "Strawberries, vanilla ice cream, whipped cream" },
"coupe-caraibes": { name: "Caribbean Sundae", desc: "Solero, strawberry, lemon, whipped cream" },
"coupe-caramelo": { name: "Caramelo Sundae", desc: "Caramel, speculoos, whipped cream" },
"coupe-bisutto": { name: "Bisutto Sundae", desc: "Speculoos, Oreo, cookies, whipped cream" },
"coupe-negrisco": { name: "Negrisco Sundae", desc: "Chocolate, hazelnut, pistachio, whipped cream" },
"coupe-exotique": { name: "Exotic Sundae", desc: "Pineapple, Solero, lemon, strawberry, fruit, whipped cream" },
"coupe-woods": { name: "Woods Sundae", desc: "6 scoops of assorted ice cream & sorbet with whipped cream" },

// ——— Build Your Own Ice Cream
"ice-chantilly": { name: "Whipped Cream", desc: "" },
"ice-1-boule": { name: "1 Scoop of Ice Cream", desc: "" },
"ice-2-boules": { name: "2 Scoops of Ice Cream", desc: "" },
"ice-3-boules": { name: "3 Scoops of Ice Cream", desc: "" },
"ice-4-boules": { name: "4 Scoops of Ice Cream", desc: "" },
"ice-500g": { name: "½ kg of Ice Cream", desc: "" },
"ice-1kg": { name: "1 kg of Ice Cream", desc: "" },
"ice-tarte": { name: "Ice Cream Tart", desc: "" },


};

/** Dutch culinary translations */
const ITEMS_NL: ItemsTextPack = {
  
// ——— Dranken (Matcha)
"matcha-latte": { name: "Matcha Latte / IJs", desc: "Matcha thee, melk naar keuze" },
"matcha-coco": { name: "Matcha Kokos", desc: "Matcha, kokosmelk" },
"matcha-pink-foam": { name: "Matcha Roze Mousse", desc: "Matcha, zoete roze mousse" },
"matcha-fraise": { name: "Matcha Aardbei", desc: "Matcha, aardbei" },
"matcha-mangue": { name: "Matcha Mango", desc: "Matcha, mango" },

// ——— Koffie & Specialiteiten
"coffee-coco-latte": { name: "Kokos Latte", desc: "Espresso met kokosmelk" },
"coffee-creme-brulee-latte": { name: "Crème Brûlée Latte", desc: "Zoete latte met krokante karamel" },
"coffee-spanish-latte": { name: "Spaanse Latte", desc: "Romige zoete latte op Spaanse wijze" },
"coffee-saffron-latte": { name: "Saffraan Latte", desc: "Latte met saffraaninfusie" },

// ——— Verfrissend
"refresher-hibiscus": { name: "Hibiscus", desc: "Koele hibiscusthee" },
"refresher-hibiscus-peche": { name: "Hibiscus Perzik", desc: "Hibiscus met perzik" },
"refresher-tropical-ginger": { name: "Tropische Gember", desc: "Gember met exotisch fruit" },
"refresher-watermelon-fizz": { name: "Watermeloen Fizz", desc: "Sprankelende watermeloen" },

// ——— Smoothies
"smoothie-multivitamine": { name: "Multivitamine", desc: "Mix van verschillende vruchten" },
"smoothie-california-dream": { name: "California Dream", desc: "Tropische fruitmix" },
"smoothie-jack-special": { name: "Jack’s Special", desc: "Huisrecept" },
"smoothie-coco-mango": { name: "Kokos Mango", desc: "Kokos en mango" },
"smoothie-bananasa": { name: "Bananasa", desc: "Banaan met melk naar keuze" },

// ——— Romige Red Bull
"creamy-redbull-blueberry": { name: "Romige Red Bull Bosbes", desc: "Energiedrank met room en bosbessen" },
"creamy-redbull-strawberry": { name: "Romige Red Bull Aardbei", desc: "Energiedrank met room en aardbei" },
"creamy-redbull-peach": { name: "Romige Red Bull Perzik", desc: "Energiedrank met room en perzik" },

// ——— Red Bull & Frisdrank
"drink-redbull": { name: "Red Bull", desc: "Energiedrank" },
"drink-water-33cl": { name: "Mineraalwater 33cl", desc: "" },
"drink-water-50cl": { name: "Mineraalwater 50cl", desc: "" },
"drink-soda": { name: "Frisdrank", desc: "" },
"drink-iced-tea": { name: "IJsthee citroen/perzik", desc: "" },
"drink-beer-na": { name: "Alcoholvrij Bier", desc: "" },

// ——— Mojito’s (zonder alcohol)
"mojito-green": { name: "Groene Mojito", desc: "Limoen, munt, bruis" },
"mojito-strawberry": { name: "Aardbei Mojito", desc: "Aardbei, limoen, munt" },
"mojito-passion": { name: "Passievrucht Mojito", desc: "Passievrucht en munt" },
"mojito-redbull": { name: "Red Bull Mojito", desc: "Red Bull, limoen, munt" },
"mojito-strawberry-bull": { name: "Aardbei Bull Mojito", desc: "Red Bull, aardbei, munt" },
"mojito-black": { name: "Zwarte Mojito", desc: "Donkere suiker, munt" },

// ——— IJsthee
"icedtea-raspberry": { name: "Frambozen IJsthee", desc: "Koude frambozeninfusie" },
"icedtea-lemon": { name: "Citroen IJsthee", desc: "Koude citroeninfusie" },

// ——— Mocktails
"mocktail-florida": { name: "Florida", desc: "Citrusvruchten met bruis" },
"mocktail-bora-bora": { name: "Bora Bora", desc: "Ananas en kokos" },
"mocktail-pinacolada": { name: "Piñacolada", desc: "Kokos en ananas" },
"mocktail-ocean-11": { name: "Ocean 11", desc: "Bosbessen en citrus" },

// ——— Sappen
"juice-orange": { name: "Vers Sinaasappelsap", desc: "Vers geperst of nectar" },
"juice-lemon": { name: "Citroensap", desc: "Verse citroen" },
"juice-lemon-mint": { name: "Citroen & Munt", desc: "" },
"juice-carrot": { name: "Wortelsap", desc: "" },
"juice-banana": { name: "Bananensap", desc: "Met melk naar keuze" },
"juice-strawberry": { name: "Aardbeiensap", desc: "" },
"juice-apple": { name: "Appelsap", desc: "" },
"juice-peach": { name: "Perziksap", desc: "" },
"juice-avocado": { name: "Avocadosap", desc: "" },
"juice-mango": { name: "Mangosap", desc: "" },
"juice-pineapple": { name: "Ananassap", desc: "" },
"juice-kiwi": { name: "Kiwisap", desc: "" },

// ——— Vers geperst
"pressed-apple": { name: "Vers geperst Appelsap", desc: "" },
"pressed-pineapple": { name: "Vers geperst Ananassap", desc: "" },
"pressed-carrot": { name: "Vers geperst Wortelsap", desc: "" },
"pressed-pomegranate": { name: "Vers geperst Granaatappelsap", desc: "" },
"pressed-watermelon": { name: "Vers geperst Watermeloensap", desc: "" },

// ——— Thee
"tea-mint": { name: "Muntthee", desc: "" },
"tea-american": { name: "American Tea", desc: "" },
"tea-infusion": { name: "Infusiethee", desc: "" },
"tea-black": { name: "Zwarte Thee", desc: "" },
"tea-special": { name: "Speciale Thee", desc: "" },
"tea-black-special": { name: "Speciale Zwarte Thee", desc: "" },

// ——— Warme Dranken
"hot-espresso": { name: "Espresso", desc: "" },
"hot-americano": { name: "Americano", desc: "" },
"hot-milk": { name: "Warme Melk", desc: "" },
"hot-nespresso": { name: "Nespresso", desc: "" },
"hot-capp-italian": { name: "Italiaanse Cappuccino", desc: "Met melkschuim" },
"hot-nespresso-creme": { name: "Nespresso Crème", desc: "" },
"hot-nespresso-double": { name: "Dubbele Nespresso", desc: "" },
"hot-flavored": { name: "Gearomatiseerde Koffie", desc: "Caramel / Hazelnoot / Vanille" },
"hot-cafe-creme": { name: "Koffie Crème", desc: "" },
"hot-nescafe-lait": { name: "Nescafé met Melk", desc: "" },
"hot-chocolate": { name: "Warme Chocolademelk", desc: "" },
"hot-capp-vanille-noisette": { name: "Vanille/Hazelnoot Cappuccino", desc: "Met slagroom" },
"hot-royal": { name: "Royal Coffee", desc: "" },
"hot-double": { name: "Dubbele Koffie", desc: "" },
"hot-choc-chantilly": { name: "Chocolademelk met Slagroom", desc: "" },
"hot-latte-macchiato": { name: "Latte Macchiato", desc: "" },
"hot-bonbon": { name: "Café Bonbon", desc: "" },

// ——— Ontbijt (Breakfast Formules)
"breakfast-formule-espagnole": { name: "Spaans Ontbijt", desc: "2 eieren, broodmand, tomatenpuree, manchego, knoflookolie, warme drank, mini-sinaasappelsap, mineraalwater" },
"breakfast-formule-marocaine": { name: "Marokkaans Ontbijt", desc: "Harcha, msemen, baghrir, tarwebrood, smeersels (boter, kaas, honing, amlou), warme drank, mini-sinaasappelsap, mineraalwater" },

// ——— Bowls
"bowl-original-yogurt": { name: "Yoghurt Bowl", desc: "Yoghurt, granola, seizoensfruit, honing" },
"bowl-amlou-yogurt": { name: "Amlou Yoghurt Bowl", desc: "Yoghurt, granola, amlou, seizoensfruit, honing" },
"bowl-chia-pudding": { name: "Chia Pudding", desc: "Chiazaad, granola, seizoensfruit" },

// ——— Toasts
"toast-avo-poached": { name: "Avocado Toast met Gepocheerd Ei", desc: "Avocado, gepocheerd ei, rucola" },
"toast-burrata": { name: "Burrata Toast", desc: "Burrata, kerstomaat, balsamico glazuur, walnoten" },
"toast-figtastic": { name: "Figtastic Toast", desc: "Brie, vijgen, honing, walnoten" },
"toast-salmon": { name: "Zalm Toast", desc: "Gerookte zalm, roomkaas, rucola, chilivlokken" },

// ——— Brioche Broodjes
"bun-egg": { name: "Brioche met Ei", desc: "Roerei en cheddar" },
"bun-avo-herb": { name: "Brioche met Avocado & Kruiden", desc: "Roerei, avocado, roomkaas, cheddar" },
"bun-woods": { name: "Woods Brioche", desc: "Roerei, cheddar, gekarameliseerde ui" },

// ——— Sandwiches
"sandwich-tunacado": { name: "Tunacado", desc: "Avocado, tonijnmousse, pesto, tomaat" },
"sandwich-spicytuna": { name: "Spicy Tuna", desc: "Tonijnmousse, tomaat, jalapeño, tabasco, pesto" },
"sandwich-mozacado": { name: "Mozacado", desc: "Mozzarella, avocado, tomaat, pesto" },
"sandwich-toast-hollandais": { name: "Hollandse Toast", desc: "Klassieke Hollandse stijl" },
"sandwich-chicken-woods": { name: "Woods Kip Sandwich", desc: "Gegrilde kip, tomaat, rucola, huisgemaakte saus" },
"sandwich-chicken-parm": { name: "Chicken Parm", desc: "Gegrilde kip, aioli, tomaat, Parmezaan" },

// ——— Eieren
"egg-fried-1": { name: "1 Spiegelei", desc: "" },
"egg-fried-2": { name: "2 Spiegeleieren", desc: "" },
"egg-fried-3": { name: "3 Spiegeleieren", desc: "" },
"omelette-plain": { name: "Natuur Omelet", desc: "" },
"omelette-cheese": { name: "Kaasomelet", desc: "" },
"omelette-cheese-turkey": { name: "Kaas & Kalkoen Omelet", desc: "" },
"omelette-khlie": { name: "Khlie Omelet", desc: "Marokkaans gedroogd vlees" },
"omelette-tuna": { name: "Tonijn Omelet", desc: "" },
"omelette-shrimp": { name: "Garnalen Omelet", desc: "" },

// ——— À la Carte
"alacarte-chocolate-bread": { name: "Chocoladebroodje / Croissant", desc: "" },
"alacarte-turnover": { name: "Bladerdeeg met Kaas of Amandel", desc: "" },
"alacarte-bread-plate": { name: "Broodassortiment met 2 Begeleiders", desc: "Keuze uit boter, kwark, confituur, olijfolie, amlou, honing" },
"alacarte-cheese-toast": { name: "Kaas Toast", desc: "" },
"alacarte-turkey-cheese-toast": { name: "Kalkoen & Kaas Toast", desc: "" },
"alacarte-croque-cheese": { name: "Croque Kaas", desc: "" },
"alacarte-baghrir-amlou": { name: "Baghrir met Amlou", desc: "" },
"alacarte-croque-turkey-cheese": { name: "Croque Kalkoen & Kaas", desc: "" },
"alacarte-khlie-eggs": { name: "Khlie met 2 Eieren", desc: "" },

// ——— Hollandse Toast Varianten
"toast-amsterdam": { name: "Amsterdam Toast", desc: "Hollandse stijl" },
"toast-rotterdam": { name: "Rotterdam Toast", desc: "Hollandse stijl" },

// ——— Kinderformules
"kids-formula-1": { name: "Kinderformule I", desc: "Baghrir met amlou, mini pannenkoeken met chocolade, cornflakes, koude chocolademelk of warme melk" },
"kids-formula-2": { name: "Kinderformule II", desc: "Chocoladepannenkoek, cornflakes, koude chocolademelk of warme melk" },


// ——— Voorgerechten (Koud)
"salade-marocaine": { name: "Marokkaanse Salade", desc: "" },
"salade-nicoise": { name: "Niçoise Salade", desc: "" },
"salade-cesar": { name: "Caesar Salade", desc: "" },
"salade-exotique": { name: "Exotische Salade", desc: "" },
"salade-avocat-crevettes": { name: "Avocado-Garnalen Salade", desc: "" },
"salade-marine": { name: "Mariene Salade", desc: "" },
"salade-woods": { name: "Woods Salade", desc: "Quinoa, mango, kiwi, ananas, avocado, garnalen, gerookte zalm" },

// ——— Voorgerechten (Warm)
"soupe-fruits-de-mer": { name: "Zeevruchtensoep", desc: "" },
"creme-legumes": { name: "Groentecrème", desc: "" },
"gratin-fruits-de-mer": { name: "Zeevruchten Gratin", desc: "" },
"pilpil-crevettes": { name: "Pil Pil Garnalen", desc: "" },

// ——— Hoofdgerechten: Vis
"merlan": { name: "Gebakken Wijtingfilet", desc: "" },
"crevettes-grillees": { name: "Gegrilde Garnalen", desc: "" },
"thon": { name: "Tonijnfilet", desc: "" },
"espadon": { name: "Gegrilde Zwaardvisfilet", desc: "" },
"saumon-papillote": { name: "Zalm in Papillot", desc: "" },
"friture-1p": { name: "Frituurmenu (1 persoon)", desc: "Voorgerecht, hoofdgerecht en dessert" },
"friture-2p": { name: "Frituurmenu (2 personen)", desc: "Voorgerecht, hoofdgerecht en dessert" },

// ——— Hoofdgerechten: Vlees & Kip
"emince-poulet": { name: "Gesneden Kip", desc: "" },
"brochettes-poulet": { name: "Kipspiesjes", desc: "" },
"filet-poulet": { name: "Gegrilde Kipfilet", desc: "" },
"mixed-grill": { name: "Mixed Grill", desc: "" },
"emince-boeuf": { name: "Gesneden Rundvlees", desc: "" },
"stroganoff": { name: "Stroganoff", desc: "" },
"entrecote": { name: "Entrecote", desc: "" },
"filet-boeuf": { name: "Rundvleesfilet", desc: "" },

// ——— Hoofdgerechten: Marokkaans
"tajine-viande-hachee": { name: "Tajine met Gehakt", desc: "" },
"tajine-pruneaux": { name: "Tajine met Vlees & Pruimen", desc: "" },
"tajine-coquelet-citron": { name: "Tajine met Kippetje & Ingelegde Citroen", desc: "" },
"tangia": { name: "Tangia", desc: "" },
"pastilla-poulet": { name: "Pastilla met Kip", desc: "" },
"pastilla-poisson": { name: "Pastilla met Vis", desc: "" },
"couscous-veg": { name: "Vegetarische Couscous (vrijdag)", desc: "" },
"couscous-poulet": { name: "Couscous met Kip (vrijdag)", desc: "" },
"couscous-viande": { name: "Couscous met Vlees (vrijdag)", desc: "" },




// ——— Pasta
"pasta-annalisa": { name: "Pasta alla Annalisa", desc: "" },
"pasta-carbonara": { name: "Pasta alla Carbonara", desc: "Gerookte kalkoen, carbonarasaus, Parmezaan" },
"linguine-scampi": { name: "Linguine met Scampi", desc: "Garnalen in boter, knoflook en citroen" },
"pasta-bolognaise": { name: "Pasta Bolognese", desc: "Bolognesesaus, basilicum, Parmezaan" },
"farfalle-crema-gamberi": { name: "Farfalle met Garnalenroom", desc: "" },
"pasta-pollo": { name: "Pasta Pollo", desc: "Kip, room, basilicum, Parmezaan" },
"pasta-pollo-pesto": { name: "Pasta Pollo Pesto", desc: "Penne met kip, pestosaus en basilicum" },
"pasta-tonno": { name: "Pasta Tonno", desc: "Tonijn, tomaat, ui, olijven, Parmezaan" },
"pasta-casa": { name: "Pasta Casa", desc: "" },
"pasta-frutti-di-mare": { name: "Pasta Frutti di Mare", desc: "Zeevruchten met saus naar keuze, Parmezaan" },
"lasagnes-bolognaise": { name: "Lasagne Bolognese", desc: "" },
"pasta-arrabiata": { name: "Pasta Arrabbiata", desc: "Pittige tomatensaus met knoflook en basilicum" },
"spaghetti-noir-mer": { name: "Zwarte Spaghetti met Zeevruchten", desc: "Met saus naar keuze, Parmezaan" },

// ——— Pizza
"pz-margherita": { name: "Margherita", desc: "Tomaat, mozzarella, zwarte olijven" },
"pz-frutti": { name: "Frutti di Mare", desc: "Tomaat, mozzarella, inktvis, garnalen, surimi, mosselen, zwarte olijven" },
"pz-primavera": { name: "Primavera", desc: "Tomaat, mozzarella, aubergine, courgette, champignons, paprika, ui, kerstomaat" },
"pz-4formaggi": { name: "Quattro Formaggi", desc: "Tomaat, mozzarella, edam, blauwe kaas, Parmezaan" },
"pz-prosciutto": { name: "Prosciutto", desc: "Tomaat, mozzarella, gerookte kalkoen" },
"pz-diavola": { name: "Diavola", desc: "Tomaat, mozzarella, pepperoni, zwarte olijven" },
"pz-tonno": { name: "Tonno", desc: "Tomaat, mozzarella, tonijn, ui, paprika, zwarte olijven" },
"pz-4stagioni": { name: "Quattro Stagioni", desc: "Tomaat, mozzarella, gehakt, zeevruchten, tonijn, kip, zwarte olijven" },
"pz-pollo-griglia": { name: "Pollo alla Griglia", desc: "Tomaat, mozzarella, gegrilde kip, BBQ-saus" },
"pz-royale-mixte": { name: "Royal Mix", desc: "Tomaat, mozzarella, gemengde toppings" },
"pz-bolognaise": { name: "Bolognese", desc: "Tomaat, mozzarella, gehakt, zwarte olijven" },
"pz-woods": { name: "Woods Special", desc: "Tomaat, zwaardvis, garnalen, tonijn" },
"pz-puttanesca": { name: "Puttanesca", desc: "Ansjovis, kappertjes, knoflook, zwarte olijven" },

// ——— Tex-Mex
"nuggets-4": { name: "Kipnuggets (4 stuks)", desc: "" },
"nuggets-6": { name: "Kipnuggets (6 stuks)", desc: "" },
"nuggets-9": { name: "Kipnuggets (9 stuks)", desc: "" },
"drumsticks-4": { name: "Kippenboutjes (4 stuks)", desc: "" },
"drumsticks-6": { name: "Kippenboutjes (6 stuks)", desc: "" },
"jalapenos-bites-4": { name: "Jalapeño Bites (4 stuks)", desc: "" },
"jalapenos-bites-6": { name: "Jalapeño Bites (6 stuks)", desc: "" },
"jalapenos-bites-9": { name: "Jalapeño Bites (9 stuks)", desc: "" },

// ——— Burgers
"burger-chicken": { name: "Kipburger", desc: "Kipfilet, cheddar, sla, tomaat" },
"burger-cheese": { name: "Cheeseburger", desc: "Rundvleesburger, sla, tomaat" },
"burger-double-cheese": { name: "Double Cheeseburger", desc: "Dubbele burger, 2x cheddar, sla, tomaat" },
"burger-american": { name: "American Burger", desc: "Rundvlees, ei, cheddar, sla, tomaat" },
"burger-cheese-jalapenos": { name: "Cheddar Jalapeño Burger", desc: "Rundvlees, sla, tomaat, ui, chipotle mayo" },
"burger-chicken-ananas": { name: "Kip Ananas Burger", desc: "Gegrilde kip, sla, tomaat, ui, champignons, ananas" },

// ——— Crêpes (Hartig)
"crepe-fromage": { name: "Crêpe met Kaas", desc: "Kaas en bechamelsaus" },
"crepe-thon": { name: "Crêpe met Tonijn", desc: "Tonijn, kaas, oregano, tomatensaus" },
"crepe-dinde-fromage": { name: "Crêpe met Kalkoen & Kaas", desc: "Gerookte kalkoen, kaas, ei, bechamel" },
"crepe-poulet-champignons": { name: "Crêpe met Kip & Champignons", desc: "Kip, kaas, champignons, bechamel" },
"crepe-viande-hachee": { name: "Crêpe met Gehakt", desc: "Gehakt, kaas, oregano, tomatensaus" },
"crepe-mixte": { name: "Mix Crêpe", desc: "Gehakt, kip, kalkoen, kaas, bechamel" },

// ——— Crêpes & Wafels & Pannenkoeken (Zoet)
"sweet-crepe-simple": { name: "Crêpe / Wafel Naturel", desc: "" },
"sweet-crepe-miel": { name: "Crêpe / Wafel met Honing", desc: "" },
"sweet-crepe-caramel": { name: "Crêpe / Wafel met Karamel", desc: "" },
"sweet-crepe-amlou": { name: "Crêpe / Wafel met Amlou", desc: "" },
"sweet-crepe-choco": { name: "Crêpe / Wafel met Chocolade", desc: "" },
"sweet-crepe-choco-banane": { name: "Crêpe / Wafel Chocolade-Banaan", desc: "" },
"sweet-crepe-choco-blanc": { name: "Crêpe / Wafel met Witte Chocolade", desc: "" },
"sweet-crepe-nutella": { name: "Crêpe / Wafel met Nutella", desc: "" },
"sweet-crepe-black-white": { name: "Crêpe / Wafel Black & White", desc: "" },
"sweet-crepe-nutella-noix": { name: "Crêpe / Wafel Nutella-Noot", desc: "" },
"sweet-crepe-nutella-banane": { name: "Crêpe / Wafel Nutella-Banaan", desc: "" },
"sweet-crepe-pistache": { name: "Crêpe / Wafel met Pistache", desc: "" },
"sweet-crepe-mix": { name: "Crêpe / Wafel Mix", desc: "Oreo, Kinder, Lotus, KitKat" },
"sweet-crepe-woods": { name: "Woods Crêpe / Wafel", desc: "Nutella, noten, bol ijs" },

"pancake-simple": { name: "Pannenkoek Naturel", desc: "" },
"pancake-miel": { name: "Pannenkoek met Honing", desc: "" },
"pancake-caramel": { name: "Pannenkoek met Karamel", desc: "" },
"pancake-amlou": { name: "Pannenkoek met Amlou", desc: "" },
"pancake-choco": { name: "Pannenkoek met Chocolade", desc: "" },
"pancake-choco-banane": { name: "Pannenkoek Chocolade-Banaan", desc: "" },
"pancake-choco-blanc": { name: "Pannenkoek met Witte Chocolade", desc: "" },
"pancake-nutella": { name: "Pannenkoek met Nutella", desc: "" },
"pancake-black-white": { name: "Pannenkoek Black & White", desc: "" },
"pancake-nutella-noix": { name: "Pannenkoek Nutella-Noot", desc: "" },
"pancake-nutella-banane": { name: "Pannenkoek Nutella-Banaan", desc: "" },
"pancake-pistache": { name: "Pannenkoek met Pistache", desc: "" },
"pancake-mix": { name: "Pannenkoek Mix", desc: "Oreo, Kinder, Lotus, KitKat" },
"pancake-woods": { name: "Woods Pannenkoek", desc: "Nutella, noten, bol ijs" },

// ——— Tacos
"tacos-poulet": { name: "Kip Tacos", desc: "" },
"tacos-cordon-bleu": { name: "Cordon Bleu Tacos", desc: "" },
"tacos-viande": { name: "Gehakt Tacos", desc: "" },
"tacos-woods-mixte": { name: "Woods Mix Tacos", desc: "" },

// ——— Sandwiches & Panini
"sandwich-fajitas-poulet": { name: "Kip Fajita Sandwich", desc: "" },
"sandwich-american-bbq": { name: "American BBQ Sandwich", desc: "Dubbele burger, ei, cheddar, BBQ-saus" },
"sandwich-woods": { name: "Woods Sandwich", desc: "Rundvlees, kip, cheddar, sla, saus naar keuze" },

"panini-classic-italien": { name: "Italiaanse Panini", desc: "Mozzarella, tomaat, pesto, basilicum" },
"panini-poulet-pesto": { name: "Kip Pesto Panini", desc: "Gegrilde kip, mozzarella, pesto, paprika, ui" },
"panini-tuna-melt": { name: "Tuna Melt Panini", desc: "Tonijnsalade met mozzarella" },

// ——— Desserts (IJs & Coups)
"dess-patisserie": { name: "Patisserie", desc: "" },
"dess-fruit-salad-1": { name: "Fruitsalade (1 persoon)", desc: "" },
"dess-fruit-salad-2": { name: "Fruitsalade (2 personen)", desc: "" },
"dess-fondant": { name: "Chocoladefondant", desc: "Met een bol ijs" },

"frappuccino": { name: "Frappuccino", desc: "Keuze uit chocolade / karamel / vanille / hazelnoot" },
"milkshake": { name: "Milkshake / Sinaasappeldrank", desc: "" },
"freakshake": { name: "Freakshake", desc: "Oreo, Nutella, chocolade, karamel of koekjes" },

"coupe-fruit-rouge": { name: "Rood Fruit Coupe", desc: "Aardbei, kers, slagroom" },
"coupe-rocher": { name: "Rocher Coupe", desc: "Ferrero Rocher met slagroom" },
"coupe-kitkat": { name: "KitKat Coupe", desc: "KitKat met slagroom" },
"coupe-banana-split": { name: "Banana Split", desc: "Vanille, chocolade, aardbei, banaan, slagroom" },
"coupe-fraise-melba": { name: "Aardbei Melba", desc: "Aardbeien, vanille-ijs, slagroom" },
"coupe-caraibes": { name: "Caraïben Coupe", desc: "Solero, aardbei, citroen, slagroom" },
"coupe-caramelo": { name: "Caramelo Coupe", desc: "Karamel, speculoos, slagroom" },
"coupe-bisutto": { name: "Bisutto Coupe", desc: "Speculoos, Oreo, koekjes, slagroom" },
"coupe-negrisco": { name: "Negrisco Coupe", desc: "Chocolade, hazelnoot, pistache, slagroom" },
"coupe-exotique": { name: "Exotische Coupe", desc: "Ananas, Solero, citroen, aardbei, fruit, slagroom" },
"coupe-woods": { name: "Woods Coupe", desc: "6 bollen ijs & sorbet met slagroom" },

"ice-chantilly": { name: "Slagroom", desc: "" },
"ice-1-boule": { name: "1 bol ijs", desc: "" },
"ice-2-boules": { name: "2 bollen ijs", desc: "" },
"ice-3-boules": { name: "3 bollen ijs", desc: "" },
"ice-4-boules": { name: "4 bollen ijs", desc: "" },
"ice-500g": { name: "½ kg ijs", desc: "" },
"ice-1kg": { name: "1 kg ijs", desc: "" },
"ice-tarte": { name: "Ijstaart", desc: "" },



};

/* ============================================================================
   5) Language registry (category/sub labels + item maps)
   ========================================================================== */
const LANGS: Record<LangKey, {
  ui: typeof UI["fr"];
  categories: Record<CategoryId, string>;
  subcats: Record<string, string>;
  items: ItemsTextPack;
}> = {
  fr: { ui: UI.fr, categories: CAT_LABELS.fr, subcats: SUB_LABELS.fr, items: ITEMS_FR },
  en: { ui: UI.en, categories: CAT_LABELS.en, subcats: SUB_LABELS.en, items: ITEMS_EN },
  nl: { ui: UI.nl, categories: CAT_LABELS.nl, subcats: SUB_LABELS.nl, items: ITEMS_NL },
};

/* ============================================================================
   6) Language-neutral MENU ITEMS (ids + price + grouping only)
   - This block mirrors your data, trimmed to keep the example concise.
   - Add/keep the rest of your items here — display text comes from LANGS.
   ========================================================================== */
export const MENU_ITEMS: MenuItem[] = [
  // ——— Drinks
  
    // MATCHA
    { id: "matcha-latte", price: 45, category: "drinks", subcategory: "Matcha" },
    { id: "matcha-coco", price: 65, category: "drinks", subcategory: "Matcha" },
    { id: "matcha-pink-foam", price: 60, category: "drinks", subcategory: "Matcha" },
    { id: "matcha-fraise", price: 55, category: "drinks", subcategory: "Matcha" },
    { id: "matcha-mangue", price: 55, category: "drinks", subcategory: "Matcha" },
  
    // CAFÉ & SPÉCIALITÉS
    { id: "coffee-coco-latte", price: 60, category: "drinks", subcategory: "Café & Spécialités" },
    { id: "coffee-creme-brulee-latte", price: 65, category: "drinks", subcategory: "Café & Spécialités" },
    { id: "coffee-spanish-latte", price: 50, category: "drinks", subcategory: "Café & Spécialités" },
    { id: "coffee-saffron-latte", price: 65, category: "drinks", subcategory: "Café & Spécialités" },
  
    // RAFRAÎCHISSANTS
    { id: "refresher-hibiscus", price: 49, category: "drinks", subcategory: "Rafraîchissants" },
    { id: "refresher-hibiscus-peche", price: 49, category: "drinks", subcategory: "Rafraîchissants" },
    { id: "refresher-tropical-ginger", price: 45, category: "drinks", subcategory: "Rafraîchissants" },
    { id: "refresher-watermelon-fizz", price: 45, category: "drinks", subcategory: "Rafraîchissants" },
  
    // SMOOTHIES
    { id: "smoothie-multivitamine", price: 55, category: "drinks", subcategory: "Smoothies" },
    { id: "smoothie-california-dream", price: 55, category: "drinks", subcategory: "Smoothies" },
    { id: "smoothie-jack-special", price: 55, category: "drinks", subcategory: "Smoothies" },
    { id: "smoothie-coco-mango", price: 55, category: "drinks", subcategory: "Smoothies" },
    { id: "smoothie-bananasa", price: 55, category: "drinks", subcategory: "Smoothies" },
  
    // REDBULL CRÉMEUX
    { id: "creamy-redbull-blueberry", price: 50, category: "drinks", subcategory: "Redbull Crémeux" },
    { id: "creamy-redbull-strawberry", price: 50, category: "drinks", subcategory: "Redbull Crémeux" },
    { id: "creamy-redbull-peach", price: 50, category: "drinks", subcategory: "Redbull Crémeux" },
  
 
  
    // MOJITOS
    { id: "mojito-green", price: 45, category: "drinks", subcategory: "Mojitos" },
    { id: "mojito-strawberry", price: 45, category: "drinks", subcategory: "Mojitos" },
    { id: "mojito-passion", price: 50, category: "drinks", subcategory: "Mojitos" },
    { id: "mojito-redbull", price: 55, category: "drinks", subcategory: "Mojitos" },
    { id: "mojito-strawberry-bull", price: 60, category: "drinks", subcategory: "Mojitos" },
    { id: "mojito-black", price: 50, category: "drinks", subcategory: "Mojitos" },
  
    // THÉS GLACÉS
    { id: "icedtea-raspberry", price: 38, category: "drinks", subcategory: "Thés glacés" },
    { id: "icedtea-lemon", price: 38, category: "drinks", subcategory: "Thés glacés" },
  
    // COCKTAILS SANS ALCOOL
    { id: "mocktail-florida", price: 40, category: "drinks", subcategory: "Cocktails sans alcool" },
    { id: "mocktail-bora-bora", price: 40, category: "drinks", subcategory: "Cocktails sans alcool" },
    { id: "mocktail-pinacolada", price: 50, category: "drinks", subcategory: "Cocktails sans alcool" },
    { id: "mocktail-ocean-11", price: 45, category: "drinks", subcategory: "Cocktails sans alcool" },
  
    // JUS
    { id: "juice-orange", price: 30, category: "drinks", subcategory: "Jus" },
    { id: "juice-lemon", price: 30, category: "drinks", subcategory: "Jus" },
    { id: "juice-lemon-mint", price: 32, category: "drinks", subcategory: "Jus" },
    { id: "juice-carrot", price: 33, category: "drinks", subcategory: "Jus" },
    { id: "juice-banana", price: 40, category: "drinks", subcategory: "Jus" },
    { id: "juice-strawberry", price: 40, category: "drinks", subcategory: "Jus" },
    { id: "juice-apple", price: 40, category: "drinks", subcategory: "Jus" },
    { id: "juice-peach", price: 42, category: "drinks", subcategory: "Jus" },
    { id: "juice-avocado", price: 45, category: "drinks", subcategory: "Jus" },
    { id: "juice-mango", price: 45, category: "drinks", subcategory: "Jus" },
    { id: "juice-pineapple", price: 45, category: "drinks", subcategory: "Jus" },
    { id: "juice-kiwi", price: 45, category: "drinks", subcategory: "Jus" },
  
    // JUS PRESSÉS
    { id: "pressed-apple", price: 50, category: "drinks", subcategory: "Jus pressés" },
    { id: "pressed-pineapple", price: 65, category: "drinks", subcategory: "Jus pressés" },
    { id: "pressed-carrot", price: 45, category: "drinks", subcategory: "Jus pressés" },
    { id: "pressed-pomegranate", price: 55, category: "drinks", subcategory: "Jus pressés" },
    { id: "pressed-watermelon", price: 45, category: "drinks", subcategory: "Jus pressés" },
  
    // ——— BOISSONS FRAÎCHES / COLD DRINKS
    { id: "drink-water-33cl", price: 8, category: "drinks", subcategory: "Boissons Fraîches" },
    { id: "drink-water-50cl", price: 12, category: "drinks", subcategory: "Boissons Fraîches" },
    { id: "drink-soda", price: 22, category: "drinks", subcategory: "Boissons Fraîches" },
    { id: "drink-iced-tea", price: 28, category: "drinks", subcategory: "Boissons Fraîches" },
    { id: "drink-beer-na", price: 35, category: "drinks", subcategory: "Boissons Fraîches" },
    { id: "drink-redbull", price: 35, category: "drinks", subcategory: "Boissons Fraîches" },
  
    
      // ——— NOS THÉS
      { id: "tea-mint", price: 22, category: "drinks", subcategory: "Nos Thé" },
      { id: "tea-american", price: 22, category: "drinks", subcategory: "Nos Thé" },
      { id: "tea-infusion", price: 22, category: "drinks", subcategory: "Nos Thé" },
      { id: "tea-black", price: 22, category: "drinks", subcategory: "Nos Thé" },
      { id: "tea-special", price: 24, category: "drinks", subcategory: "Nos Thé" },
      { id: "tea-black-special", price: 24, category: "drinks", subcategory: "Nos Thé" },
    
      // ——— BOISSONS CHAUDES / HOT DRINKS
      { id: "hot-espresso", price: 19, category: "drinks", subcategory: "Boissons Chaudes" },
      { id: "hot-americano", price: 21, category: "drinks", subcategory: "Boissons Chaudes" },
      { id: "hot-milk", price: 18, category: "drinks", subcategory: "Boissons Chaudes" },
      { id: "hot-nespresso", price: 21, category: "drinks", subcategory: "Boissons Chaudes" },
      { id: "hot-capp-italian", price: 24, category: "drinks", subcategory: "Boissons Chaudes" },
      { id: "hot-nespresso-creme", price: 24, category: "drinks", subcategory: "Boissons Chaudes" },
      { id: "hot-nespresso-double", price: 28, category: "drinks", subcategory: "Boissons Chaudes" },
      { id: "hot-flavored", price: 23, category: "drinks", subcategory: "Boissons Chaudes" },
      { id: "hot-cafe-creme", price: 22, category: "drinks", subcategory: "Boissons Chaudes" },
      { id: "hot-nescafe-lait", price: 22, category: "drinks", subcategory: "Boissons Chaudes" },
      { id: "hot-chocolate", price: 23, category: "drinks", subcategory: "Boissons Chaudes" },
      { id: "hot-capp-vanille-noisette", price: 28, category: "drinks", subcategory: "Boissons Chaudes" },
      { id: "hot-royal", price: 28, category: "drinks", subcategory: "Boissons Chaudes" },
      { id: "hot-double", price: 26, category: "drinks", subcategory: "Boissons Chaudes" },
      { id: "hot-choc-chantilly", price: 28, category: "drinks", subcategory: "Boissons Chaudes" },
      { id: "hot-latte-macchiato", price: 28, category: "drinks", subcategory: "Boissons Chaudes" },
      { id: "hot-bonbon", price: 28, category: "drinks", subcategory: "Boissons Chaudes" },
    
    
  

      
        // ————— PETIT-DÉJEUNER —————
        // SPANISH
        { id: "breakfast-formule-espagnole", price: 80, category: "breakfast", subcategory: "Espagnol" },
      
        // MOROCCAN
        { id: "breakfast-formule-marocaine", price: 70, category: "breakfast", subcategory: "Marocaine" },
      
        // BOLS
        { id: "bowl-original-yogurt", price: 50, category: "breakfast", subcategory: "Bols" },
        { id: "bowl-amlou-yogurt", price: 55, category: "breakfast", subcategory: "Bols" },
        { id: "bowl-chia-pudding", price: 60, category: "breakfast", subcategory: "Bols" },
      
        // TARTINES
        { id: "toast-avo-poached", price: 60, category: "breakfast", subcategory: "Tartines" },
        { id: "toast-burrata", price: 50, category: "breakfast", subcategory: "Tartines" },
        { id: "toast-figtastic", price: 70, category: "breakfast", subcategory: "Tartines" },
        { id: "toast-salmon", price: 75, category: "breakfast", subcategory: "Tartines" },
      
        // PETITS PAINS BRIOCHÉS
        { id: "bun-egg", price: 40, category: "breakfast", subcategory: "Petits pains briochés" },
        { id: "bun-avo-herb", price: 55, category: "breakfast", subcategory: "Petits pains briochés" },
        { id: "bun-woods", price: 45, category: "breakfast", subcategory: "Petits pains briochés" },
      
        // SANDWICHS
        { id: "sandwich-tunacado", price: 65, category: "breakfast", subcategory: "Sandwichs" },
        { id: "sandwich-spicytuna", price: 60, category: "breakfast", subcategory: "Sandwichs" },
        { id: "sandwich-mozacado", price: 60, category: "breakfast", subcategory: "Sandwichs" },
        { id: "sandwich-toast-hollandais", price: 45, category: "breakfast", subcategory: "Sandwichs" },
        { id: "sandwich-chicken-woods", price: 70, category: "breakfast", subcategory: "Sandwichs" },
        { id: "sandwich-chicken-parm", price: 75, category: "breakfast", subcategory: "Sandwichs" },
      
        
          // ŒUFS 
          { id: "egg-fried-1", price: 20, category: "breakfast", subcategory: "Œufs" },
          { id: "egg-fried-2", price: 25, category: "breakfast", subcategory: "Œufs" },
          { id: "egg-fried-3", price: 30, category: "breakfast", subcategory: "Œufs" },
          { id: "omelette-plain", price: 30, category: "breakfast", subcategory: "Œufs" },
          { id: "omelette-cheese", price: 35, category: "breakfast", subcategory: "Œufs" },
          { id: "omelette-cheese-turkey", price: 40, category: "breakfast", subcategory: "Œufs" },
          { id: "omelette-khlie", price: 50, category: "breakfast", subcategory: "Œufs" },
          { id: "omelette-tuna", price: 60, category: "breakfast", subcategory: "Œufs" },
          { id: "omelette-shrimp", price: 60, category: "breakfast", subcategory: "Œufs" },
        
          // À LA CARTE
          { id: "alacarte-chocolate-bread", price: 14, category: "breakfast", subcategory: "À la Carte" },
          { id: "alacarte-turnover", price: 16, category: "breakfast", subcategory: "À la Carte" },
          { id: "alacarte-bread-plate", price: 28, category: "breakfast", subcategory: "À la Carte" },
          { id: "alacarte-cheese-toast", price: 25, category: "breakfast", subcategory: "À la Carte" },
          { id: "alacarte-turkey-cheese-toast", price: 30, category: "breakfast", subcategory: "À la Carte" },
          { id: "alacarte-croque-cheese", price: 35, category: "breakfast", subcategory: "À la Carte" },
          { id: "alacarte-baghrir-amlou", price: 35, category: "breakfast", subcategory: "À la Carte" },
          { id: "alacarte-croque-turkey-cheese", price: 40, category: "breakfast", subcategory: "À la Carte" },
          { id: "alacarte-khlie-eggs", price: 42, category: "breakfast", subcategory: "À la Carte" },
        
          // VARIANTE — TOAST HOLLANDAIS
          { id: "toast-amsterdam", price: 36, category: "breakfast", subcategory: "Toast Hollandais" },
          { id: "toast-rotterdam", price: 42, category: "breakfast", subcategory: "Toast Hollandais" },
        
          // KIDS FORMULA
          { id: "kids-formula-1", price: 40, category: "breakfast", subcategory: "Formules Enfants" },
          { id: "kids-formula-2", price: 45, category: "breakfast", subcategory: "Formules Enfants" },
        
          
            // ——— ENTRÉES
            { id: "salade-marocaine", price: 55, category: "entrees", subcategory: "Entrées Froides" },
            { id: "salade-nicoise", price: 70, category: "entrees", subcategory: "Entrées Froides" },
            { id: "salade-cesar", price: 75, category: "entrees", subcategory: "Entrées Froides" },
            { id: "salade-exotique", price: 80, category: "entrees", subcategory: "Entrées Froides" },
            { id: "salade-avocat-crevettes", price: 78, category: "entrees", subcategory: "Entrées Froides" },
            { id: "salade-marine", price: 82, category: "entrees", subcategory: "Entrées Froides" },
            { id: "salade-woods", price: 85, category: "entrees", subcategory: "Entrées Froides" },
          
            { id: "soupe-fruits-de-mer", price: 50, category: "entrees", subcategory: "Entrées Chaudes" },
            { id: "creme-legumes", price: 45, category: "entrees", subcategory: "Entrées Chaudes" },
            { id: "gratin-fruits-de-mer", price: 70, category: "entrees", subcategory: "Entrées Chaudes" },
            { id: "pilpil-crevettes", price: 75, category: "entrees", subcategory: "Entrées Chaudes" },
          
            // ——— MAINS: POISSON
            { id: "merlan", price: 110, category: "plats", subcategory: "À Base Poisson" },
            { id: "crevettes-grillees", price: 130, category: "plats", subcategory: "À Base Poisson" },
            { id: "thon", price: 130, category: "plats", subcategory: "À Base Poisson" },
            { id: "espadon", price: 140, category: "plats", subcategory: "À Base Poisson" },
            { id: "saumon-papillote", price: 155, category: "plats", subcategory: "À Base Poisson" },
            { id: "friture-1p", price: 210, category: "plats", subcategory: "À Base Poisson" },
            { id: "friture-2p", price: 330, category: "plats", subcategory: "À Base Poisson" },
          
            // ——— MAINS: VIANDE & POULET
            { id: "emince-poulet", price: 105, category: "plats", subcategory: "À Base Viande & Poulet" },
            { id: "brochettes-poulet", price: 100, category: "plats", subcategory: "À Base Viande & Poulet" },
            { id: "filet-poulet", price: 97, category: "plats", subcategory: "À Base Viande & Poulet" },
            { id: "mixed-grill", price: 140, category: "plats", subcategory: "À Base Viande & Poulet" },
            { id: "emince-boeuf", price: 145, category: "plats", subcategory: "À Base Viande & Poulet" },
            { id: "stroganoff", price: 145, category: "plats", subcategory: "À Base Viande & Poulet" },
            { id: "entrecote", price: 150, category: "plats", subcategory: "À Base Viande & Poulet" },
            { id: "filet-boeuf", price: 170, category: "plats", subcategory: "À Base Viande & Poulet" },
          
            // ——— PLATS MAROCAINS
            { id: "tajine-viande-hachee", price: 78, category: "plats", subcategory: "Marocains" },
            { id: "tajine-pruneaux", price: 90, category: "plats", subcategory: "Marocains" },
            { id: "tajine-coquelet-citron", price: 83, category: "plats", subcategory: "Marocains" },
            { id: "tangia", price: 105, category: "plats" , subcategory: "Marocains" },
            { id: "pastilla-poulet", price: 80, category: "plats", subcategory: "Marocains" },
            { id: "pastilla-poisson", price: 90, category: "plats", subcategory: "Marocains" },
            { id: "couscous-veg", price: 55, category: "plats", subcategory: "Marocains" },
            { id: "couscous-poulet", price: 65, category: "plats", subcategory: "Marocains" },
            { id: "couscous-viande", price: 75, category: "plats", subcategory: "Marocains" },
          
            
              // ——— PASTA
              { id: "pasta-annalisa", price: 95, category: "pastas", subcategory: "Pâtes" },
              { id: "pasta-carbonara", price: 80, category: "pastas", subcategory: "Pâtes" },
              { id: "linguine-scampi", price: 115, category: "pastas", subcategory: "Pâtes" },
              { id: "pasta-bolognaise", price: 85, category: "pastas", subcategory: "Pâtes" },
              { id: "farfalle-crema-gamberi", price: 105, category: "pastas", subcategory: "Pâtes" },
              { id: "pasta-pollo", price: 85, category: "pastas", subcategory: "Pâtes" },
              { id: "pasta-pollo-pesto", price: 85, category: "pastas", subcategory: "Pâtes" },
              { id: "pasta-tonno", price: 80, category: "pastas", subcategory: "Pâtes" },
              { id: "pasta-casa", price: 105, category: "pastas", subcategory: "Pâtes" },
              { id: "pasta-frutti-di-mare", price: 95, category: "pastas", subcategory: "Pâtes" },
              { id: "lasagnes-bolognaise", price: 75, category: "pastas", subcategory: "Pâtes" },
              { id: "pasta-arrabiata", price: 65, category: "pastas", subcategory: "Pâtes" },
              { id: "spaghetti-noir-mer", price: 105, category: "pastas", subcategory: "Pâtes" },
            
              // ——— PIZZAS
              { id: "pz-margherita", price: 60, category: "pizzas", subcategory: "Pizzas" },
              { id: "pz-frutti", price: 85, category: "pizzas", subcategory: "Pizzas" },
              { id: "pz-primavera", price: 65, category: "pizzas", subcategory: "Pizzas" },
              { id: "pz-4formaggi", price: 80, category: "pizzas", subcategory: "Pizzas" },
              { id: "pz-prosciutto", price: 75, category: "pizzas", subcategory: "Pizzas" },
              { id: "pz-diavola", price: 82, category: "pizzas", subcategory: "Pizzas" },
              { id: "pz-tonno", price: 72, category: "pizzas", subcategory: "Pizzas" },
              { id: "pz-4stagioni", price: 85, category: "pizzas", subcategory: "Pizzas" },
              { id: "pz-pollo-griglia", price: 80, category: "pizzas", subcategory: "pizzas" },
              { id: "pz-royale-mixte", price: 85, category: "pizzas", subcategory: "Pizzas" },
              { id: "pz-bolognaise", price: 80, category: "pizzas", subcategory: "Pizzas" },
              { id: "pz-woods", price: 105, category: "pizzas", subcategory: "Pizzas" },
              { id: "pz-puttanesca", price: 65, category: "pizzas", subcategory: "Pizzas" },
            
              // ——— APÉRITIFS
              { id: "onion-rings-4", price: 16, category: "aperitifs", subcategory: "Apéritifs" },
              { id: "onion-rings-6", price: 28, category: "aperitifs", subcategory: "Apéritifs" },
              { id: "onion-rings-9", price: 48, category: "aperitifs", subcategory: "Apéritifs" },
              { id: "mozza-sticks-4", price: 35, category: "aperitifs", subcategory: "Apéritifs" },
              { id: "mozza-sticks-6", price: 48, category: "aperitifs", subcategory: "Apéritifs" },
              { id: "mozza-sticks-9", price: 58, category: "aperitifs", subcategory: "Apéritifs" },
              { id: "jalapenos-cheddar-4", price: 35, category: "aperitifs", subcategory: "Apéritifs" },
              { id: "jalapenos-cheddar-6", price: 48, category: "aperitifs", subcategory: "Apéritifs" },
              { id: "jalapenos-cheddar-9", price: 58, category: "aperitifs", subcategory: "Apéritifs" },
            
              // ——— TEX-MEX
              { id: "nuggets-4", price: 32, category: "aperitifs", subcategory: "Tex Mex" },
              { id: "nuggets-6", price: 44, category: "aperitifs", subcategory: "Tex Mex" },
              { id: "nuggets-9", price: 54, category: "aperitifs", subcategory: "Tex Mex" },
              { id: "drumsticks-4", price: 55, category: "aperitifs", subcategory: "Tex Mex" },
              { id: "drumsticks-6", price: 68, category: "aperitifs", subcategory: "Tex Mex" },
              { id: "jalapenos-bites-4", price: 32, category: "aperitifs", subcategory: "Tex Mex" },
              { id: "jalapenos-bites-6", price: 42, category: "aperitifs", subcategory: "Tex Mex" },
              { id: "jalapenos-bites-9", price: 52, category: "aperitifs", subcategory: "Tex Mex" },
            
             
                // ——— BURGERS
                { id: "burger-chicken", price: 55, category: "burgers", subcategory: "Burgers" },
                { id: "burger-cheese", price: 62, category: "burgers", subcategory: "Burgers" },
                { id: "burger-double-cheese", price: 72, category: "burgers", subcategory: "Burgers" },
                { id: "burger-american", price: 68, category: "burgers", subcategory: "Burgers" },
                { id: "burger-cheese-jalapenos", price: 70, category: "burgers", subcategory: "Burgers" },
                { id: "burger-chicken-ananas", price: 65, category: "burgers", subcategory: "Burgers" },
             
              
                
                  // ——— CRÊPES SALÉES
                  { id: "crepe-fromage", price: 39, category: "crepes_savory", subcategory: "Crêpes Salées" },
                  { id: "crepe-thon", price: 47, category: "crepes_savory", subcategory: "Crêpes Salées" },
                  { id: "crepe-dinde-fromage", price: 46, category: "crepes_savory", subcategory: "Crêpes Salées" },
                  { id: "crepe-poulet-champignons", price: 52, category: "crepes_savory", subcategory: "Crêpes Salées" },
                  { id: "crepe-viande-hachee", price: 55, category: "crepes_savory", subcategory: "Crêpes Salées" },
                  { id: "crepe-mixte", price: 62, category: "crepes_savory", subcategory: "Crêpes Salées" },

                    // ——— TACOS
                    { id: "tacos-poulet", price: 65, category: "tacos", subcategory: "Tacos" },
                    { id: "tacos-cordon-bleu", price: 70, category: "tacos", subcategory: "Tacos" },
                    { id: "tacos-viande", price: 72, category: "tacos", subcategory: "Tacos" },
                    { id: "tacos-woods-mixte", price: 75, category: "tacos", subcategory: "Tacos" },
                    
                      // ——— SANDWICHS & PANINI
                      { id: "sandwich-fajitas-poulet", price: 70, category: "sandwiches", subcategory: "Sandwiches" },
                      { id: "sandwich-american-bbq", price: 78, category: "sandwiches", subcategory: "Sandwiches" },
                      { id: "sandwich-woods", price: 80, category: "sandwiches", subcategory: "Sandwiches" },
                    
                      { id: "panini-classic-italien", price: 45, category: "panini", subcategory: "Panini" },
                      { id: "panini-poulet-pesto", price: 55, category: "panini", subcategory: "Panini" },
                      { id: "panini-tuna-melt", price: 52, category: "panini", subcategory: "Panini" },
                    
                      
                        // ——— CRÊPES / GAUFRES / PANCAKES SUCRÉS
                        { id: "sweet-crepe-simple", price: 26, category: "sweets_crepes_gaufres_pancakes", subcategory: "Crêpes & Gauffres" },
                        { id: "sweet-crepe-miel", price: 31, category: "sweets_crepes_gaufres_pancakes", subcategory: "Crêpes & Gauffres" },
                        { id: "sweet-crepe-caramel", price: 31, category: "sweets_crepes_gaufres_pancakes", subcategory: "Crêpes & Gauffres" },
                        { id: "sweet-crepe-amlou", price: 36, category: "sweets_crepes_gaufres_pancakes", subcategory: "Crêpes & Gauffres" },
                        { id: "sweet-crepe-choco", price: 31, category: "sweets_crepes_gaufres_pancakes", subcategory: "Crêpes & Gauffres" },
                        { id: "sweet-crepe-choco-banane", price: 36, category: "sweets_crepes_gaufres_pancakes", subcategory: "Crêpes & Gauffres" },
                        { id: "sweet-crepe-choco-blanc", price: 31, category: "sweets_crepes_gaufres_pancakes", subcategory: "Crêpes & Gauffres" },
                        { id: "sweet-crepe-nutella", price: 36, category: "sweets_crepes_gaufres_pancakes", subcategory: "Crêpes & Gauffres" },
                        { id: "sweet-crepe-black-white", price: 40, category: "sweets_crepes_gaufres_pancakes", subcategory: "Crêpes & Gauffres" },
                        { id: "sweet-crepe-nutella-noix", price: 41, category: "sweets_crepes_gaufres_pancakes", subcategory: "Crêpes & Gauffres" },
                        { id: "sweet-crepe-nutella-banane", price: 41, category: "sweets_crepes_gaufres_pancakes", subcategory: "Crêpes & Gauffres" },
                        { id: "sweet-crepe-pistache", price: 46, category: "sweets_crepes_gaufres_pancakes", subcategory: "Crêpes & Gauffres" },
                        { id: "sweet-crepe-mix", price: 45, category: "sweets_crepes_gaufres_pancakes", subcategory: "Crêpes & Gauffres" },
                        { id: "sweet-crepe-woods", price: 55, category: "sweets_crepes_gaufres_pancakes", subcategory: "Crêpes & Gauffres" },
                      
                        { id: "pancake-simple", price: 32, category: "sweets_crepes_gaufres_pancakes", subcategory: "Pancake" },
                        { id: "pancake-miel", price: 36, category: "sweets_crepes_gaufres_pancakes", subcategory: "Pancake" },
                        { id: "pancake-caramel", price: 36, category: "sweets_crepes_gaufres_pancakes", subcategory: "Pancake" },
                        { id: "pancake-amlou", price: 42, category: "sweets_crepes_gaufres_pancakes", subcategory: "Pancake" },
                        { id: "pancake-choco", price: 36, category: "sweets_crepes_gaufres_pancakes", subcategory: "Pancake" },
                        { id: "pancake-choco-banane", price: 42, category: "sweets_crepes_gaufres_pancakes", subcategory: "Pancake" },
                        { id: "pancake-choco-blanc", price: 36, category: "sweets_crepes_gaufres_pancakes", subcategory: "Pancake" },
                        { id: "pancake-nutella", price: 42, category: "sweets_crepes_gaufres_pancakes", subcategory: "Pancake" },
                        { id: "pancake-black-white", price: 44, category: "sweets_crepes_gaufres_pancakes", subcategory: "Pancake" },
                        { id: "pancake-nutella-noix", price: 46, category: "sweets_crepes_gaufres_pancakes", subcategory: "Pancake" },
                        { id: "pancake-nutella-banane", price: 46, category: "sweets_crepes_gaufres_pancakes", subcategory: "Pancake" },
                        { id: "pancake-pistache", price: 52, category: "sweets_crepes_gaufres_pancakes", subcategory: "Pancake" },
                        { id: "pancake-mix", price: 51, category: "sweets_crepes_gaufres_pancakes", subcategory: "Pancake" },
                        { id: "pancake-woods", price: 59, category: "sweets_crepes_gaufres_pancakes", subcategory: "Pancake" },
                      
                        // ——— DESSERTS
                        { id: "dess-patisserie", price: 30, category: "desserts", subcategory: "Desserts" },
                        { id: "dess-fruit-salad-1", price: 45, category: "desserts", subcategory: "Desserts" },
                        { id: "dess-fruit-salad-2", price: 85, category: "desserts", subcategory: "Desserts" },
                        { id: "dess-fondant", price: 45, category: "desserts", subcategory: "Desserts" },
                      
                     
                          // ——— FRAPPUCCINO & FREAKSHAKE
                          { id: "frappuccino", price: 38, category: "desserts", subcategory: "Frappuccino" },
                          { id: "milkshake", price: 42, category: "desserts", subcategory: "freakshake" },
                          { id: "freakshake", price: 55, category: "desserts", subcategory: "Freakshake" },
                        
                          // ——— COUPES DE GLACES
                          { id: "coupe-fruit-rouge", price: 55, category: "desserts", subcategory: "Coupes glacées" },
                          { id: "coupe-rocher", price: 42, category: "desserts", subcategory: "Coupes glacées" },
                          { id: "coupe-kitkat", price: 42, category: "desserts", subcategory: "Coupes glacées" },
                          { id: "coupe-banana-split", price: 52, category: "desserts", subcategory: "Coupes glacées" },
                          { id: "coupe-fraise-melba", price: 52, category: "desserts", subcategory: "Coupes glacées" },
                          { id: "coupe-caraibes", price: 55, category: "desserts", subcategory: "Coupes glacées" },
                          { id: "coupe-caramelo", price: 55, category: "desserts", subcategory: "Coupes glacées" },
                          { id: "coupe-bisutto", price: 55, category: "desserts", subcategory: "Coupes glacées" },
                          { id: "coupe-negrisco", price: 55, category: "desserts", subcategory: "Coupes glacées" },
                          { id: "coupe-exotique", price: 70, category: "desserts", subcategory: "Coupes glacées" },
                          { id: "coupe-woods", price: 95, category: "desserts", subcategory: "Coupes glacées" },
                          
                            // ——— COMPOSEZ VOTRE GLACE
                            { id: "ice-chantilly", price: 9, category: "desserts", subcategory: "Composez Votre Glace" },
                            { id: "ice-1-boule", price: 16, category: "desserts", subcategory: "Composez Votre Glace" },
                            { id: "ice-2-boules", price: 30, category: "desserts", subcategory: "Composez Votre Glace" },
                            { id: "ice-3-boules", price: 42, category: "desserts", subcategory: "Composez Votre Glace" },
                            { id: "ice-4-boules", price: 56, category: "desserts", subcategory: "Composez Votre Glace" },
                            { id: "ice-500g", price: 65, category: "desserts", subcategory: "Composez Votre Glace" },
                            { id: "ice-1kg", price: 115, category: "desserts", subcategory: "Composez Votre Glace" },
                            { id: "ice-tarte", price: 300, category: "desserts", subcategory: "Composez Votre Glace" },
                          
                          
                        
                
];

/* ============================================================================
   7) Icons per category (order controls the “All” section order)
   ========================================================================== */
const CATEGORY_META = [
  { id: "drinks", icon: Coffee },
  { id: "breakfast", icon: Sandwich },
  { id: "entrees", icon: Soup },
  { id: "plats", icon: Salad },
  { id: "pastas", icon: Soup },
  { id: "pizzas", icon: Pizza },
  { id: "aperitifs", icon: Sandwich },
  { id: "burgers", icon: Sandwich },
  { id: "crepes_savory", icon: Sandwich },
  { id: "tacos", icon: Sandwich },
  { id: "sandwiches", icon: Sandwich },
  { id: "panini", icon: Sandwich },
  { id: "sweets_crepes_gaufres_pancakes", icon: IceCream },
  { id: "desserts", icon: IceCream },
] as const;

/* ============================================================================
   8) Utilities
   ========================================================================== */
function cx(...list: (string | false | undefined)[]) {
  return list.filter(Boolean).join(" ");
}
function useQueryParam(key: string) {
  const [val, setVal] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const u = new URL(window.location.href);
    setVal(u.searchParams.get(key));
  }, []);
  return val;
}


/** i18n helpers */
function useI18n(initial?: LangKey) {
  const qp = (useQueryParam("lang") as LangKey | null) || null;
  const [lang, setLang] = useState<LangKey>(initial || qp || "fr");
  const reg = LANGS[lang] || LANGS.fr;

  // Text resolver with FR fallback
  function tItem(id: string): ItemText {
    return reg.items[id] || LANGS.fr.items[id] || { name: id };
  }
  function tCategory(id: CategoryId) {
    return reg.categories[id] || LANGS.fr.categories[id] || id;
  }
  function tSubcat(raw?: string) {
    if (!raw) return "";
    return reg.subcats[raw] || LANGS.fr.subcats[raw] || raw;
  }

  return { lang, setLang, dict: reg.ui, tItem, tCategory, tSubcat };
}

/* ============================================================================
   9) Main component
   ========================================================================== */
export default function WoodsSite() {
  const { lang, setLang, dict, tItem, tCategory, tSubcat } = useI18n();
  const [route, setRoute] = useState<"menu">("menu");
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string>("all");
  const showAllView = activeCat === "all" || query.trim().length > 0;

  // --- safe local helpers to avoid undefined refs ---
  function heroFromItems(items: MenuItem[] = []) {
    // pick first item.image if present, else a neutral placeholder
    const img = items.find((i) => (i as any).image)?.image as string | undefined;
    return img || "";
  }
  function heroForCategory(cat: CategoryId, items: MenuItem[] = []) {
    // currently same strategy; you can customize per category later
    return heroFromItems(items);
  }
  // ---------------------------------------------------

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();

    // Global search: ignore activeCat once user types
    if (q) {
      return MENU_ITEMS.filter((i) => {
        const txt = tItem(i.id);
        const haystack = (
          txt.name +
          " " +
          (txt.desc || "") +
          " " +
          (tSubcat(i.subcategory) || "")
        ).toLowerCase();
        return haystack.includes(q);
      });
    }

    // No search: respect the selected category (or "all")
    if (activeCat !== "all") {
      return MENU_ITEMS.filter((i) => i.category === (activeCat as CategoryId));
    }
    return MENU_ITEMS;
  }, [query, activeCat, tItem, tSubcat]);

  // Group: category -> subcategory -> items[]
  const grouped = useMemo(() => {
    const byCat: Record<string, Record<string, MenuItem[]>> = {};
    for (const item of filteredItems) {
      const cat = item.category;
      const sub = item.subcategory || "_";
      (byCat[cat] ||= {});
      (byCat[cat][sub] ||= []).push(item);
    }
    return byCat;
  }, [filteredItems]);

  // Language picker gate (first load only)
  const [showGate, setShowGate] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const u = new URL(window.location.href);
      if (!u.searchParams.get("lang")) setShowGate(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-clay/60 text-neutral-100">
      <div
        className="pointer-events-none fixed inset-0 bg-cover bg-center opacity-10"
        style={{
          backgroundImage:
            "url('https://plus.unsplash.com/premium_photo-1675695700222-9f4cb0c4a158?q=80&w=1288&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-clay border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
          {/* Brand left */}
          <div className="flex items-center">
            <Image
              src="/woods-logo-hd.svg"
              alt="WOODS Logo"
              width={100}
              height={20}
              priority
            />
          </div>

          {/* Center nav links (hidden on mobile) */}
      

          {/* Toggle extreme right */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close Menu" : "Open Menu"}
            className="ml-auto rounded-xl p-2 hover:bg-mist/80 border border-white/10"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={menuOpen ? "icon-x" : "icon-menu"}
                initial={{ rotate: menuOpen ? -90 : 90, opacity: 0, scale: 0.8 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: menuOpen ? 90 : -90, opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-5 h-5"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </header>

      {/* Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.aside
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="fixed top-0 inset-y-0 right-0 w-80 bg-clay/40 backdrop-blur-xl border-l border-white/10 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-end p-4 border-b border-white/10">
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close Menu"
                className="ml-auto rounded-lg p-2 hover:bg-white/10"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key="drawer-x"
                    initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="w-5 h-5"
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                </AnimatePresence>
              </button>
            </div>

            {/* Navigation */}
            <nav className="p-2 flex-1 overflow-y-auto">
          
              <DrawerLink
                icon={CupSoda}
                label={dict.menu}
                onClick={() => {
                  setRoute("menu");
                  setMenuOpen(false);
                }}
              />

              <div className="mt-4 px-2 text-xs uppercase tracking-wider text-white/50">
                Language
              </div>
              <div className="p-2 flex gap-2">
                {(["fr", "en", "nl"] as LangKey[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={cx(
                      "px-3 py-1.5 rounded-full border text-sm",
                      lang === l
                        ? "bg-seafoam text-black border-seafoam"
                        : "border-white/20 hover:bg-white/10"
                    )}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </nav>

            {/* Footer Social Links */}
            <div className="border-t border-white/10 p-4">
              <div className="flex items-center justify-around text-white/80">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/woodstanger/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-seafoam transition-colors"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden="true">
                    <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM18 6.2a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                  </svg>
                </a>

                {/* TikTok */}
                <a
                  href="https://www.tiktok.com/@woodstanger"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-seafoam transition-colors"
                  aria-label="TikTok"
                  title="TikTok"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden="true">
                    <path d="M16.5 2c.3 2.2 1.7 3.8 3.9 4.1V9c-1.7 0-3.3-.5-4.6-1.4v6.9a6.6 6.6 0 1 1-6.6-6.6c.4 0 .9 0 1.3.1v3a3.6 3.6 0 1 0 2.3 3.4V2h3.7z"/>
                  </svg>
                </a>

                {/* Snapchat */}
                <a
                  href="https://www.snapchat.com/@woodstanger"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-seafoam transition-colors"
                  aria-label="Snapchat"
                  title="Snapchat"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden="true">
                    <path d="M12 2c3 0 5 2 5 5 0 1.6.8 3 2.2 3.8.3.2.4.6.2.9-.5.8-1.5 1.1-2.3 1.3-.2.7-.4 1.4-.9 2 .9.3 1.8.7 2.7.9.4.1.6.6.4.9-.6.8-2 1-2.8 1.1-.9 1.3-2.8 2.1-5.5 2.1s-4.6-.8-5.5-2.1c-.8-.1-2.2-.3-2.8-1.1-.2-.3 0-.8.4-.9.9-.2 1.8-.6 2.7-.9-.5-.6-.7-1.3-.9-2-.8-.2-1.8-.5-2.3-1.3-.2-.3-.1-.7.2-.9C7.2 10 8 8.6 8 7c0-3 2-5 5-5z"/>
                  </svg>
                </a>

                {/* Google Reviews */}
                <a
                  href="https://www.google.com/maps/place/Woods+Caf%C3%A9-Restaurant/@35.7751607,-5.7883284,709m/data=!3m1!1e3!4m8!3m7!1s0xd0b809d995d5149:0x393c9fdd80cd8f69!8m2!3d35.7751564!4d-5.7857588!9m1!1b1!16s%2Fg%2F11ddzlg50l?entry=ttu&g_ep=EgoyMDI1MTAyMC4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-seafoam transition-colors"
                  aria-label="Google Reviews"
                  title="Google Reviews"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden="true">
                    <path d="M21.8 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.5a4.7 4.7 0 0 1-2 3.1v2.6h3.2a9.6 9.6 0 0 0 3.1-7.5z"/>
                    <path d="M12 22a9.6 9.6 0 0 0 6.6-2.4l-3.2-2.6A5.9 5.9 0 0 1 12 18a6 6 0 0 1-5.6-4H3v2.6A10 10 0 0 0 12 22z"/>
                    <path d="M6.4 14A6 6 0 0 1 6 12c0-.7.1-1.4.4-2V7.4H3A10 10 0 0 0 2 12c0 1.6.4 3.1 1 4.6L6.4 14z"/>
                    <path d="M12 6.1c1.3 0 2.5.4 3.4 1.3L18.7 4A10 10 0 0 0 12 2 10 10 0 0 0 3 7.4L6.4 10A6 6 0 0 1 12 6.1z"/>
                  </svg>
                </a>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="relative mx-auto max-w-6xl px-4">
  <AnimatePresence mode="wait">
    {route === "menu" && (
      <motion.section
        key="menu"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
        className="py-6"
      >
        {/* Search */}
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={dict.search}
              className="w-full h-12 pl-9 pr-10 rounded-2xl border border-white/20 bg-white/10 placeholder-white/40 outline-none focus:ring-2 focus:ring-seafoam"
            />
            {query && (
              <button
                type="button"
                aria-label={dict.clearSearch ?? "Clear search"}
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-white/20 focus:outline-none"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            )}
          </div>
        </div>

        {/* Category chips */}
        <div className="mt-4 overflow-x-auto pb-2">
          <div className="flex gap-2 min-w-max">
            <CategoryChip
              active={activeCat === "all"}
              onClick={() => setActiveCat("all")}
              label={dict.all}
            />
            {CATEGORY_META.map(({ id, icon: Icon }) => (
              <CategoryChip
                key={id}
                active={activeCat === id}
                onClick={() => setActiveCat(id)}
                label={tCategory(id as CategoryId)}
                icon={<Icon className="w-4 h-4" />}
              />
            ))}
          </div>
        </div>

        {/* All vs Single view (global search forces All view) */}
        {showAllView ? (
          /* ---------------- ALL CATEGORIES ---------------- */
          <div className="mt-6 space-y-10">
            {CATEGORY_META.map(({ id }) => {
              const subMap = grouped[id];
              if (!subMap) return null;

              const subs = Object.keys(subMap);
              const itemsFlat = Object.values(subMap).flat();

              return (
                <section key={`cat-${id}`}>
                  <header className="flex items-baseline justify-between mb-3">
                    <h3 className="text-xl font-semibold">
                      {tCategory(id as CategoryId)}
                    </h3>
                    <span className="text-sm text-white/60">
                      {dict.itemsCount(itemsFlat.length)}
                    </span>
                  </header>

                  <div className="mt-4 space-y-6">
                    {subs.map((raw) => {
                      const items = subMap[raw] || [];
                      const sub = tSubcat(raw);
                      if (!items.length) return null;

                      return (
                        <motion.article
                          key={`${id}-${raw}`}
                          whileHover={{ y: -2 }}
                          className="rounded-3xl border border-driftwood/30 bg-mist text-clay shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                        >
                          {/* sub header */}
                          <header className="px-4 pt-4 pb-2 flex items-baseline justify-between">
                            <h4 className="text-base font-semibold">{sub}</h4>
                            <span className="text-xs text-black/50">
                              {items.length}
                            </span>
                          </header>


                          {/* items */}
                          <div className="mt-3 mx-4 mb-4 rounded-3xl border border-driftwood/30 bg-mist text-clay">
                            <ul className="divide-y divide-black/10">
                              {items.map((it) => {
                                const txt = tItem(it.id);
                                return (
                                  <ItemRow
                                    key={it.id}
                                    title={txt.name}
                                    desc={txt.desc}
                                    price={it.price}
                                    priceFmt={dict.priceMAD}
                                  />
                                );
                              })}
                            </ul>
                          </div>
                        </motion.article>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          /* ---------------- SINGLE ACTIVE CATEGORY (same look) ---------------- */
          <div className="mt-6 space-y-10">
            {(() => {
              const id = activeCat as CategoryId;
              const subMap = grouped[id] || {};
              const subs = Object.keys(subMap);
              const itemsFlat = Object.values(subMap).flat();

              if (!subs.length) return null;

              return (
                <section key={`cat-${id}`}>
                  <header className="flex items-baseline justify-between mb-3">
                    <h3 className="text-xl font-semibold">{tCategory(id)}</h3>
                    <span className="text-sm text-white/60">
                      {dict.itemsCount(itemsFlat.length)}
                    </span>
                  </header>

                  <div className="mt-4 space-y-6">
                    {subs.map((raw) => {
                      const items = subMap[raw] || [];
                      if (!items.length) return null;

                      const sub = tSubcat(raw);

                      return (
                        <motion.article
                          key={`${id}-${raw}`}
                          whileHover={{ y: -2 }}
                          className="rounded-3xl border border-driftwood/30 bg-mist text-clay shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                        >
                          {/* sub header */}
                          <header className="px-4 pt-4 pb-2 flex items-baseline justify-between">
                            <h4 className="text-base font-semibold">{sub}</h4>
                            <span className="text-xs text-black/50">
                              {items.length}
                            </span>
                          </header>

                          
                
                          {/* items */}
                          <div className="mt-3 mx-4 mb-4 rounded-3xl border border-driftwood/30 bg-mist text-clay">
                            <ul className="divide-y divide-black/10">
                              {items.map((it: MenuItem) => {
                                const txt = tItem(it.id);
                                return (
                                  <ItemRow
                                    key={it.id}
                                    title={txt.name}
                                    desc={txt.desc}
                                    price={it.price}
                                    priceFmt={dict.priceMAD}
                                  />
                                );
                              })}
                            </ul>
                          </div>
                        </motion.article>
                      );
                    })}
                  </div>
                </section>
              );
            })()}
          </div>
        )}
      </motion.section>
    )}


  </AnimatePresence>
</main>


      {/* ------------------------------ Language Gate ----------------------------- */}
      <AnimatePresence>
        {showGate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-mist/30 backdrop-blur-xl grid place-items-center p-6"
          >
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-full max-w-md rounded-3xl border border-mist/20 bg-clay/30 p-6 shadow-2xl text-black text-center"
            >
              {/* 🔹 Logo centered */}
              <div className="flex justify-center mb-4">
                <Image src="/woods-logo.svg" alt="WOODS Logo" width={120} height={40} priority />
              </div>

              {/* Heading */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <Languages className="w-5 h-5 text-black" />
                <h3 className="text-lg font-semibold">{dict.chooseLanguage}</h3>
              </div>

              {/* Language buttons */}
              <div className="mt-4 grid grid-cols-1 gap-2">
                <LangBtn
                  label="English"
                  onClick={() => {
                    setLang("en");
                    setShowGate(false);
                  }}
                />
                <LangBtn
                  label="Français"
                  onClick={() => {
                    setLang("fr");
                    setShowGate(false);
                  }}
                />
                <LangBtn
                  label="Nederlands"
                  onClick={() => {
                    setLang("nl");
                    setShowGate(false);
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-12 pb-12 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {dict.brand}
      </footer>
    </div>
  );
}

/* ==========================================================================
   10 Reusable bits
   =========================================================================*/

function LangBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl px-4 py-3 border border-mist/30 bg-white/60 hover:bg-white/80 transition text-black text-sm text-left"
    >
      {label}
    </button>
  );
}

function ItemRow({
  title,
  desc,
  price,
  priceFmt,
}: {
  title: string;
  desc?: string;
  price: number | null | undefined;
  priceFmt: (v: number) => string;
}) {
  return (
    <li className="flex items-start gap-3 px-4 py-3">
      <div className="flex-1 min-w-0">
        <div className="font-medium leading-tight truncate">{title}</div>
        {desc ? <div className="text-sm text-black/60 leading-snug line-clamp-2">{desc}</div> : null}
      </div>
      <div className="shrink-0 pl-2 font-semibold tracking-tight">
        {typeof price === "number" ? priceFmt(price) : <span className="text-black/40">—</span>}
      </div>
    </li>
  );
}

function CategoryChip({
  active,
  onClick,
  label,
  icon,
}: {
  active?: boolean;
  onClick?: () => void;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition",
        active ? "bg-seafoam text-black border-seafoam" : "border-white/20 hover:bg-white/10"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function DrawerLink({
  icon: Icon,
  label,
  onClick,
}: {
  icon: any;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/10">
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4" />
        <span className="text-sm">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 opacity-60" />
    </button>
  );
}

function LangGate({
  current,
  onPick,
  onClose,
}: {
  current: LangKey;
  onPick: (l: LangKey) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm">
      <div className="w-[92vw] max-w-md rounded-3xl border border-white/10 bg-clay p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Language</div>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-white/70 mb-4">Select your preferred language.</p>
        <div className="grid grid-cols-3 gap-2">
          {(["fr", "en", "nl"] as LangKey[]).map((l) => (
            <button
              key={l}
              onClick={() => onPick(l)}
              className={cx(
                "rounded-xl px-4 py-3 border text-center",
                current === l ? "bg-seafoam text-black border-seafoam" : "border-white/20 hover:bg-white/10"
              )}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
