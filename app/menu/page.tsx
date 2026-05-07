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







export type MenuItem = {
  id: string;
  price: number | null; // some prices TBD in your data
  category: CategoryId;
  subcategory?: string; // language-neutral slug-like label
  tags?: string[];
};

/* ============================================================================
   2) Language meta + UI strings (brand, actions, headers)
   ========================================================================== */
const UI: Record<LangKey, { rtl?: boolean; brand: string; chooseLanguage:  string; menu:  string; search: string; clearSearch?: string; storyTitle: string; story: string; all: string; itemsCount: (n: number) => string; priceMAD: (v: number) => string; }> = {
  fr: {
    brand: "WOODS",
    chooseLanguage: "Choisissez votre langue",
    menu: "Notre Carte",
    search: "Rechercher des plats, ingrédients…",
    clearSearch: "Effacer la recherche", 
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
    clearSearch: "Clear search", 
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
    clearSearch: "Zoekopdracht wissen", 
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
    "Bagels": "Bagels",
    "Risotto": "Risotto",
    "Sides": "Accompagnements",
    "Tartes": "Tartes",

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
    "Bagels": "Bagels",
    "Risotto": "Risotto",
    "Sides": "Sides",
    "Tartes": "Tarts",

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
    "Bagels": "Bagels",
    "Risotto": "Risotto",
    "Sides": "Bijgerechten",
    "Tartes": "Taarten",

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
/** FRENCH culinary translations */
const ITEMS_FR: ItemsTextPack = {
  // ——— Drinks (Matcha)
  "matcha-latte": { name: "Matcha Latte / Glacé", desc: "Matcha avec lait (Chaud/Froid)" },
  "matcha-coco": { name: "Matcha Eau de Coco", desc: "Matcha à l'eau de coco" },
  "matcha-pink-foam": { name: "Matcha Mousse Rose", desc: "Matcha surmonté de mousse à la fraise" },
  "matcha-fraise": { name: "Matcha Fraise", desc: "Matcha avec purée de fraise" },
  "matcha-mangue": { name: "Matcha Mangue", desc: "Matcha avec purée de mangue" },
  "matcha-ube": { name: "Matcha Ube", desc: "Matcha à l'ube" },
  "matcha-blue": { name: "Matcha Bleu", desc: "Matcha bleu" },
  "milk-options": { name: "Options de Lait", desc: "Lait d'avoine ou de coco" },

  // ——— Drinks (Café & Spécialités)
  "coffee-coco-latte": { name: "Latte Coco", desc: "Eau de coco avec mousse de café" },
  "coffee-creme-brulee-latte": { name: "Latte Crème Brûlée", desc: "Café glacé surmonté de crème brûlée" },
  "coffee-spanish-latte": { name: "Latte Espagnol", desc: "Lait concentré avec shot d'expresso" },
  "coffee-ube-latte": { name: "Latte Ube", desc: "Latte à l'ube" },
  "coffee-pistachio-latte": { name: "Latte Pistache", desc: "Latte onctueux à la saveur de pistache" },
  "coffee-tiramisu-latte": { name: "Latte Tiramisu", desc: "Latte au café inspiré du tiramisu" },
  "coffee-chai-latte": { name: "Chai Latte", desc: "Thé noir épicé avec du lait chaud" },
  "milk-options1": { name: "Options de Lait", desc: "Lait d'avoine ou de coco" },
  
  // ——— Drinks (Rafraîchissants)
  "refresher-hibiscus": { name: "Hibiscus", desc: "Hibiscus infusé maison" },
  "refresher-hibiscus-peche": { name: "Hibiscus Pêche", desc: "Thé d'hibiscus avec finition pêche" },
  "refresher-tropical-ginger": { name: "Gingembre Tropical", desc: "Mangue et gingembre en fusion épicée" },
  "refresher-watermelon-fizz": { name: "Fizz Pastèque", desc: "Pastèque mélangée avec soda pétillant" },

  // ——— Drinks (Smoothies)
  "smoothie-multivitamine": { name: "Multivitamines", desc: "Orange, ananas, kiwi et mangue" },
  "smoothie-california-dream": { name: "California Dream", desc: "Orange, fraise, banane, kiwi et yaourt" },
  "smoothie-jack-special": { name: "Jack Spécial", desc: "Fraise, ananas et citron" },
  "smoothie-coco-mango": { name: "Coco Mangue", desc: "Mangue, banane et lait de coco" },
  "smoothie-golden-smooth": { name: "Golden Smooth", desc: "Banane, mangue, ananas, lait vanillé" },
  "smoothie-coco-blush": { name: "Coco Blush", desc: "Fraise, mangue, yaourt, banane, lait de coco" },

  // ——— Drinks (Jus pressés / Health)
  "balance-debloat": { name: "Balance + Débloat", desc: "Ananas, citron, gingembre" },
  "iron-charge": { name: "Fer + Énergie", desc: "Épinards, citron, céleri" },
  "hydrate-pulse": { name: "Hydrate + Pulsé", desc: "Ananas, citron, concombre, glace" },
  "green-clean": { name: "Green Clean", desc: "Épinards, citron, céleri, concombre, pomme" },
  "berry-mood": { name: "Berry Mood", desc: "Fraise, myrtille, framboise, pomme, banane, citron" },
  "stress-down": { name: "Stress Down", desc: "Fraise, gingembre, pomme, glace" },
  "tropical-boost": { name: "Tropical Boost", desc: "Ananas, sirop de fruit de la passion, pomme, glace" },
  "feel-good": { name: "Feel Good", desc: "Carotte, curcuma, gingembre, citron, pomme, glace" },
  "berry-breeze": { name: "Berry Breeze", desc: "Fraise, citron, menthe, pomme" },

  // ——— Drinks (Redbull Crémeux)
  "creamy-redbull-blueberry": { name: "Redbull Crémeux Myrtille", desc: "Myrtille coco avec crème épaisse" },
  "creamy-redbull-strawberry": { name: "Redbull Crémeux Fraise", desc: "Fraise avec crème épaisse" },
  "creamy-redbull-peach": { name: "Redbull Crémeux Pêche", desc: "Pêche avec crème épaisse" },

  // ——— Drinks (Mojitos sans alcool)
  "mojito-green": { name: "Mojito Vert", desc: "" },
  "mojito-strawberry": { name: "Mojito Fraise", desc: "" },
  "mojito-passion": { name: "Mojito Passion", desc: "" },
  "mojito-redbull": { name: "Mojito Redbull", desc: "" },
  "mojito-strawberry-bull": { name: "Mojito Bull Fraise", desc: "" },
  "mojito-black": { name: "Mojito Noir", desc: "" },

  // ——— Drinks (Thés glacés)
  "icedtea-peach": { name: "Thé Glacé Pêche", desc: "" },
  "icedtea-lemon": { name: "Thé Glacé Citron", desc: "" },

  // ——— Drinks (Cocktails sans alcool)
  "mocktail-florida": { name: "Florida", desc: "" },
  "mocktail-bora-bora": { name: "Bora Bora", desc: "" },
  "mocktail-pinacolada": { name: "Piñacolada", desc: "" },
  "mocktail-ocean-11": { name: "Ocean 11", desc: "" },

  // ——— Drinks (Jus)
  "juice-orange": { name: "Jus d'Orange", desc: "" },
  "juice-lemon": { name: "Jus de Citron", desc: "" },
  "juice-strawberry": { name: "Jus de Fraise", desc: "" },
  "juice-banana": { name: "Jus de Banane", desc: "" },
  "juice-avocado": { name: "Jus d'Avocat", desc: "" },
  "juice-mango": { name: "Jus de Mangue", desc: "" },
  "juice-pineapple": { name: "Jus d'Ananas", desc: "" },

  // ——— Drinks (Jus pressés)
  "pressed-pineapple": { name: "Jus d'Ananas Pressé", desc: "" },

  // ——— Drinks (Boissons fraîches)
  "drink-water-33cl": { name: "Eau minérale 33 cl", desc: "" },
  "drink-water-50cl": { name: "Eau Minérale 50cl", desc: "" },
  "drink-soda": { name: "Boissons gazeuses", desc: "" },
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
  "hot-capp-italian": { name: "Cappuccino italien", desc: "Avec mousse de lait" },
  "hot-nespresso-creme": { name: "Nespresso crème", desc: "" },
  "hot-nespresso-double": { name: "Nespresso Double", desc: "" },
  "hot-flavored": { name: "Café aromatisé", desc: "Caramel / Noisette / Vanille" },
  "hot-cafe-creme": { name: "Café crème", desc: "" },
  "hot-nescafe-lait": { name: "Nescafé au lait", desc: "" },
  "hot-chocolate": { name: "Chocolat chaud", desc: "" },
  "hot-capp-vanille-noisette": { name: "Cappuccino", desc: "Caramel, noisette, vanille, chantilly" },
  "hot-royal": { name: "Café royal", desc: "" },
  "hot-double": { name: "Café double", desc: "" },
  "hot-choc-chantilly": { name: "Chocolat chantilly", desc: "" },
  "hot-latte-macchiato": { name: "Latte Macchiato", desc: "" },
  "hot-bonbon": { name: "Café Bonbon", desc: "" },

  // ——— Breakfast (Formules)
  "breakfast-formule-espagnole": { name: "Petit-déjeuner Espagnol", desc: "2 œufs, panier de pain, purée de tomate, fromage manchego, huile d'ail, boisson chaude, mini jus d'orange, eau minérale" },
  "breakfast-formule-marocaine": { name: "Petit-déjeuner Marocain", desc: "Harcha, msemen, baghrir, pain de blé, accompagnements (beurre, fromage, miel, amlou), boisson chaude, mini jus d'orange, eau minérale" },

  // ——— Breakfast (Bols)
  "bowl-original-yogurt": { name: "Bol Yaourt Original", desc: "Yaourt avec granola, fruits de saison et miel" },
  "bowl-amlou-yogurt": { name: "Bol Yaourt Amlou", desc: "Yaourt avec granola, amlou, fruits de saison et miel" },
  "bowl-chia-pudding": { name: "Bol Pudding de Chia", desc: "Graines de chia avec granola et fruits de saison" },

  // ——— Breakfast (Tartines)
  "toast-avo-poached": { name: "Tartine Avocat & Œuf Poché", desc: "Avocat, œuf poché, roquette" },
  "toast-burrata": { name: "Tartine Burrata", desc: "Burrata, tomate cerise, glaçage balsamique, noix" },
  "toast-scrambled-egg": { name: "Tartine Œufs Brouillés", desc: "Œufs brouillés" },
  "toast-figtastic": { name: "Tartine Figtastic", desc: "Brie, figue, miel, noix" },
  "toast-salmon": { name: "Tartine Saumon Fumé", desc: "Saumon fumé, fromage à tartiner, roquette, flocons de piment" },

  // ——— Breakfast (Bagels)
  "bagel-classic": { name: "Bagel Classique", desc: "Saumon, fromage à la crème, tomate, oignon, câpre, concombre" },
  "bagel-spicy-bec": { name: "Bagel Spicy BEC", desc: "Bacon, œuf, fromage, chili crisp" },
  "bagel-chili-tuna": { name: "Bagel Chili Thon", desc: "Mousse de thon, avocat, chili crisp, tomate, laitue" },
  "bagel-salmon-avo": { name: "Bagel Saumon Avocat", desc: "Saumon, avocat, roquette, œuf, flocons de piment" },

  // ——— Breakfast (Petits pains briochés)
  "bun-egg": { name: "Pain Brioché Œuf", desc: "Œufs brouillés, cheddar" },
  "bun-avo-herb": { name: "Pain Brioché Avocat & Herbes", desc: "Œufs brouillés, avocat, fromage à tartiner, cheddar" },
  "bun-woods": { name: "Pain Brioché Woods", desc: "Œufs brouillés, cheddar, oignons caramélisés" },

  // ——— Breakfast (Sandwichs)
  "sandwich-tunacado": { name: "Sandwich Tunacado", desc: "Avocat, mousse de thon, pesto, tomate" },
  "sandwich-spicytuna": { name: "Sandwich Spicy Tuna", desc: "Mousse de thon, tomate, jalapeño, tabasco, pesto" },
  "sandwich-mozacado": { name: "Sandwich Mozacado", desc: "Mozzarella, avocat, tomate, pesto" },
  "sandwich-chicken-woods": { name: "Sandwich Chicken Woods", desc: "Poulet grillé, tomate, roquette, sauce maison" },
  "sandwich-chicken-parm": { name: "Sandwich Chicken Parm", desc: "Poulet grillé, aïoli, tomate, parmesan" },
  "sandwich-steak": { name: "Sandwich Steak", desc: "Steak, cornichons, tomate, roquette, parmesan, moutarde au miel" },

  // ——— Breakfast (Œufs)
  "egg-fried-1": { name: "1 Œuf au Plat", desc: "" },
  "egg-fried-2": { name: "2 Œufs au Plat", desc: "" },
  "egg-fried-3": { name: "3 Œufs au Plat", desc: "" },
  "omelette-plain": { name: "Omelette Nature", desc: "Simple et moelleuse" },
  "omelette-cheese": { name: "Omelette au Fromage", desc: "Avec fromage fondu" },
  "omelette-cheese-turkey": { name: "Omelette Fromage & Dinde", desc: "Avec fromage et dinde" },
  "omelette-khlie": { name: "Omelette Khlie", desc: "Bœuf séché marocain traditionnel" },
  "omelette-tuna": { name: "Omelette au Thon", desc: "Avec thon" },
  "omelette-shrimp": { name: "Omelette aux Crevettes", desc: "Avec crevettes sautées" },

  // ——— Breakfast (À la Carte)
  "alacarte-chocolate-bread": { name: "Pain au Chocolat", desc: "Pain au chocolat ou croissant" },
  "alacarte-turnover": { name: "Chausson au Fromage ou aux Amandes", desc: "Pâte feuilletée garnie de fromage ou d'amandes" },
  "alacarte-bread-plate": { name: "Pain de Blé, Harcha, Rghayf", desc: "Avec 2 accompagnements (beurre, fromage, confiture, huile d'olive, amlou, miel)" },
  "alacarte-baghrir": { name: "Baghrir", desc: "Baghrir avec 2 accompagnements" },
  "alacarte-cheese-toast": { name: "Toast au Fromage", desc: "Pain toasté avec fromage fondu" },
  "alacarte-turkey-cheese-toast": { name: "Toast Dinde & Fromage", desc: "Pain toasté avec dinde et fromage" },
  "alacarte-croque-cheese": { name: "Croque Fromage", desc: "Croque classique au fromage" },
  "alacarte-baghrir-amlou": { name: "Baghrir avec Amlou", desc: "Crêpes marocaines à la semoule avec amlou" },
  "alacarte-croque-turkey-cheese": { name: "Croque Dinde & Fromage", desc: "Croque garni de dinde et fromage" },
  "alacarte-khlie-eggs": { name: "Khlie avec 2 Œufs", desc: "Bœuf séché traditionnel servi avec 2 œufs" },

  // ——— Breakfast (Toast Hollandais)
  "toast-amsterdam": { name: "Toast Amsterdam", desc: "Toast style hollandais" },
  "toast-rotterdam": { name: "Toast Rotterdam", desc: "Toast style hollandais" },

  // ——— Breakfast (Formules Enfants)
  "kids-formula-1": { name: "Formule Enfant I", desc: "Baghrir avec amlou, mini pancakes au chocolat, cornflakes, choix de chocolat froid ou lait chaud" },
  "kids-formula-2": { name: "Formule Enfant II", desc: "Pancake au chocolat, cornflakes, choix de chocolat froid ou lait chaud" },

  // ——— Entrées Froides
  "salade-nicoise": { name: "Salade Niçoise", desc: "" },
  "salade-cesar": { name: "Salade César", desc: "" },
  "salade-avocat-crevettes": { name: "Salade d'Avocat et Crevettes", desc: "" },
  "salade-mais": { name: "Salade de Maïs", desc: "" },
  "salade-burrata": { name: "Salade Burrata", desc: "" },

  // ——— Entrées Chaudes
  "soupe-fruits-de-mer": { name: "Soupe aux Fruits de Mer", desc: "" },
  "pilpil-crevettes": { name: "Crevettes Pil Pil", desc: "" },

  // ——— Plats (À Base Poisson)
  "merlan": { name: "Filet de Merlan", desc: "" },
  "crevettes-grillees": { name: "Crevettes Grillées", desc: "" },
  "thon": { name: "Filet de Thon", desc: "" },
  "espadon": { name: "Filet d'Espadon Grillé", desc: "" },
  "saumon-papillote": { name: "Pavé de Saumon", desc: "" },
  "teriyaki-salmon": { name: "Saumon Teriyaki", desc: "" },

  // ——— Plats (À Base Viande & Poulet)
  "emince-poulet": { name: "Poulet Émincé", desc: "" },
  "filet-poulet": { name: "Blanc de Poulet Grillé", desc: "" },
  "teriyaki-chicken": { name: "Poulet Teriyaki", desc: "" },
  "chicken-honey-mustard": { name: "Poulet Miel & Moutarde", desc: "" },
  "mixed-grill": { name: "Mixed Grill", desc: "" },
  "entrecote": { name: "Entrecôte Sauce Verte", desc: "" },
  "filet-boeuf": { name: "Filet de Bœuf", desc: "" },
  "chimichurri-steak": { name: "Steak Chimichurri", desc: "" },

  // ——— Plats Marocains
  "tajine-viande-hachee": { name: "Tajine de Viande Hachée", desc: "" },
  "tajine-pruneaux": { name: "Tajine Viande aux Pruneaux", desc: "" },
  "tajine-coquelet-citron": { name: "Tajine Poulet au Citron Confit", desc: "" },
  "couscous-poulet": { name: "Couscous au Poulet (Vendredi)", desc: "" },
  "couscous-viande": { name: "Couscous à la Viande (Vendredi)", desc: "" },

  // ——— Apéritifs / Sides
  "shrimp-croquettes": { name: "Croquettes de Crevettes", desc: "" },
  "mozza-sticks-4": { name: "Bâtonnets de Mozzarella (4 pcs)", desc: "" },
  "mozza-sticks-6": { name: "Bâtonnets de Mozzarella (6 pcs)", desc: "" },
  "mozza-sticks-9": { name: "Bâtonnets de Mozzarella (9 pcs)", desc: "" },
  "calamari": { name: "Calamars", desc: "" },
  "truffle-fries": { name: "Frites à la Truffe", desc: "" },
  "sweet-potato-fries": { name: "Frites de Patate Douce", desc: "" },
  "tortilla-side": { name: "Tortilla", desc: "" },

  // ——— Tex Mex
  "nuggets-4": { name: "Nuggets de Poulet (4 pcs)", desc: "" },
  "nuggets-6": { name: "Nuggets de Poulet (6 pcs)", desc: "" },
  "nuggets-9": { name: "Nuggets de Poulet (9 pcs)", desc: "" },
  "drumsticks-4": { name: "Cuisses de Poulet (4 pcs)", desc: "" },
  "drumsticks-6": { name: "Cuisses de Poulet (6 pcs)", desc: "" },
  "jalapenos-bites-4": { name: "Bouchées Jalapeños (4 pcs)", desc: "" },
  "jalapenos-bites-6": { name: "Bouchées Jalapeños (6 pcs)", desc: "" },
  "jalapenos-bites-9": { name: "Bouchées Jalapeños (9 pcs)", desc: "" },

  // ——— Pastas
  "pasta-carbonara": { name: "Pasta alla Carbonara", desc: "Dinde fumée, sauce carbonara, parmesan" },
  "pasta-bolognaise": { name: "Pasta alla Bolognaise", desc: "Sauce bolognaise, basilic, parmesan" },
  "pasta-tuscan-chicken": { name: "Pasta Poulet Toscan", desc: "Poulet toscan grillé à la sauce tomate crémeuse et parmesan" },
  "pasta-truffle": { name: "Pasta à la Truffe", desc: "Crème de truffe au parmesan et poivre noir" },
  "pasta-frutti-di-mare": { name: "Pasta Frutti di Mare", desc: "Fruits de mer à la sauce crémeuse" },
  "pasta-arrabiata": { name: "Pasta Arrabbiata Burrata", desc: "Sauce tomate épicée à la burrata" },
  "linguine-scampi": { name: "Linguine alla Scampi", desc: "Sauce piquante maison" },
  "lasagnes-bolognaise": { name: "Lasagnes alla Bolognaise", desc: "" },

  // ——— Risotto
  "risotto-4formaggi": { name: "Risotto Quattro Formaggi", desc: "Tomates, mozzarella, edam, roquefort, parmesan" },
  "risotto-fruits-mer": { name: "Risotto Fruits de Mer", desc: "Fruits de mer à la sauce crémeuse" },
  "risotto-pollo": { name: "Risotto Pollo", desc: "Risotto crémeux au poulet grillé épicé" },
  "risotto-truffle": { name: "Risotto à la Truffe", desc: "Crème de truffe au parmesan et poivre noir" },

  // ——— Pizzas
  "pz-margherita": { name: "Margherita", desc: "Tomate, mozzarella, olives noires" },
  "pz-primavera": { name: "Primavera", desc: "Tomate, mozzarella, aubergine, courgette, champignons, poivron, oignon, tomates cerises" },
  "pz-pollo-piccante": { name: "Pollo Piccante", desc: "Sauce blanche, mozzarella, poulet, oignon, poivron vert" },
  "pz-tonno": { name: "Al Tonno", desc: "Tomate, mozzarella, thon, oignons, poivrons, olives noires" },
  "pz-local-honey": { name: "Pizza Miel Local", desc: "Fromage ricotta, noix concassées, miel" },
  "pz-truffle": { name: "Pizza Truffe", desc: "Burrata, mozzarella, champignons, truffe" },
  "pz-bolognaise": { name: "Bolognaise", desc: "Tomate, mozzarella, viande hachée, olives noires" },
  "pz-frutti": { name: "Frutti di Mare", desc: "Tomate, mozzarella, calamar, crevettes, surimi, moules, olives noires" },
  "pz-4formaggi": { name: "Quattro Formaggi", desc: "Tomate, mozzarella, edam, roquefort, parmesan" },
  "pz-diavola": { name: "Diavola", desc: "Tomate, mozzarella, pepperoni, olives noires" },
  "pz-pastrami": { name: "Pastrami", desc: "Tomate, mozzarella, pastrami, roquette, parmesan" },
  "pz-short-ribs": { name: "Short Ribs", desc: "Sauce BBQ, mozzarella, short rib, parmesan" },

  // ——— Burgers
  "burger-chicken": { name: "Burger Poulet", desc: "Steak de poulet, cheddar" },
  "burger-cheese": { name: "Cheeseburger", desc: "Viande hachée, salade verte, tomate" },
  "burger-double-cheese": { name: "Double Cheeseburger", desc: "Double viande hachée, double cheddar" },
  "burger-american": { name: "Burger Américain", desc: "Viande hachée, œuf, cheddar" },

  // ——— Crêpes Salées
  "crepe-fromage": { name: "Crêpe au Fromage", desc: "Fromage, sauce béchamel" },
  "crepe-dinde-fromage": { name: "Crêpe Dinde & Fromage", desc: "Dinde fumée, fromage, œuf, sauce béchamel" },
  "crepe-poulet-champignons": { name: "Crêpe Poulet", desc: "Poulet, fromage, sauce béchamel" },
  "crepe-viande-hachee": { name: "Crêpe Viande Hachée", desc: "Viande hachée, fromage, origan, sauce tomate" },
  "crepe-mixte": { name: "Crêpe Mixte", desc: "Viande hachée, poulet, dinde fumée, fromage, béchamel" },

  // ——— Tacos
  "tacos-poulet": { name: "Tacos au Poulet", desc: "" },
  "tacos-viande": { name: "Tacos Viande Hachée", desc: "" },

  // ——— Panini
  "panini-chicken": { name: "Panini Poulet", desc: "Panini au poulet" },
  "panini-minced-meat": { name: "Panini Viande Hachée", desc: "Panini à la viande hachée" },

  // ——— Crêpes & Gaufres Sucrées
  "sweet-crepe-simple": { name: "Crêpe / Gaufre Sucrée", desc: "" },
  "sweet-crepe-miel": { name: "Crêpe / Gaufre au Miel", desc: "" },
  "sweet-crepe-caramel": { name: "Crêpe / Gaufre au Caramel", desc: "" },
  "sweet-crepe-amlou": { name: "Crêpe / Gaufre à l'Amlou", desc: "" },
  "sweet-crepe-choco": { name: "Crêpe / Gaufre au Chocolat", desc: "" },
  "sweet-crepe-choco-banane": { name: "Crêpe / Gaufre Chocolat Banane", desc: "" },
  "sweet-crepe-choco-blanc": { name: "Crêpe / Gaufre Chocolat Blanc", desc: "" },
  "sweet-crepe-nutella": { name: "Crêpe / Gaufre au Nutella", desc: "" },
  "sweet-crepe-black-white": { name: "Crêpe / Gaufre Black & White", desc: "" },
  "sweet-crepe-nutella-noix": { name: "Crêpe / Gaufre Nutella-Noix", desc: "" },
  "sweet-crepe-nutella-banane": { name: "Crêpe / Gaufre Nutella-Banane", desc: "" },
  "sweet-crepe-mix": { name: "Crêpe / Gaufre Oreo / Kinder / Lotus", desc: "" },
  "sweet-crepe-woods": { name: "Crêpe / Gaufre Woods", desc: "Nutella, noix, boule de glace" },
  "sweet-crepe-dubai": { name: "Crêpe / Gaufre Dubaï", desc: "" },

  // ——— Pancakes
  "pancake-simple": { name: "Pancake", desc: "" },
  "pancake-miel": { name: "Pancake au Miel", desc: "" },
  "pancake-caramel": { name: "Pancake au Caramel", desc: "" },
  "pancake-amlou": { name: "Pancake à l'Amlou", desc: "" },
  "pancake-choco": { name: "Pancake au Chocolat", desc: "" },
  "pancake-choco-banane": { name: "Pancake Chocolat Banane", desc: "" },
  "pancake-choco-blanc": { name: "Pancake Chocolat Blanc", desc: "" },
  "pancake-nutella": { name: "Pancake au Nutella", desc: "" },
  "pancake-black-white": { name: "Pancake Black & White", desc: "" },
  "pancake-nutella-noix": { name: "Pancake Nutella-Noix", desc: "" },
  "pancake-nutella-banane": { name: "Pancake Nutella-Banane", desc: "" },
  "pancake-mix": { name: "Pancake Oreo / Kinder / Lotus", desc: "" },
  "pancake-woods": { name: "Pancake Woods", desc: "Nutella, noix, boule de glace" },
  "pancake-dubai": { name: "Pancake Dubaï", desc: "" },

  // ——— Desserts
  "dess-patisserie": { name: "Pâtisserie", desc: "" },
  "dess-fruit-salad-1": { name: "Salade de Fruits (1 personne)", desc: "" },
  "dess-fruit-salad-2": { name: "Salade de Fruits (2 personnes)", desc: "" },
  "dess-fondant": { name: "Fondant au Chocolat", desc: "Avec une boule de glace" },

  // ——— Tartes (Slice of Tart)
  "dess-tart-red-velvet": { name: "Red Velvet", desc: "" },
  "dess-tart-lotus": { name: "Lotus", desc: "" },
  "dess-tart-chocolate": { name: "Chocolat", desc: "" },
  "dess-tart-cheesecake-wc": { name: "Cheesecake Chocolat Blanc Framboise", desc: "" },
  "dess-tart-cheesecake-pistachio": { name: "Cheesecake Pistache", desc: "" },
  "dess-tart-cheesecake-classic": { name: "Cheesecake Classique", desc: "" },
  "dess-tart-walnut": { name: "Tarte aux Noix", desc: "" },
  "dess-tart-almond": { name: "Tarte aux Amandes", desc: "" },
  "dess-tart-tiramisu": { name: "Tiramisu", desc: "" },

  // ——— Frappuccino & Freakshake
  "frappuccino": { name: "Frappuccino", desc: "Chocolat / Caramel / Vanille / Noisette" },
  "milkshake": { name: "Milkshake / Orange Shake", desc: "" },
  "freakshake": { name: "Freakshake", desc: "Oreo, Nutella, chocolat, caramel ou cookies" },

  // ——— Coupes glacées
  "coupe-fruit-rouge": { name: "Coupe Fruit Rouge", desc: "1 boule de fraise, 2 boules de cerise, chantilly" },
  "coupe-rocher": { name: "Coupe Rocher", desc: "2 boules Ferrero Rocher, chantilly" },
  "coupe-kitkat": { name: "Coupe Kit-Kat", desc: "2 boules Kit-Kat, chantilly" },
  "coupe-banana-split": { name: "Banana Split", desc: "Vanille, chocolat, fraise, rondelles de banane, chantilly" },
  "coupe-fraise-melba": { name: "Coupe Fraise Melba", desc: "2 boules de fraise, vanille, chantilly, fraises" },
  "coupe-caraibes": { name: "Coupe Caraïbes", desc: "Solero, fraise, citron, chantilly" },
  "coupe-caramelo": { name: "Coupe Caramelo", desc: "2 boules de caramel, spéculoos, chantilly" },
  "coupe-bisutto": { name: "Coupe Bisutto", desc: "Spéculoos, Oreo, cookies, chantilly" },
  "coupe-negrisco": { name: "Coupe Negrisco", desc: "Chocolat, noisette, pistache, chantilly" },
  "coupe-exotique": { name: "Coupe Exotique", desc: "Ananas, Solero, citron, fraise, fruits, chantilly" },
  "coupe-woods": { name: "Coupe Woods", desc: "Assortiment de boules de glace avec chantilly" },

  // ——— Composez votre glace
  "ice-chantilly": { name: "Crème Chantilly", desc: "" },
  "ice-2-boules": { name: "2 Boules de Glace", desc: "" },
  "ice-3-boules": { name: "3 Boules de Glace", desc: "" },
  "ice-4-boules": { name: "4 Boules de Glace", desc: "" },
};

/** ENGLISH culinary translations */
const ITEMS_EN: ItemsTextPack = {
  // ——— Drinks (Matcha)
  "matcha-latte": { name: "Matcha Latte", desc: "Matcha with Milk (Hot/Iced)" },
  "matcha-coco": { name: "Matcha Coco Water", desc: "Matcha with Coconut Water" },
  "matcha-pink-foam": { name: "Pink Foam Matcha", desc: "Matcha Topped with Strawberry Foam" },
  "matcha-fraise": { name: "Strawberry Matcha", desc: "Matcha with Strawberry Purée" },
  "matcha-mangue": { name: "Mango Matcha", desc: "Matcha with Mango Purée" },
  "matcha-ube": { name: "Ube Matcha", desc: "Matcha with Ube" },
  "matcha-blue": { name: "Blue Matcha", desc: "Blue Matcha" },
  "milk-options": { name: "Milk Options", desc: "Oats or Coconut Milk" },

  // ——— Drinks (Coffee & Specialties)
  "coffee-coco-latte": { name: "Coco Latte", desc: "Coconut water with coffee foam" },
  "coffee-creme-brulee-latte": { name: "Crème Brûlée Latte", desc: "Iced coffee topped with crème brûlée" },
  "coffee-spanish-latte": { name: "Spanish Latte", desc: "Condensed milk with espresso shot" },
  "coffee-ube-latte": { name: "Ube Latte", desc: "Latte with Ube" },
  "coffee-pistachio-latte": { name: "Pistachio Latte", desc: "Smooth latte with a nutty pistachio flavor" },
  "coffee-tiramisu-latte": { name: "Tiramisu Latte", desc: "Coffee latte inspired by the classic dessert" },
  "coffee-chai-latte": { name: "Chai Latte", desc: "Spiced black tea with warm milk" },
  "milk-options1": { name: "Milk Options", desc: "Oats or Coconut Milk" },

  // ——— Drinks (Refreshers)
  "refresher-hibiscus": { name: "Hibiscus", desc: "House-brewed hibiscus" },
  "refresher-hibiscus-peche": { name: "Hibiscus Peach", desc: "Hibiscus tea with a peachy finish" },
  "refresher-tropical-ginger": { name: "Tropical Ginger", desc: "Mango and ginger in a spicy fusion" },
  "refresher-watermelon-fizz": { name: "Watermelon Fizz", desc: "Watermelon blended with fizzy soda" },

  // ——— Drinks (Smoothies)
  "smoothie-multivitamine": { name: "Multivitamine", desc: "Orange pineapple kiwi and mango" },
  "smoothie-california-dream": { name: "California Dream", desc: "Orange strawberry banana kiwi and yoghurt" },
  "smoothie-jack-special": { name: "Jack Special", desc: "Strawberry pineapple and lemon" },
  "smoothie-coco-mango": { name: "Coco Mango", desc: "Mango banana and coconut milk" },
  "smoothie-golden-smooth": { name: "Golden Smooth", desc: "Banana, mango, pineapple, vanilla milk" },
  "smoothie-coco-blush": { name: "Coco Blush", desc: "Strawberry, mango, yogurt, banana, coconut milk" },

  // ——— Drinks (Pressed / Health Juices)
  "balance-debloat": { name: "Balance + Debloat", desc: "Pineapple, lemon, ginger" },
  "iron-charge": { name: "Iron + Charge", desc: "Spinach, lemon, celery" },
  "hydrate-pulse": { name: "Hydrate + Pulse", desc: "Pineapple, lemon, cucumber, ice" },
  "green-clean": { name: "Green Clean", desc: "Spinach, lemon, celery, cucumber, apple" },
  "berry-mood": { name: "Berry Mood", desc: "Strawberry, blueberry, raspberry, apple, banana, lemon" },
  "stress-down": { name: "Stress Down", desc: "Strawberry, ginger, apple, ice" },
  "tropical-boost": { name: "Tropical Boost", desc: "Pineapple, passion fruit syrup, apple, ice" },
  "feel-good": { name: "Feel Good", desc: "Carrot, turmeric, ginger, lemon, apple, ice" },
  "berry-breeze": { name: "Berry Breeze", desc: "Strawberry, lemon, mint, apple" },

  // ——— Drinks (Creamy Red Bull)
  "creamy-redbull-blueberry": { name: "Blueberry Creamy Redbull", desc: "Blueberry coco with heavy cream" },
  "creamy-redbull-strawberry": { name: "Strawberry Creamy Redbull", desc: "Strawberry with heavy cream" },
  "creamy-redbull-peach": { name: "Peach Creamy Redbull", desc: "Peach with heavy cream" },

  // ——— Drinks (Mojitos – Non-Alcoholic)
  "mojito-green": { name: "Green Mojito", desc: "" },
  "mojito-strawberry": { name: "Strawberry Mojito", desc: "" },
  "mojito-passion": { name: "Passion Fruit Mojito", desc: "" },
  "mojito-redbull": { name: "Redbull Mojito", desc: "" },
  "mojito-strawberry-bull": { name: "Strawberry Bull Mojito", desc: "" },
  "mojito-black": { name: "Black Mojito", desc: "" },

  // ——— Drinks (Iced Teas)
  "icedtea-peach": { name: "Peach Iced Tea", desc: "" },
  "icedtea-lemon": { name: "Lemon Iced Tea", desc: "" },

  // ——— Drinks (Mocktails – Non-Alcoholic Cocktails)
  "mocktail-florida": { name: "Florida", desc: "" },
  "mocktail-bora-bora": { name: "Bora Bora", desc: "" },
  "mocktail-pinacolada": { name: "Piña Colada", desc: "" },
  "mocktail-ocean-11": { name: "Ocean 11", desc: "" },

  // ——— Drinks (Juices)
  "juice-orange": { name: "Orange Juice", desc: "" },
  "juice-lemon": { name: "Lemon Juice", desc: "" },
  "juice-strawberry": { name: "Strawberry Juice", desc: "" },
  "juice-banana": { name: "Banana Juice", desc: "" },
  "juice-avocado": { name: "Avocado Juice", desc: "" },
  "juice-mango": { name: "Mango Juice", desc: "" },
  "juice-pineapple": { name: "Pineapple Juice", desc: "" },

  // ——— Drinks (Pressed Juices)
  "pressed-pineapple": { name: "Pressed Pineapple", desc: "" },

  // ——— Drinks (Cold Drinks)
  "drink-water-33cl": { name: "Mineral Water 33cl", desc: "" },
  "drink-water-50cl": { name: "Mineral Water 50cl", desc: "" },
  "drink-soda": { name: "Soft Drinks", desc: "" },
  "drink-beer-na": { name: "Non-Alcoholic Beer", desc: "" },
  "drink-redbull": { name: "Red Bull", desc: "" },

  // ——— Drinks (Teas)
  "tea-mint": { name: "Mint Tea", desc: "" },
  "tea-american": { name: "American Tea", desc: "" },
  "tea-infusion": { name: "Herbal Infusion", desc: "" },
  "tea-black": { name: "Black Tea", desc: "" },
  "tea-special": { name: "Special Tea", desc: "" },
  "tea-black-special": { name: "Black Special Tea", desc: "" },

  // ——— Drinks (Hot Drinks)
  "hot-espresso": { name: "Espresso", desc: "" },
  "hot-americano": { name: "Americano", desc: "" },
  "hot-milk": { name: "Hot Milk", desc: "" },
  "hot-nespresso": { name: "Nespresso", desc: "" },
  "hot-capp-italian": { name: "Italian Cappuccino", desc: "With frothed milk" },
  "hot-nespresso-creme": { name: "Nespresso Crème", desc: "" },
  "hot-nespresso-double": { name: "Nespresso Double", desc: "" },
  "hot-flavored": { name: "Flavored Coffee", desc: "Caramel / Hazelnut / Vanilla" },
  "hot-cafe-creme": { name: "Café Crème", desc: "" },
  "hot-nescafe-lait": { name: "Nescafé with Milk", desc: "" },
  "hot-chocolate": { name: "Hot Chocolate", desc: "" },
  "hot-capp-vanille-noisette": { name: "Cappuccino", desc: "Caramel, hazelnut, vanilla, whipped cream" },
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
  "toast-scrambled-egg": { name: "Scrambled Egg Toast", desc: "Scrambled eggs" },
  "toast-figtastic": { name: "Figtastic Toast", desc: "Brie, figs, honey, walnuts" },
  "toast-salmon": { name: "Smoked Salmon Toast", desc: "Smoked salmon, cream cheese, arugula, chili flakes" },

  // ——— Bagels
  "bagel-classic": { name: "The Classic Bagel", desc: "Salmon, cream cheese, tomato, onion, caper, cucumber" },
  "bagel-spicy-bec": { name: "The Spicy BEC", desc: "Bacon, egg, cheese, chili crisp" },
  "bagel-chili-tuna": { name: "The Chili Tuna", desc: "Tuna mousse, avocado, chili crisp, tomato, lettuce" },
  "bagel-salmon-avo": { name: "The Salmon Avo", desc: "Salmon, avocado, arugula, egg, chili flakes" },

  // ——— Brioche Buns
  "bun-egg": { name: "Egg Brioche Bun", desc: "Scrambled eggs, cheddar cheese" },
  "bun-avo-herb": { name: "Avocado & Herb Brioche Bun", desc: "Scrambled eggs, avocado, cream cheese, cheddar" },
  "bun-woods": { name: "Woods Brioche Bun", desc: "Scrambled eggs, cheddar, caramelized onions" },

  // ——— Sandwiches
  "sandwich-tunacado": { name: "Tunacado", desc: "Avocado, tuna mousse, pesto, tomato" },
  "sandwich-spicytuna": { name: "Spicy Tuna", desc: "Tuna mousse, tomato, jalapeño, tabasco, pesto" },
  "sandwich-mozacado": { name: "Mozacado", desc: "Mozzarella, avocado, tomato, pesto" },
  "sandwich-chicken-woods": { name: "Chicken Woods", desc: "Grilled chicken, tomato, arugula, house sauce" },
  "sandwich-chicken-parm": { name: "Chicken Parm", desc: "Grilled chicken, tomato, aioli, parmesan" },
  "sandwich-steak": { name: "Steak Sandwich", desc: "Steak, pickles, tomato, arugula, parmesan, honey mustard" },

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
  "alacarte-bread-plate": { name: "Wheat Bread, Harcha, Rghayf", desc: "With 2 accompaniments (butter, cheese, jam, olive oil, amlou, honey)" },
  "alacarte-baghrir": { name: "Baghrir", desc: "Baghrir with 2 accompaniments" },
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
  "salade-nicoise": { name: "Niçoise Salad", desc: "" },
  "salade-cesar": { name: "Caesar Salad", desc: "" },
  "salade-avocat-crevettes": { name: "Avocado & Shrimp Salad", desc: "" },
  "salade-mais": { name: "Corn Salad", desc: "" },
  "salade-burrata": { name: "Burrata Salad", desc: "" },

  // ——— Starters (Hot)
  "soupe-fruits-de-mer": { name: "Seafood Soup", desc: "" },
  "pilpil-crevettes": { name: "Shrimp Pil Pil", desc: "" },

  // ——— Mains: Fish
  "merlan": { name: "Whiting Fillet", desc: "" },
  "crevettes-grillees": { name: "Grilled Shrimp", desc: "" },
  "thon": { name: "Tuna Fillet", desc: "" },
  "espadon": { name: "Grilled Swordfish Fillet", desc: "" },
  "saumon-papillote": { name: "Salmon Steak", desc: "" },
  "teriyaki-salmon": { name: "Teriyaki Salmon", desc: "" },

  // ——— Mains: Meat & Poultry
  "emince-poulet": { name: "Sliced Chicken", desc: "" },
  "filet-poulet": { name: "Grilled Chicken Breast", desc: "" },
  "teriyaki-chicken": { name: "Teriyaki Chicken", desc: "" },
  "chicken-honey-mustard": { name: "Chicken with Honey Mustard", desc: "" },
  "mixed-grill": { name: "Mixed Grill", desc: "" },
  "entrecote": { name: "Entrecôte Green Sauce", desc: "" },
  "filet-boeuf": { name: "Beef Tenderloin", desc: "" },
  "chimichurri-steak": { name: "Chimichurri Steak", desc: "" },

  // ——— Moroccan Dishes
  "tajine-viande-hachee": { name: "Minced Meat Tagine", desc: "" },
  "tajine-pruneaux": { name: "Prune and Meat Tagine", desc: "" },
  "tajine-coquelet-citron": { name: "Preserved Lemon & Chicken Tagine", desc: "" },
  "couscous-poulet": { name: "Chicken Couscous (Friday)", desc: "" },
  "couscous-viande": { name: "Meat Couscous (Friday)", desc: "" },

  // ——— Aperitifs / Sides
  "shrimp-croquettes": { name: "Shrimp Croquettes", desc: "" },
  "mozza-sticks-4": { name: "Mozzarella Sticks (4 pcs)", desc: "" },
  "mozza-sticks-6": { name: "Mozzarella Sticks (6 pcs)", desc: "" },
  "mozza-sticks-9": { name: "Mozzarella Sticks (9 pcs)", desc: "" },
  "calamari": { name: "Calamari", desc: "" },
  "truffle-fries": { name: "Truffle Fries", desc: "" },
  "sweet-potato-fries": { name: "Sweet Potato Fries", desc: "" },
  "tortilla-side": { name: "Tortilla", desc: "" },

  // ——— Tex-Mex
  "nuggets-4": { name: "Chicken Nuggets (4 pcs)", desc: "" },
  "nuggets-6": { name: "Chicken Nuggets (6 pcs)", desc: "" },
  "nuggets-9": { name: "Chicken Nuggets (9 pcs)", desc: "" },
  "drumsticks-4": { name: "Chicken Drumsticks (4 pcs)", desc: "" },
  "drumsticks-6": { name: "Chicken Drumsticks (6 pcs)", desc: "" },
  "jalapenos-bites-4": { name: "Jalapeño Bites (4 pcs)", desc: "" },
  "jalapenos-bites-6": { name: "Jalapeño Bites (6 pcs)", desc: "" },
  "jalapenos-bites-9": { name: "Jalapeño Bites (9 pcs)", desc: "" },

  // ——— Pastas
  "pasta-carbonara": { name: "Pasta alla Carbonara", desc: "Smoked turkey, carbonara sauce, parmesan" },
  "pasta-bolognaise": { name: "Pasta alla Bolognaise", desc: "Bolognese sauce, basil, parmesan" },
  "pasta-tuscan-chicken": { name: "Pasta Tuscan Chicken", desc: "Grilled tuscan chicken with creamy tomato sauce and parmesan" },
  "pasta-truffle": { name: "Pasta Truffle", desc: "Truffle cream with parmesan and black pepper" },
  "pasta-frutti-di-mare": { name: "Pasta Frutti di Mare", desc: "Seafood with a creamy sauce" },
  "pasta-arrabiata": { name: "Pasta Arrabbiata Burrata", desc: "Spicy tomato sauce with burrata cheese" },
  "linguine-scampi": { name: "Linguine alla Scampi", desc: "Homemade spicy sauce" },
  "lasagnes-bolognaise": { name: "Lasagne alla Bolognaise", desc: "" },

  // ——— Risotto
  "risotto-4formaggi": { name: "Risotto Quattro Formaggi", desc: "Tomatoes, mozzarella, edam, roquefort, parmesan" },
  "risotto-fruits-mer": { name: "Seafood Risotto", desc: "Seafood with a creamy sauce" },
  "risotto-pollo": { name: "Chicken Risotto", desc: "Creamy risotto with grilled spicy chicken" },
  "risotto-truffle": { name: "Truffle Risotto", desc: "Truffle cream with parmesan and black pepper" },

  // ——— Pizzas
  "pz-margherita": { name: "Margherita", desc: "Tomatoes, mozzarella, black olives" },
  "pz-primavera": { name: "Primavera", desc: "Tomatoes, mozzarella, eggplant, zucchini, mushrooms, bell pepper, onion, cherry tomatoes" },
  "pz-pollo-piccante": { name: "Pollo Piccante", desc: "White sauce, mozzarella, chicken, onion, green pepper" },
  "pz-tonno": { name: "Al Tonno", desc: "Tomatoes, mozzarella, tuna, onions, bell peppers, black olives" },
  "pz-local-honey": { name: "Local Honey Pizza", desc: "Ricotta cheese, grated walnuts, honey" },
  "pz-truffle": { name: "Truffle Pizza", desc: "Burrata, mozzarella, mushroom, truffle" },
  "pz-bolognaise": { name: "Bolognaise", desc: "Tomatoes, mozzarella, minced meat, black olives" },
  "pz-frutti": { name: "Frutti di Mare", desc: "Tomatoes, mozzarella, squid, shrimp, surimi, mussels, black olives" },
  "pz-4formaggi": { name: "Quattro Formaggi", desc: "Tomatoes, mozzarella, edam, roquefort, parmesan" },
  "pz-diavola": { name: "Diavola", desc: "Tomatoes, mozzarella, pepperoni, black olives" },
  "pz-pastrami": { name: "Pastrami", desc: "Tomatoes, mozzarella, pastrami, arugula, parmesan" },
  "pz-short-ribs": { name: "Short Ribs", desc: "BBQ sauce, mozzarella, short rib, parmesan" },

  // ——— Burgers
  "burger-chicken": { name: "Chicken Burger", desc: "Chicken steak, cheddar" },
  "burger-cheese": { name: "Cheeseburger", desc: "Minced meat, green salad, tomato" },
  "burger-double-cheese": { name: "Double Cheeseburger", desc: "Double minced meat, double cheddar" },
  "burger-american": { name: "American Burger", desc: "Minced meat, egg, cheddar" },

  // ——— Savory Crêpes
  "crepe-fromage": { name: "Cheese Crêpe", desc: "Cheese, béchamel sauce" },
  "crepe-dinde-fromage": { name: "Turkey & Cheese Crêpe", desc: "Smoked turkey, cheese, egg, béchamel sauce" },
  "crepe-poulet-champignons": { name: "Chicken Crêpe", desc: "Chicken, cheese, béchamel sauce" },
  "crepe-viande-hachee": { name: "Minced Meat Crêpe", desc: "Minced meat, cheese, oregano, tomato sauce" },
  "crepe-mixte": { name: "Mixed Crêpe", desc: "Minced meat, chicken, smoked turkey, cheese, béchamel" },

  // ——— Tacos
  "tacos-poulet": { name: "Chicken Tacos", desc: "" },
  "tacos-viande": { name: "Minced Meat Tacos", desc: "" },

  // ——— Panini
  "panini-chicken": { name: "Chicken Panini", desc: "" },
  "panini-minced-meat": { name: "Minced Meat Panini", desc: "" },

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
  "sweet-crepe-mix": { name: "Oreo / Kinder / Lotus / KitKat Crêpe", desc: "" },
  "sweet-crepe-woods": { name: "Woods Crêpe", desc: "Nutella, walnuts, scoop of ice cream" },
  "sweet-crepe-dubai": { name: "Dubai Crêpe / Waffle", desc: "" },

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
  "pancake-mix": { name: "Oreo / Kinder / Lotus / KitKat Pancake", desc: "" },
  "pancake-woods": { name: "Woods Pancake", desc: "Nutella, walnuts, scoop of ice cream" },
  "pancake-dubai": { name: "Dubai Pancake", desc: "" },

  // ——— Desserts
  "dess-patisserie": { name: "Pastry", desc: "" },
  "dess-fruit-salad-1": { name: "Fruit Salad (1 person)", desc: "" },
  "dess-fruit-salad-2": { name: "Fruit Salad (2 people)", desc: "" },
  "dess-fondant": { name: "Chocolate Fondant", desc: "With a scoop of ice cream" },

  // ——— Tartes (Slice of Tart)
  "dess-tart-red-velvet": { name: "Red Velvet", desc: "" },
  "dess-tart-lotus": { name: "Lotus", desc: "" },
  "dess-tart-chocolate": { name: "Chocolate", desc: "" },
  "dess-tart-cheesecake-wc": { name: "White Chocolate Raspberry Cheesecake", desc: "" },
  "dess-tart-cheesecake-pistachio": { name: "Pistachio Cheesecake", desc: "" },
  "dess-tart-cheesecake-classic": { name: "Classic Cheesecake", desc: "" },
  "dess-tart-walnut": { name: "Walnut Tart", desc: "" },
  "dess-tart-almond": { name: "Almond Tart", desc: "" },
  "dess-tart-tiramisu": { name: "Tiramisu", desc: "" },

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
  "ice-tarte": { name: "Ice Cream Tart", desc: "" }
};

/** DUTCH culinary translations — rewritten for natural modern café Dutch */
const ITEMS_NL: ItemsTextPack = {
  // ——— Dranken (Matcha)
  "matcha-latte": { name: "Matcha Latte / IJs", desc: "Matcha met melk (warm/koud)" },
  "matcha-coco": { name: "Coco Matcha", desc: "Kokoswater met matcha foam" },
  "matcha-pink-foam": { name: "Matcha Pink Foam", desc: "Matcha met aardbei foam" },
  "matcha-fraise": { name: "Matcha Aardbei", desc: "Matcha met aardbeipuree" },
  "matcha-mangue": { name: "Matcha Mango", desc: "Matcha met mangopuree" },
  "matcha-ube": { name: "Matcha Ube", desc: "Matcha met ube" },
  "matcha-blue": { name: "Blue Matcha", desc: "Blauwe matcha" },
  "milk-options": { name: "Melkopties", desc: "Haver- of kokosmelk" },

  // ——— Koffie & Specialiteiten
  "coffee-coco-latte": { name: "Coco Latte", desc: "Kokoswater met koffieschuim" },
  "coffee-creme-brulee-latte": { name: "Crème Brûlée Latte", desc: "IJskoffie met crème brûlée" },
  "coffee-spanish-latte": { name: "Spanish Latte", desc: "Gecondenseerde melk met espresso shot" },
  "coffee-ube-latte": { name: "Ube Latte", desc: "Latte met ube" },
  "coffee-pistachio-latte": { name: "Pistache Latte", desc: "Romige latte met pistachesmaak" },
  "coffee-tiramisu-latte": { name: "Tiramisu Latte", desc: "Koffielatte geïnspireerd op de klassieke tiramisu" },
  "coffee-chai-latte": { name: "Chai Latte", desc: "Gekruide zwarte thee met warme melk" },
  "milk-options1": { name: "Melkopties", desc: "Haver- of kokosmelk" },
  
  // ——— Verfrissend
  "refresher-hibiscus": { name: "Hibiscus", desc: "Huisgebrouwen hibiscus" },
  "refresher-hibiscus-peche": { name: "Hibiscus Perzik", desc: "Hibiscusthee met perzik" },
  "refresher-tropical-ginger": { name: "Tropical Ginger", desc: "Mango en gember in een pittige mix" },
  "refresher-watermelon-fizz": { name: "Watermelon Fizz", desc: "Watermeloen met bruisende frisdrank" },

  // ——— Smoothies
  "smoothie-multivitamine": { name: "Multivitamine", desc: "Sinaasappel, ananas, kiwi, mango" },
  "smoothie-california-dream": { name: "California Dream", desc: "Sinaasappel, aardbei, banaan, kiwi, yoghurt" },
  "smoothie-jack-special": { name: "Jack's Special", desc: "Aardbei, ananas, citroen" },
  "smoothie-coco-mango": { name: "Coco Mango", desc: "Mango, banaan, kokosmelk" },
  "smoothie-golden-smooth": { name: "Golden Smooth", desc: "Banaan, mango, ananas, vanillemelk" },
  "smoothie-coco-blush": { name: "Coco Blush", desc: "Aardbei, mango, yoghurt, banaan, kokosmelk" },

  // ——— Geperste sappen / Gezonde dranken
  "balance-debloat": { name: "Balance + Debloat", desc: "Ananas, citroen, gember" },
  "iron-charge": { name: "Iron + Charge", desc: "Spinazie, citroen, selderij" },
  "hydrate-pulse": { name: "Hydrate + Pulse", desc: "Ananas, citroen, komkommer, ijs" },
  "green-clean": { name: "Green Clean", desc: "Spinazie, citroen, selderij, komkommer, appel" },
  "berry-mood": { name: "Berry Mood", desc: "Aardbei, bosbes, framboos, appel, banaan, citroen" },
  "stress-down": { name: "Stress Down", desc: "Aardbei, gember, appel, ijs" },
  "tropical-boost": { name: "Tropical Boost", desc: "Ananas, passievrucht siroop, appel, ijs" },
  "feel-good": { name: "Feel Good", desc: "Wortel, kurkuma, gember, citroen, appel, ijs" },
  "berry-breeze": { name: "Berry Breeze", desc: "Aardbei, citroen, munt, appel" },

  // ——— Romige Red Bull
  "creamy-redbull-blueberry": { name: "Creamy Blueberry", desc: "Bosbes en kokos met slagroom" },
  "creamy-redbull-strawberry": { name: "Creamy Strawberry", desc: "Aardbei met slagroom" },
  "creamy-redbull-peach": { name: "Creamy Peach", desc: "Perzik met slagroom" },

  // ——— Mojito's (zonder alcohol)
  "mojito-green": { name: "Green Mojito", desc: "" },
  "mojito-strawberry": { name: "Strawberry Mojito", desc: "" },
  "mojito-passion": { name: "Passion Mojito", desc: "" },
  "mojito-redbull": { name: "Red Bull Mojito", desc: "" },
  "mojito-strawberry-bull": { name: "Strawberry Red Bull Mojito", desc: "" },
  "mojito-black": { name: "Black Mojito", desc: "" },

  // ——— IJsthee
  "icedtea-peach": { name: "Perzik IJsthee", desc: "" },
  "icedtea-lemon": { name: "Citroen IJsthee", desc: "" },

  // ——— Mocktails
  "mocktail-florida": { name: "Florida", desc: "" },
  "mocktail-bora-bora": { name: "Bora Bora", desc: "" },
  "mocktail-pinacolada": { name: "Piñacolada", desc: "" },
  "mocktail-ocean-11": { name: "Ocean 11", desc: "" },

  // ——— Sappen
  "juice-orange": { name: "Sinaasappelsap", desc: "" },
  "juice-lemon": { name: "Citroensap", desc: "" },
  "juice-strawberry": { name: "Aardbeiensap", desc: "" },
  "juice-banana": { name: "Bananensap", desc: "" },
  "juice-avocado": { name: "Avocadosap", desc: "" },
  "juice-mango": { name: "Mangosap", desc: "" },
  "juice-pineapple": { name: "Ananassap", desc: "" },

  // ——— Vers geperst
  "pressed-pineapple": { name: "Koud Geperst Ananassap", desc: "" },

  // ——— Koude Dranken
  "drink-water-33cl": { name: "Mineraalwater 33cl", desc: "" },
  "drink-water-50cl": { name: "Mineral Water 50cl", desc: "" },
  "drink-soda": { name: "Frisdranken", desc: "" },
  "drink-beer-na": { name: "Alcoholvrij Bier", desc: "" },
  "drink-redbull": { name: "Red Bull", desc: "" },

  // ——— Thee
  "tea-mint": { name: "Muntthee", desc: "" },
  "tea-american": { name: "Amerikaanse Thee", desc: "" },
  "tea-infusion": { name: "Kruideninfusie", desc: "" },
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
  "hot-flavored": { name: "Gearomatiseerde Koffie", desc: "Karamel / hazelnoot / vanille" },
  "hot-cafe-creme": { name: "Koffie Crème", desc: "" },
  "hot-nescafe-lait": { name: "Nescafé met Melk", desc: "" },
  "hot-chocolate": { name: "Warme Chocolademelk", desc: "" },
  "hot-capp-vanille-noisette": { name: "Cappuccino", desc: "Karamel, hazelnoot, vanille, slagroom" },
  "hot-royal": { name: "Royal Coffee", desc: "" },
  "hot-double": { name: "Dubbele Koffie", desc: "" },
  "hot-choc-chantilly": { name: "Warme Chocolademelk met Slagroom", desc: "" },
  "hot-latte-macchiato": { name: "Latte Macchiato", desc: "" },
  "hot-bonbon": { name: "Café Bonbon", desc: "" },

  // ——— Ontbijt Formules
  "breakfast-formule-espagnole": { name: "Spaans Ontbijt", desc: "2 eieren, broodmandje, tomatenpuree, manchego, knoflookolie, warme drank, mini sinaasappelsap, mineraalwater" },
  "breakfast-formule-marocaine": { name: "Marokkaans Ontbijt", desc: "Harcha, msemen, baghrir, tarwebrood, smeersels (boter, kaas, honing, amlou), warme drank, mini sinaasappelsap, mineraalwater" },

  // ——— Bowls
  "bowl-original-yogurt": { name: "Originele Yoghurt Bowl", desc: "Yoghurt, granola, seizoensfruit, honing" },
  "bowl-amlou-yogurt": { name: "Amlou Yoghurt Bowl", desc: "Yoghurt, granola, amlou, fruit, honing" },
  "bowl-chia-pudding": { name: "Chia Pudding Bowl", desc: "Chiazaden, granola, seizoensfruit" },

  // ——— Toasts
  "toast-avo-poached": { name: "Avocado & Gepocheerd Ei Toast", desc: "Avocado, gepocheerd ei, rucola" },
  "toast-burrata": { name: "Burrata Toast", desc: "Burrata, cherrytomaat, balsamico, walnoten" },
  "toast-scrambled-egg": { name: "Roerei Toast", desc: "Roerei" },
  "toast-figtastic": { name: "Figtastic Toast", desc: "Brie, vijgen, honing, walnoten" },
  "toast-salmon": { name: "Gerookte Zalm Toast", desc: "Gerookte zalm, roomkaas, rucola, chilivlokken" },

  // ——— Brioche Broodjes
  "bun-egg": { name: "Ei Brioche Broodje", desc: "Roerei, cheddar" },
  "bun-avo-herb": { name: "Avocado & Kruiden Brioche Broodje", desc: "Roerei, avocado, roomkaas, cheddar" },
  "bun-woods": { name: "Woods Brioche Broodje", desc: "Roerei, cheddar, gekarameliseerde ui" },

  // ——— Bagels
  "bagel-classic": { name: "The Classic Bagel", desc: "Zalm, roomkaas, tomaat, ui, kappertjes, komkommer" },
  "bagel-spicy-bec": { name: "The Spicy BEC", desc: "Bacon, ei, kaas, chili crisp" },
  "bagel-chili-tuna": { name: "The Chili Tuna", desc: "Tonijnmousse, avocado, chili crisp, tomaat, sla" },
  "bagel-salmon-avo": { name: "The Salmon Avo", desc: "Zalm, avocado, rucola, ei, chilivlokken" },

  // ——— Sandwiches
  "sandwich-tunacado": { name: "Tunacado Sandwich", desc: "Avocado, tonijnmousse, pesto, tomaat" },
  "sandwich-spicytuna": { name: "Spicy Tuna Sandwich", desc: "Tonijnmousse, tomaat, jalapeño, tabasco, pesto" },
  "sandwich-mozacado": { name: "Mozacado Sandwich", desc: "Mozzarella, avocado, tomaat, pesto" },
  "sandwich-chicken-woods": { name: "Chicken Woods Sandwich", desc: "Gegrilde kip, tomaat, rucola, huisgemaakte saus" },
  "sandwich-chicken-parm": { name: "Chicken Parm Sandwich", desc: "Gegrilde kip, aioli, tomaat, Parmezaan" },
  "sandwich-steak": { name: "Steak Sandwich", desc: "Steak, augurken, tomaat, rucola, Parmezaan, honingmosterd" },

  // ——— Eieren
  "egg-fried-1": { name: "1 Spiegelei", desc: "" },
  "egg-fried-2": { name: "2 Spiegeleieren", desc: "" },
  "egg-fried-3": { name: "3 Spiegeleieren", desc: "" },
  "omelette-plain": { name: "Omelet Naturel", desc: "Eenvoudig en luchtig" },
  "omelette-cheese": { name: "Kaasomelet", desc: "Met gesmolten kaas" },
  "omelette-cheese-turkey": { name: "Kaas & Kalkoen Omelet", desc: "Met kaas en kalkoen" },
  "omelette-khlie": { name: "Khlie Omelet", desc: "Traditioneel Marokkaans gedroogd rundvlees" },
  "omelette-tuna": { name: "Tonijn Omelet", desc: "Met tonijn" },
  "omelette-shrimp": { name: "Garnalen Omelet", desc: "Met gebakken garnalen" },

  // ——— À la Carte
  "alacarte-chocolate-bread": { name: "Chocoladebroodje", desc: "Chocoladebroodje of croissant" },
  "alacarte-turnover": { name: "Kaas- of Amandel Turnover", desc: "Bladerdeeg met kaas of amandel" },
  "alacarte-bread-plate": { name: "Broodassortiment", desc: "Tarwebrood, harcha, msemen of baghrir met 2 smeersels (boter, roomkaas, jam, olijfolie, amlou, honing)" },
  "alacarte-baghrir": { name: "Baghrir", desc: "Baghrir met 2 smeersels" },
  "alacarte-cheese-toast": { name: "Kaas Toast", desc: "Geroosterd brood met gesmolten kaas" },
  "alacarte-turkey-cheese-toast": { name: "Kalkoen & Kaas Toast", desc: "Geroosterd brood met kalkoen en kaas" },
  "alacarte-croque-cheese": { name: "Croque Kaas", desc: "Klassieke kaas croque" },
  "alacarte-baghrir-amlou": { name: "Baghrir met Amlou", desc: "Marokkaanse griesmeelpannenkoekjes met amlou" },
  "alacarte-croque-turkey-cheese": { name: "Croque Kalkoen & Kaas", desc: "Croque met kalkoen en kaas" },
  "alacarte-khlie-eggs": { name: "Khlie met 2 Eieren", desc: "Traditioneel gedroogd rundvlees met 2 eieren" },

  // ——— Hollandse Toast Varianten
  "toast-amsterdam": { name: "Amsterdam Toast", desc: "Hollandse stijl toast" },

  // ——— Kinderformules
  "kids-formula-1": { name: "Kinderformule I", desc: "Baghrir met amlou, mini chocoladepannenkoekjes, cornflakes, koude chocolademelk of warme melk" },
  "kids-formula-2": { name: "Kinderformule II", desc: "Chocoladepannenkoek, cornflakes, koude chocolademelk of warme melk" },

  // ——— Voorgerechten (Koud)
  "salade-nicoise": { name: "Niçoise Salade", desc: "" },
  "salade-cesar": { name: "Caesar Salade", desc: "" },
  "salade-avocat-crevettes": { name: "Avocado & Garnalen Salade", desc: "" },
  "salade-mais": { name: "Maïssalade", desc: "" },
  "salade-burrata": { name: "Burrata Salade", desc: "" },

  // ——— Voorgerechten (Warm)
  "soupe-fruits-de-mer": { name: "Zeevruchtensoep", desc: "" },
  "pilpil-crevettes": { name: "Pil-Pil Garnalen", desc: "" },

  // ——— Hoofdgerechten: Vis
  "merlan": { name: "Wijtingfilet", desc: "" },
  "crevettes-grillees": { name: "Gegrilde Garnalen", desc: "" },
  "thon": { name: "Tonijnfilet", desc: "" },
  "espadon": { name: "Gegrilde Zwaardvisfilet", desc: "" },
  "saumon-papillote": { name: "Zalmsteak", desc: "" },
  "teriyaki-salmon": { name: "Teriyaki Zalm", desc: "" },

  // ——— Hoofdgerechten: Vlees & Kip
  "emince-poulet": { name: "Gesneden Kip", desc: "" },
  "filet-poulet": { name: "Gegrilde Kipfilet", desc: "" },
  "teriyaki-chicken": { name: "Teriyaki Kip", desc: "" },
  "chicken-honey-mustard": { name: "Kip met Honingmosterd", desc: "" },
  "mixed-grill": { name: "Mixed Grill", desc: "" },
  "entrecote": { name: "Entrecôte Groene Saus", desc: "" },
  "filet-boeuf": { name: "Rundvleesfilet", desc: "" },
  "chimichurri-steak": { name: "Chimichurri Steak", desc: "" },

  // ——— Hoofdgerechten: Marokkaans
  "tajine-viande-hachee": { name: "Tajine met Gehakt", desc: "" },
  "tajine-pruneaux": { name: "Rundvleestajine met Pruimen", desc: "" },
  "tajine-coquelet-citron": { name: "Kippetjestajine met Ingelegde Citroen", desc: "" },
  "couscous-poulet": { name: "Kip Couscous (vrijdag)", desc: "" },
  "couscous-viande": { name: "Rundvlees Couscous (vrijdag)", desc: "" },

  // ——— Pasta
  "pasta-carbonara": { name: "Pasta alla Carbonara", desc: "Gerookte kalkoen, carbonarasaus, Parmezaan" },
  "pasta-bolognaise": { name: "Pasta alla Bolognese", desc: "Bolognesesaus, basilicum, Parmezaan" },
  "pasta-tuscan-chicken": { name: "Pasta Toscaanse Kip", desc: "Gegrilde toscaanse kip met romige tomatensaus en Parmezaan" },
  "pasta-truffle": { name: "Pasta Truffel", desc: "Truffelroom met Parmezaan en zwarte peper" },
  "pasta-frutti-di-mare": { name: "Pasta Frutti di Mare", desc: "Zeevruchten met romige saus" },
  "pasta-arrabiata": { name: "Pasta Arrabbiata Burrata", desc: "Pittige tomatensaus met burrata" },
  "linguine-scampi": { name: "Linguine alla Scampi", desc: "Huisgemaakte pikante saus" },
  "lasagnes-bolognaise": { name: "Lasagne alla Bolognese", desc: "" },

  // ——— Risotto
  "risotto-4formaggi": { name: "Risotto Quattro Formaggi", desc: "Tomaat, mozzarella, edam, roquefort, Parmezaan" },
  "risotto-fruits-mer": { name: "Zeevruchten Risotto", desc: "Zeevruchten met romige saus" },
  "risotto-pollo": { name: "Kip Risotto", desc: "Romige risotto met gegrilde pikante kip" },
  "risotto-truffle": { name: "Truffel Risotto", desc: "Truffelroom met Parmezaan en zwarte peper" },

  // ——— Pizza
  "pz-margherita": { name: "Margherita", desc: "Tomaat, mozzarella, zwarte olijven" },
  "pz-primavera": { name: "Primavera", desc: "Tomaat, mozzarella, aubergine, courgette, champignons, paprika, ui, cherrytomaat" },
  "pz-pollo-piccante": { name: "Pollo Piccante", desc: "Witte saus, mozzarella, kip, ui, groene paprika" },
  "pz-tonno": { name: "Al Tonno", desc: "Tomaat, mozzarella, tonijn, ui, paprika, zwarte olijven" },
  "pz-local-honey": { name: "Local Honey Pizza", desc: "Ricottakaas, geraspte walnoten, honing" },
  "pz-truffle": { name: "Truffel Pizza", desc: "Burrata, mozzarella, champignon, truffel" },
  "pz-bolognaise": { name: "Bolognese", desc: "Tomaat, mozzarella, gehakt, zwarte olijven" },
  "pz-frutti": { name: "Frutti di Mare", desc: "Tomaat, mozzarella, inktvis, garnalen, surimi, mosselen, zwarte olijven" },
  "pz-4formaggi": { name: "Quattro Formaggi", desc: "Tomaat, mozzarella, edam, roquefort, Parmezaan" },
  "pz-diavola": { name: "Diavola", desc: "Tomaat, mozzarella, pepperoni, zwarte olijven" },
  "pz-pastrami": { name: "Pastrami", desc: "Tomaat, mozzarella, pastrami, rucola, Parmezaan" },
  "pz-short-ribs": { name: "Short Ribs", desc: "BBQ-saus, mozzarella, short rib, Parmezaan" },

  // ——— Aperitieven / Sides
  "shrimp-croquettes": { name: "Garnaalkroketten", desc: "" },
  "mozza-sticks-4": { name: "Mozzarella Sticks (4 stuks)", desc: "" },
  "mozza-sticks-6": { name: "Mozzarella Sticks (6 stuks)", desc: "" },
  "mozza-sticks-9": { name: "Mozzarella Sticks (9 stuks)", desc: "" },
  "calamari": { name: "Calamari", desc: "" },
  "truffle-fries": { name: "Truffelfrieten", desc: "" },
  "sweet-potato-fries": { name: "Zoete Aardappelfrieten", desc: "" },
  "tortilla-side": { name: "Tortilla", desc: "" },

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
  "burger-chicken": { name: "Kipburger", desc: "Kipsteak, cheddar" },
  "burger-cheese": { name: "Cheeseburger", desc: "Gehakt, groene sla, tomaat" },
  "burger-double-cheese": { name: "Double Cheeseburger", desc: "Dubbel gehakt, dubbele cheddar" },
  "burger-american": { name: "American Burger", desc: "Gehakt, ei, cheddar" },

  // ——— Hartige Crêpes
  "crepe-fromage": { name: "Kaas Crêpe", desc: "Kaas, bechamelsaus" },
  "crepe-dinde-fromage": { name: "Kalkoen & Kaas Crêpe", desc: "Gerookte kalkoen, kaas, ei, bechamelsaus" },
  "crepe-poulet-champignons": { name: "Kip Crêpe", desc: "Kip, kaas, bechamelsaus" },
  "crepe-viande-hachee": { name: "Gehakt Crêpe", desc: "Gehakt, kaas, oregano, tomatensaus" },
  "crepe-mixte": { name: "Gemengde Crêpe", desc: "Gehakt, kip, gerookte kalkoen, kaas, bechamelsaus" },

  // ——— Tacos
  "tacos-poulet": { name: "Kip Taco", desc: "" },
  "tacos-viande": { name: "Gehakt Taco", desc: "" },

  // ——— Panini
  "panini-chicken": { name: "Kip Panini", desc: "" },
  "panini-minced-meat": { name: "Gehakt Panini", desc: "" },

  // ——— Zoete Crêpes / Wafels / Pannenkoeken
  "sweet-crepe-simple": { name: "Zoete Crêpe / Wafel", desc: "" },
  "sweet-crepe-miel": { name: "Honing Crêpe / Wafel", desc: "" },
  "sweet-crepe-caramel": { name: "Karamel Crêpe / Wafel", desc: "" },
  "sweet-crepe-amlou": { name: "Amlou Crêpe / Wafel", desc: "" },
  "sweet-crepe-choco": { name: "Chocolade Crêpe / Wafel", desc: "" },
  "sweet-crepe-choco-banane": { name: "Chocolade Banaan Crêpe / Wafel", desc: "" },
  "sweet-crepe-choco-blanc": { name: "Witte Chocolade Crêpe / Wafel", desc: "" },
  "sweet-crepe-nutella": { name: "Nutella Crêpe / Wafel", desc: "" },
  "sweet-crepe-black-white": { name: "Black & White Crêpe / Wafel", desc: "" },
  "sweet-crepe-nutella-noix": { name: "Nutella Walnoot Crêpe / Wafel", desc: "" },
  "sweet-crepe-nutella-banane": { name: "Nutella Banaan Crêpe / Wafel", desc: "" },
  "sweet-crepe-mix": { name: "Oreo / Kinder / Lotus / KitKat Crêpe", desc: "" },
  "sweet-crepe-woods": { name: "Woods Crêpe", desc: "Nutella, walnoten, bol ijs" },
  "sweet-crepe-dubai": { name: "Dubai Crêpe / Wafel", desc: "" },

  "pancake-simple": { name: "Pannenkoek", desc: "" },
  "pancake-miel": { name: "Honing Pannenkoek", desc: "" },
  "pancake-caramel": { name: "Karamel Pannenkoek", desc: "" },
  "pancake-amlou": { name: "Amlou Pannenkoek", desc: "" },
  "pancake-choco": { name: "Chocolade Pannenkoek", desc: "" },
  "pancake-choco-banane": { name: "Chocolade Banaan Pannenkoek", desc: "" },
  "pancake-choco-blanc": { name: "Witte Chocolade Pannenkoek", desc: "" },
  "pancake-nutella": { name: "Nutella Pannenkoek", desc: "" },
  "pancake-black-white": { name: "Black & White Pannenkoek", desc: "" },
  "pancake-nutella-noix": { name: "Nutella Walnoot Pannenkoek", desc: "" },
  "pancake-nutella-banane": { name: "Nutella Banaan Pannenkoek", desc: "" },
  "pancake-mix": { name: "Oreo / Kinder / Lotus / KitKat Pannenkoek", desc: "" },
  "pancake-woods": { name: "Woods Pannenkoek", desc: "Nutella, walnoten, bol ijs" },
  "pancake-dubai": { name: "Dubai Pannenkoek", desc: "" },

  // ——— Desserts
  "dess-patisserie": { name: "Patisserie", desc: "" },
  "dess-fruit-salad-1": { name: "Fruitsalade (1 persoon)", desc: "" },
  "dess-fruit-salad-2": { name: "Fruitsalade (2 personen)", desc: "" },
  "dess-fondant": { name: "Chocoladefondant", desc: "Met een bol ijs" },

  // ——— Taarten (Stukje Taart)
  "dess-tart-red-velvet": { name: "Red Velvet", desc: "" },
  "dess-tart-lotus": { name: "Lotus", desc: "" },
  "dess-tart-chocolate": { name: "Chocolade", desc: "" },
  "dess-tart-cheesecake-wc": { name: "Cheesecake Witte Chocolade Framboos", desc: "" },
  "dess-tart-cheesecake-pistachio": { name: "Pistache Cheesecake", desc: "" },
  "dess-tart-cheesecake-classic": { name: "Klassieke Cheesecake", desc: "" },
  "dess-tart-walnut": { name: "Walnoottaart", desc: "" },
  "dess-tart-almond": { name: "Amandeltaart", desc: "" },
  "dess-tart-tiramisu": { name: "Tiramisu", desc: "" },

  // ——— Frappuccino & Freakshake
  "frappuccino": { name: "Frappuccino", desc: "Keuze uit chocolade / karamel / vanille / hazelnoot" },
  "milkshake": { name: "Milkshake / Sinaasappelshake", desc: "" },
  "freakshake": { name: "Freakshake", desc: "Oreo, Nutella, chocolade, karamel of koekjes" },

  // ——— IJscoupes
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
  "coupe-woods": { name: "Woods Coupe", desc: "6 bollen gemengd ijs & sorbet met slagroom" },

  // ——— Bouw Je Eigen IJs
  "ice-chantilly": { name: "Slagroom", desc: "" },
  "ice-1-boule": { name: "1 Bol IJs", desc: "" },
  "ice-2-boules": { name: "2 Bollen IJs", desc: "" },
  "ice-3-boules": { name: "3 Bollen IJs", desc: "" },
  "ice-4-boules": { name: "4 Bollen IJs", desc: "" },
  "ice-500g": { name: "½ kg IJs", desc: "" },
  "ice-1kg": { name: "1 kg IJs", desc: "" },
  "ice-tarte": { name: "Ijstaart", desc: "" }
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
    { id: "matcha-latte", price: 55, category: "drinks", subcategory: "Matcha" },
    { id: "matcha-coco", price: 75, category: "drinks", subcategory: "Matcha" },
    { id: "matcha-pink-foam", price: 70, category: "drinks", subcategory: "Matcha" },
    { id: "matcha-fraise", price: 65, category: "drinks", subcategory: "Matcha" },
    { id: "matcha-mangue", price: 65, category: "drinks", subcategory: "Matcha" },
    { id: "matcha-ube", price: 65, category: "drinks", subcategory: "Matcha" },
    { id: "matcha-blue", price: 65, category: "drinks", subcategory: "Matcha" },
    { id: "milk-options", price: 5, category: "drinks", subcategory: "Matcha" },


    // CAFÉ & SPÉCIALITÉS
    { id: "coffee-coco-latte", price: 60, category: "drinks", subcategory: "Café & Spécialités" },
    { id: "coffee-creme-brulee-latte", price: 65, category: "drinks", subcategory: "Café & Spécialités" },
    { id: "coffee-spanish-latte", price: 50, category: "drinks", subcategory: "Café & Spécialités" },
    { id: "coffee-ube-latte", price: 55, category: "drinks", subcategory: "Café & Spécialités" },
    { id: "coffee-pistachio-latte", price: 55, category: "drinks", subcategory: "Café & Spécialités" },
    { id: "coffee-tiramisu-latte", price: 65, category: "drinks", subcategory: "Café & Spécialités" },
    { id: "coffee-chai-latte", price: 40, category: "drinks", subcategory: "Café & Spécialités" },
    { id: "milk-options1", price: 5, category: "drinks", subcategory: "Café & Spécialités" },

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
    { id: "smoothie-golden-smooth", price: 60, category: "drinks", subcategory: "Smoothies" },
    { id: "smoothie-coco-blush", price: 60, category: "drinks", subcategory: "Smoothies" },

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
    { id: "icedtea-peach", price: 38, category: "drinks", subcategory: "Thés glacés" },
    { id: "icedtea-lemon", price: 38, category: "drinks", subcategory: "Thés glacés" },

    // COCKTAILS SANS ALCOOL
    { id: "mocktail-florida", price: 40, category: "drinks", subcategory: "Cocktails sans alcool" },
    { id: "mocktail-bora-bora", price: 40, category: "drinks", subcategory: "Cocktails sans alcool" },
    { id: "mocktail-pinacolada", price: 50, category: "drinks", subcategory: "Cocktails sans alcool" },
    { id: "mocktail-ocean-11", price: 45, category: "drinks", subcategory: "Cocktails sans alcool" },

    // JUS
    { id: "juice-orange", price: 30, category: "drinks", subcategory: "Jus" },
    { id: "juice-lemon", price: 30, category: "drinks", subcategory: "Jus" },
    { id: "juice-strawberry", price: 40, category: "drinks", subcategory: "Jus" },
    { id: "juice-banana", price: 45, category: "drinks", subcategory: "Jus" },
    { id: "juice-avocado", price: 45, category: "drinks", subcategory: "Jus" },
    { id: "juice-mango", price: 45, category: "drinks", subcategory: "Jus" },
    { id: "juice-pineapple", price: 45, category: "drinks", subcategory: "Jus" },

    // JUS PRESSÉS
    { id: "pressed-pineapple", price: 65, category: "drinks", subcategory: "Jus pressés" },
    { id: "balance-debloat", price: 70, category: "drinks", subcategory: "Jus pressés" },
    { id: "iron-charge", price: 45, category: "drinks", subcategory: "Jus pressés" },
    { id: "hydrate-pulse", price: 65, category: "drinks", subcategory: "Jus pressés" },
    { id: "green-clean", price: 55, category: "drinks", subcategory: "Jus pressés" },
    { id: "berry-mood", price: 60, category: "drinks", subcategory: "Jus pressés" },
    { id: "stress-down", price: 60, category: "drinks", subcategory: "Jus pressés" },
    { id: "tropical-boost", price: 70, category: "drinks", subcategory: "Jus pressés" },
    { id: "feel-good", price: 65, category: "drinks", subcategory: "Jus pressés" },
    { id: "berry-breeze", price: 55, category: "drinks", subcategory: "Jus pressés" },

    // ——— BOISSONS FRAÎCHES / COLD DRINKS
    { id: "drink-water-33cl", price: 10, category: "drinks", subcategory: "Boissons Fraîches" },
    { id: "drink-water-50cl", price: 15, category: "drinks", subcategory: "Boissons Fraîches" },
    { id: "drink-soda", price: 25, category: "drinks", subcategory: "Boissons Fraîches" },
    { id: "drink-beer-na", price: 40, category: "drinks", subcategory: "Boissons Fraîches" },
    { id: "drink-redbull", price: 40, category: "drinks", subcategory: "Boissons Fraîches" },


      // ——— NOS THÉS
      { id: "tea-mint", price: 22, category: "drinks", subcategory: "Nos Thé" },
      { id: "tea-american", price: 22, category: "drinks", subcategory: "Nos Thé" },
      { id: "tea-infusion", price: 22, category: "drinks", subcategory: "Nos Thé" },
      { id: "tea-black", price: 22, category: "drinks", subcategory: "Nos Thé" },
      { id: "tea-special", price: 24, category: "drinks", subcategory: "Nos Thé" },
      { id: "tea-black-special", price: 24, category: "drinks", subcategory: "Nos Thé" },

      // ——— BOISSONS CHAUDES / HOT DRINKS
      { id: "hot-espresso", price: 22, category: "drinks", subcategory: "Boissons Chaudes" },
      { id: "hot-americano", price: 23, category: "drinks", subcategory: "Boissons Chaudes" },
      { id: "hot-milk", price: 20, category: "drinks", subcategory: "Boissons Chaudes" },
      { id: "hot-nespresso", price: 25, category: "drinks", subcategory: "Boissons Chaudes" },
      { id: "hot-capp-italian", price: 28, category: "drinks", subcategory: "Boissons Chaudes" },
      { id: "hot-nespresso-creme", price: 29, category: "drinks", subcategory: "Boissons Chaudes" },
      { id: "hot-nespresso-double", price: 33, category: "drinks", subcategory: "Boissons Chaudes" },
      { id: "hot-flavored", price: 27, category: "drinks", subcategory: "Boissons Chaudes" },
      { id: "hot-cafe-creme", price: 26, category: "drinks", subcategory: "Boissons Chaudes" },
      { id: "hot-nescafe-lait", price: 25, category: "drinks", subcategory: "Boissons Chaudes" },
      { id: "hot-chocolate", price: 26, category: "drinks", subcategory: "Boissons Chaudes" },
      { id: "hot-capp-vanille-noisette", price: 35, category: "drinks", subcategory: "Boissons Chaudes" },
      { id: "hot-royal", price: 30, category: "drinks", subcategory: "Boissons Chaudes" },
      { id: "hot-double", price: 28, category: "drinks", subcategory: "Boissons Chaudes" },
      { id: "hot-choc-chantilly", price: 35, category: "drinks", subcategory: "Boissons Chaudes" },
      { id: "hot-latte-macchiato", price: 30, category: "drinks", subcategory: "Boissons Chaudes" },
      { id: "hot-bonbon", price: 28, category: "drinks", subcategory: "Boissons Chaudes" },
    
    
  

      
        // ————— PETIT-DÉJEUNER —————
        // MOROCCAN
        { id: "breakfast-formule-marocaine", price: 70, category: "breakfast", subcategory: "Marocaine" },

        // SPANISH
        { id: "breakfast-formule-espagnole", price: 80, category: "breakfast", subcategory: "Espagnol" },

        // TOAST HOLLANDAIS
        { id: "toast-amsterdam", price: 45, category: "breakfast", subcategory: "Toast Hollandais" },

        // BOLS
        { id: "bowl-original-yogurt", price: 50, category: "breakfast", subcategory: "Bols" },
        { id: "bowl-amlou-yogurt", price: 55, category: "breakfast", subcategory: "Bols" },
        { id: "bowl-chia-pudding", price: 60, category: "breakfast", subcategory: "Bols" },

        // TARTINES
        { id: "toast-avo-poached", price: 60, category: "breakfast", subcategory: "Tartines" },
        { id: "toast-burrata", price: 50, category: "breakfast", subcategory: "Tartines" },
        { id: "toast-scrambled-egg", price: 40, category: "breakfast", subcategory: "Tartines" },
        { id: "toast-figtastic", price: 70, category: "breakfast", subcategory: "Tartines" },
        { id: "toast-salmon", price: 75, category: "breakfast", subcategory: "Tartines" },

        // BAGELS
        { id: "bagel-classic", price: 80, category: "breakfast", subcategory: "Bagels" },
        { id: "bagel-spicy-bec", price: 65, category: "breakfast", subcategory: "Bagels" },
        { id: "bagel-chili-tuna", price: 70, category: "breakfast", subcategory: "Bagels" },
        { id: "bagel-salmon-avo", price: 90, category: "breakfast", subcategory: "Bagels" },

        // PETITS PAINS BRIOCHÉS
        { id: "bun-egg", price: 40, category: "breakfast", subcategory: "Petits pains briochés" },
        { id: "bun-avo-herb", price: 55, category: "breakfast", subcategory: "Petits pains briochés" },
        { id: "bun-woods", price: 45, category: "breakfast", subcategory: "Petits pains briochés" },

        // SANDWICHS
        { id: "sandwich-tunacado", price: 65, category: "breakfast", subcategory: "Sandwichs" },
        { id: "sandwich-spicytuna", price: 60, category: "breakfast", subcategory: "Sandwichs" },
        { id: "sandwich-mozacado", price: 60, category: "breakfast", subcategory: "Sandwichs" },
        { id: "sandwich-chicken-woods", price: 70, category: "breakfast", subcategory: "Sandwichs" },
        { id: "sandwich-chicken-parm", price: 75, category: "breakfast", subcategory: "Sandwichs" },
        { id: "sandwich-steak", price: 95, category: "breakfast", subcategory: "Sandwichs" },


          // ŒUFS
          { id: "egg-fried-1", price: 20, category: "breakfast", subcategory: "Œufs" },
          { id: "egg-fried-2", price: 25, category: "breakfast", subcategory: "Œufs" },
          { id: "egg-fried-3", price: 30, category: "breakfast", subcategory: "Œufs" },
          { id: "omelette-plain", price: 30, category: "breakfast", subcategory: "Œufs" },
          { id: "omelette-cheese", price: 35, category: "breakfast", subcategory: "Œufs" },
          { id: "omelette-cheese-turkey", price: 40, category: "breakfast", subcategory: "Œufs" },
          { id: "omelette-khlie", price: 50, category: "breakfast", subcategory: "Œufs" },
          { id: "omelette-shrimp", price: 60, category: "breakfast", subcategory: "Œufs" },

          // À LA CARTE
          { id: "alacarte-chocolate-bread", price: 14, category: "breakfast", subcategory: "À la Carte" },
          { id: "alacarte-turnover", price: 16, category: "breakfast", subcategory: "À la Carte" },
          { id: "alacarte-bread-plate", price: 28, category: "breakfast", subcategory: "À la Carte" },
          { id: "alacarte-baghrir", price: 28, category: "breakfast", subcategory: "À la Carte" },
          { id: "alacarte-cheese-toast", price: 25, category: "breakfast", subcategory: "À la Carte" },
          { id: "alacarte-turkey-cheese-toast", price: 30, category: "breakfast", subcategory: "À la Carte" },
          { id: "alacarte-croque-cheese", price: 35, category: "breakfast", subcategory: "À la Carte" },
          { id: "alacarte-baghrir-amlou", price: 35, category: "breakfast", subcategory: "À la Carte" },
          { id: "alacarte-croque-turkey-cheese", price: 40, category: "breakfast", subcategory: "À la Carte" },
          { id: "alacarte-khlie-eggs", price: 42, category: "breakfast", subcategory: "À la Carte" },

          // KIDS FORMULA
          { id: "kids-formula-1", price: 40, category: "breakfast", subcategory: "Formules Enfants" },
          { id: "kids-formula-2", price: 45, category: "breakfast", subcategory: "Formules Enfants" },
        
          
            // ——— ENTRÉES
            { id: "salade-nicoise", price: 75, category: "entrees", subcategory: "Entrées Froides" },
            { id: "salade-cesar", price: 80, category: "entrees", subcategory: "Entrées Froides" },
            { id: "salade-avocat-crevettes", price: 95, category: "entrees", subcategory: "Entrées Froides" },
            { id: "salade-mais", price: 80, category: "entrees", subcategory: "Entrées Froides" },
            { id: "salade-burrata", price: 85, category: "entrees", subcategory: "Entrées Froides" },

            { id: "soupe-fruits-de-mer", price: 60, category: "entrees", subcategory: "Entrées Chaudes" },
            { id: "pilpil-crevettes", price: 80, category: "entrees", subcategory: "Entrées Chaudes" },

            // ——— SIDES
            { id: "shrimp-croquettes", price: 75, category: "entrees", subcategory: "Sides" },
            { id: "tortilla-side", price: 65, category: "entrees", subcategory: "Sides" },
            { id: "truffle-fries", price: 60, category: "entrees", subcategory: "Sides" },
            { id: "sweet-potato-fries", price: 35, category: "entrees", subcategory: "Sides" },
            { id: "calamari", price: 100, category: "entrees", subcategory: "Sides" },
            { id: "mozza-sticks-4", price: 35, category: "entrees", subcategory: "Sides" },
            { id: "mozza-sticks-6", price: 48, category: "entrees", subcategory: "Sides" },
            { id: "mozza-sticks-9", price: 58, category: "entrees", subcategory: "Sides" },
            { id: "nuggets-4", price: 32, category: "entrees", subcategory: "Sides" },
            { id: "nuggets-6", price: 44, category: "entrees", subcategory: "Sides" },
            { id: "nuggets-9", price: 54, category: "entrees", subcategory: "Sides" },

            // ——— MAINS: POISSON
            { id: "merlan", price: 140, category: "plats", subcategory: "À Base Poisson" },
            { id: "crevettes-grillees", price: 140, category: "plats", subcategory: "À Base Poisson" },
            { id: "thon", price: 140, category: "plats", subcategory: "À Base Poisson" },
            { id: "espadon", price: 160, category: "plats", subcategory: "À Base Poisson" },
            { id: "saumon-papillote", price: 180, category: "plats", subcategory: "À Base Poisson" },
            { id: "teriyaki-salmon", price: 190, category: "plats", subcategory: "À Base Poisson" },

            // ——— MAINS: VIANDE & POULET
            { id: "emince-poulet", price: 115, category: "plats", subcategory: "À Base Viande & Poulet" },
            { id: "filet-poulet", price: 120, category: "plats", subcategory: "À Base Viande & Poulet" },
            { id: "teriyaki-chicken", price: 130, category: "plats", subcategory: "À Base Viande & Poulet" },
            { id: "chicken-honey-mustard", price: 110, category: "plats", subcategory: "À Base Viande & Poulet" },
            { id: "mixed-grill", price: 160, category: "plats", subcategory: "À Base Viande & Poulet" },
            { id: "entrecote", price: 180, category: "plats", subcategory: "À Base Viande & Poulet" },
            { id: "filet-boeuf", price: 190, category: "plats", subcategory: "À Base Viande & Poulet" },
            { id: "chimichurri-steak", price: 220, category: "plats", subcategory: "À Base Viande & Poulet" },

            // ——— PLATS MAROCAINS
            { id: "tajine-viande-hachee", price: 85, category: "plats", subcategory: "Marocains" },
            { id: "tajine-pruneaux", price: 115, category: "plats", subcategory: "Marocains" },
            { id: "tajine-coquelet-citron", price: 80, category: "plats", subcategory: "Marocains" },
            { id: "couscous-poulet", price: 70, category: "plats", subcategory: "Marocains" },
            { id: "couscous-viande", price: 80, category: "plats", subcategory: "Marocains" },


              // ——— PASTA
              { id: "pasta-carbonara", price: 90, category: "pastas", subcategory: "Pâtes" },
              { id: "pasta-bolognaise", price: 95, category: "pastas", subcategory: "Pâtes" },
              { id: "pasta-tuscan-chicken", price: 115, category: "pastas", subcategory: "Pâtes" },
              { id: "pasta-truffle", price: 150, category: "pastas", subcategory: "Pâtes" },
              { id: "pasta-frutti-di-mare", price: 135, category: "pastas", subcategory: "Pâtes" },
              { id: "pasta-arrabiata", price: 110, category: "pastas", subcategory: "Pâtes" },
              { id: "linguine-scampi", price: 135, category: "pastas", subcategory: "Pâtes" },
              { id: "lasagnes-bolognaise", price: 85, category: "pastas", subcategory: "Pâtes" },

              // ——— PIZZAS
              { id: "pz-margherita", price: 70, category: "pizzas", subcategory: "Pizzas" },
              { id: "pz-primavera", price: 80, category: "pizzas", subcategory: "Pizzas" },
              { id: "pz-pollo-piccante", price: 105, category: "pizzas", subcategory: "Pizzas" },
              { id: "pz-tonno", price: 85, category: "pizzas", subcategory: "Pizzas" },
              { id: "pz-local-honey", price: 90, category: "pizzas", subcategory: "Pizzas" },
              { id: "pz-truffle", price: 145, category: "pizzas", subcategory: "Pizzas" },
              { id: "pz-bolognaise", price: 115, category: "pizzas", subcategory: "Pizzas" },
              { id: "pz-frutti", price: 140, category: "pizzas", subcategory: "Pizzas" },
              { id: "pz-4formaggi", price: 90, category: "pizzas", subcategory: "Pizzas" },
              { id: "pz-diavola", price: 85, category: "pizzas", subcategory: "Pizzas" },
              { id: "pz-pastrami", price: 105, category: "pizzas", subcategory: "Pizzas" },
              { id: "pz-short-ribs", price: 160, category: "pizzas", subcategory: "Pizzas" },

              // ——— BURGERS
              { id: "burger-chicken", price: 60, category: "burgers", subcategory: "Burgers" },
              { id: "burger-cheese", price: 68, category: "burgers", subcategory: "Burgers" },
              { id: "burger-double-cheese", price: 80, category: "burgers", subcategory: "Burgers" },
              { id: "burger-american", price: 75, category: "burgers", subcategory: "Burgers" },

              // ——— CRÊPES SALÉES
              { id: "crepe-fromage", price: 45, category: "crepes_savory", subcategory: "Crêpes Salées" },
              { id: "crepe-dinde-fromage", price: 52, category: "crepes_savory", subcategory: "Crêpes Salées" },
              { id: "crepe-poulet-champignons", price: 57, category: "crepes_savory", subcategory: "Crêpes Salées" },
              { id: "crepe-viande-hachee", price: 60, category: "crepes_savory", subcategory: "Crêpes Salées" },
              { id: "crepe-mixte", price: 70, category: "crepes_savory", subcategory: "Crêpes Salées" },

              // ——— TACOS
              { id: "tacos-poulet", price: 70, category: "tacos", subcategory: "Tacos" },
              { id: "tacos-viande", price: 80, category: "tacos", subcategory: "Tacos" },

              // ——— SANDWICHS
              { id: "sandwich-tunacado", price: 65, category: "sandwiches", subcategory: "Sandwiches" },
              { id: "sandwich-spicytuna", price: 60, category: "sandwiches", subcategory: "Sandwiches" },
              { id: "sandwich-mozacado", price: 60, category: "sandwiches", subcategory: "Sandwiches" },
              { id: "sandwich-chicken-woods", price: 70, category: "sandwiches", subcategory: "Sandwiches" },
              { id: "sandwich-chicken-parm", price: 75, category: "sandwiches", subcategory: "Sandwiches" },
              { id: "sandwich-steak", price: 95, category: "sandwiches", subcategory: "Sandwiches" },

              // ——— PANINI
              { id: "panini-chicken", price: 60, category: "panini", subcategory: "Panini" },
              { id: "panini-minced-meat", price: 65, category: "panini", subcategory: "Panini" },
                    

                        // ——— CRÊPES / GAUFRES / PANCAKES SUCRÉS
                        { id: "sweet-crepe-simple", price: 35, category: "sweets_crepes_gaufres_pancakes", subcategory: "Crêpes & Gauffres" },
                        { id: "sweet-crepe-miel", price: 39, category: "sweets_crepes_gaufres_pancakes", subcategory: "Crêpes & Gauffres" },
                        { id: "sweet-crepe-caramel", price: 39, category: "sweets_crepes_gaufres_pancakes", subcategory: "Crêpes & Gauffres" },
                        { id: "sweet-crepe-amlou", price: 45, category: "sweets_crepes_gaufres_pancakes", subcategory: "Crêpes & Gauffres" },
                        { id: "sweet-crepe-choco", price: 39, category: "sweets_crepes_gaufres_pancakes", subcategory: "Crêpes & Gauffres" },
                        { id: "sweet-crepe-choco-banane", price: 45, category: "sweets_crepes_gaufres_pancakes", subcategory: "Crêpes & Gauffres" },
                        { id: "sweet-crepe-choco-blanc", price: 39, category: "sweets_crepes_gaufres_pancakes", subcategory: "Crêpes & Gauffres" },
                        { id: "sweet-crepe-nutella", price: 45, category: "sweets_crepes_gaufres_pancakes", subcategory: "Crêpes & Gauffres" },
                        { id: "sweet-crepe-black-white", price: 42, category: "sweets_crepes_gaufres_pancakes", subcategory: "Crêpes & Gauffres" },
                        { id: "sweet-crepe-nutella-noix", price: 55, category: "sweets_crepes_gaufres_pancakes", subcategory: "Crêpes & Gauffres" },
                        { id: "sweet-crepe-nutella-banane", price: 50, category: "sweets_crepes_gaufres_pancakes", subcategory: "Crêpes & Gauffres" },
                        { id: "sweet-crepe-mix", price: 50, category: "sweets_crepes_gaufres_pancakes", subcategory: "Crêpes & Gauffres" },
                        { id: "sweet-crepe-woods", price: 65, category: "sweets_crepes_gaufres_pancakes", subcategory: "Crêpes & Gauffres" },
                        { id: "sweet-crepe-dubai", price: 75, category: "sweets_crepes_gaufres_pancakes", subcategory: "Crêpes & Gauffres" },

                        { id: "pancake-simple", price: 41, category: "sweets_crepes_gaufres_pancakes", subcategory: "Pancake" },
                        { id: "pancake-miel", price: 44, category: "sweets_crepes_gaufres_pancakes", subcategory: "Pancake" },
                        { id: "pancake-caramel", price: 44, category: "sweets_crepes_gaufres_pancakes", subcategory: "Pancake" },
                        { id: "pancake-amlou", price: 48, category: "sweets_crepes_gaufres_pancakes", subcategory: "Pancake" },
                        { id: "pancake-choco", price: 44, category: "sweets_crepes_gaufres_pancakes", subcategory: "Pancake" },
                        { id: "pancake-choco-banane", price: 50, category: "sweets_crepes_gaufres_pancakes", subcategory: "Pancake" },
                        { id: "pancake-choco-blanc", price: 44, category: "sweets_crepes_gaufres_pancakes", subcategory: "Pancake" },
                        { id: "pancake-nutella", price: 50, category: "sweets_crepes_gaufres_pancakes", subcategory: "Pancake" },
                        { id: "pancake-black-white", price: 47, category: "sweets_crepes_gaufres_pancakes", subcategory: "Pancake" },
                        { id: "pancake-nutella-noix", price: 58, category: "sweets_crepes_gaufres_pancakes", subcategory: "Pancake" },
                        { id: "pancake-nutella-banane", price: 55, category: "sweets_crepes_gaufres_pancakes", subcategory: "Pancake" },
                        { id: "pancake-mix", price: 55, category: "sweets_crepes_gaufres_pancakes", subcategory: "Pancake" },
                        { id: "pancake-woods", price: 70, category: "sweets_crepes_gaufres_pancakes", subcategory: "Pancake" },
                        { id: "pancake-dubai", price: 80, category: "sweets_crepes_gaufres_pancakes", subcategory: "Pancake" },

                        // ——— DESSERTS
                        { id: "dess-patisserie", price: 35, category: "desserts", subcategory: "Desserts" },
                        { id: "dess-fruit-salad-1", price: 55, category: "desserts", subcategory: "Desserts" },
                        { id: "dess-fruit-salad-2", price: 100, category: "desserts", subcategory: "Desserts" },
                        { id: "dess-fondant", price: 50, category: "desserts", subcategory: "Desserts" },

                        // ——— TARTES (SLICE OF TART)
                        { id: "dess-tart-red-velvet", price: 50, category: "desserts", subcategory: "Tartes" },
                        { id: "dess-tart-lotus", price: 50, category: "desserts", subcategory: "Tartes" },
                        { id: "dess-tart-chocolate", price: 45, category: "desserts", subcategory: "Tartes" },
                        { id: "dess-tart-cheesecake-wc", price: 50, category: "desserts", subcategory: "Tartes" },
                        { id: "dess-tart-cheesecake-pistachio", price: 50, category: "desserts", subcategory: "Tartes" },
                        { id: "dess-tart-cheesecake-classic", price: 50, category: "desserts", subcategory: "Tartes" },
                        { id: "dess-tart-walnut", price: 45, category: "desserts", subcategory: "Tartes" },
                        { id: "dess-tart-almond", price: 45, category: "desserts", subcategory: "Tartes" },
                        { id: "dess-tart-tiramisu", price: 60, category: "desserts", subcategory: "Tartes" },

                          // ——— FRAPPUCCINO & FREAKSHAKE
                          { id: "frappuccino", price: 42, category: "desserts", subcategory: "Frappuccino" },
                          { id: "milkshake", price: 42, category: "desserts", subcategory: "freakshake" },
                          { id: "freakshake", price: 55, category: "desserts", subcategory: "Freakshake" },

                          // ——— COUPES DE GLACES
                          { id: "coupe-fruit-rouge", price: 60, category: "desserts", subcategory: "Coupes glacées" },
                          { id: "coupe-rocher", price: 50, category: "desserts", subcategory: "Coupes glacées" },
                          { id: "coupe-kitkat", price: 45, category: "desserts", subcategory: "Coupes glacées" },
                          { id: "coupe-banana-split", price: 60, category: "desserts", subcategory: "Coupes glacées" },
                          { id: "coupe-fraise-melba", price: 60, category: "desserts", subcategory: "Coupes glacées" },
                          { id: "coupe-caraibes", price: 60, category: "desserts", subcategory: "Coupes glacées" },
                          { id: "coupe-caramelo", price: 60, category: "desserts", subcategory: "Coupes glacées" },
                          { id: "coupe-bisutto", price: 60, category: "desserts", subcategory: "Coupes glacées" },
                          { id: "coupe-negrisco", price: 80, category: "desserts", subcategory: "Coupes glacées" },
                          { id: "coupe-exotique", price: 60, category: "desserts", subcategory: "Coupes glacées" },
                          { id: "coupe-woods", price: 95, category: "desserts", subcategory: "Coupes glacées" },

                            // ——— COMPOSEZ VOTRE GLACE
                            { id: "ice-chantilly", price: 10, category: "desserts", subcategory: "Composez Votre Glace" },
                            { id: "ice-2-boules", price: 38, category: "desserts", subcategory: "Composez Votre Glace" },
                            { id: "ice-3-boules", price: 57, category: "desserts", subcategory: "Composez Votre Glace" },
                            { id: "ice-4-boules", price: 76, category: "desserts", subcategory: "Composez Votre Glace" },
                          
                          
                        
                
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

 
  // ---------------------------------------------------

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();

    // Global search: ignore activeCat once user types
    if (q) {
      return MENU_ITEMS.filter((i: MenuItem) => {
        const txt: ItemText = tItem(i.id);
        const haystack = (
          txt.name +
          " " +
          (txt.desc || "") +
          " " +
          (tSubcat(i.subcategory) || "")
        ).toLowerCase();
        return haystack.includes(q.toLowerCase());
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
                  href="https://www.snapchat.com/@woods.tanger"
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
import { ComponentType, SVGProps } from "react";
function DrawerLink({
  icon: Icon,
  label,
  onClick,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
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
