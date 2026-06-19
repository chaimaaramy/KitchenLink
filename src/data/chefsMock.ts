// src/data/chefsMock.ts
// Données fictives partagées par tous les composants du module Réseau.
// Ajout du champ email pour la compatibilité avec le backend et ChatWindow.

export interface Chef {
  id: string
  name: string
  specialty: string
  restaurant: string
  city: string
  avatar: string
  bio: string
  email: string       // ← ajouté pour la messagerie backend
  followers: string[]
  following: string[]
}

export const chefsMock: Chef[] = [
  {
    id: "1",
    name: "Marie Dupont",
    specialty: "Pâtisserie",
    restaurant: "La Maison Sucrée",
    city: "Paris",
    email: "marie@cheflink.com",
    avatar: "https://i.pravatar.cc/150?img=47",
    bio: "Passionnée de pâtisserie française depuis 15 ans.",
    followers: ["2", "3"],
    following: ["2", "4"],
  },
  {
    id: "2",
    name: "Karim Benali",
    specialty: "Cuisine méditerranéenne",
    restaurant: "Saveurs du Sud",
    city: "Marseille",
    email: "karim@cheflink.com",
    avatar: "https://i.pravatar.cc/150?img=12",
    bio: "Chef méditerranéen, amoureux des produits du terroir.",
    followers: ["1", "4"],
    following: ["1", "3"],
  },
  {
    id: "3",
    name: "Sophie Martin",
    specialty: "Cuisine japonaise",
    restaurant: "Sakura Table",
    city: "Lyon",
    email: "sophie@cheflink.com",
    avatar: "https://i.pravatar.cc/150?img=32",
    bio: "Formée à Tokyo, je revisite la cuisine japonaise à la française.",
    followers: ["1", "2", "5"],
    following: ["2", "5"],
  },
  {
    id: "4",
    name: "Ahmed Khalid",
    specialty: "Gastronomie marocaine",
    restaurant: "Riad des Saveurs",
    city: "Casablanca",
    email: "ahmed@cheflink.com",
    avatar: "https://i.pravatar.cc/150?img=65",
    bio: "Chef étoilé spécialisé dans la haute cuisine marocaine.",
    followers: ["1", "3"],
    following: ["1", "5"],
  },
  {
    id: "5",
    name: "Lucie Bernard",
    specialty: "Cuisine végétale",
    restaurant: "Le Jardin Vivant",
    city: "Bordeaux",
    email: "lucie@cheflink.com",
    avatar: "https://i.pravatar.cc/150?img=25",
    bio: "Convaincue que la cuisine végétale peut être gastronomique.",
    followers: ["3", "4"],
    following: ["3", "4"],
  },
  {
    id: "6",
    name: "Youssef El Amine",
    specialty: "Street food créative",
    restaurant: "Urban Bite",
    city: "Rabat",
    email: "youssef@cheflink.com",
    avatar: "https://i.pravatar.cc/150?img=59",
    bio: "Je transforme la street food en art culinaire.",
    followers: [],
    following: [],
  },
]