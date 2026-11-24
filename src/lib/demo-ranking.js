export const demoCategories = [
  {
    id: "hamburguesas",
    label: "Hamburguesas",
    image: "/iconos/HAMBURGUESAS.png",
  },
  { id: "arepas", label: "Arepas", image: "/iconos/AREPAS.png" },
  { id: "pizzas", label: "Pizzas", image: "/iconos/PIZZAS.png" },
  {
    id: "pollo-frito",
    label: "Pollo frito",
    image: "/iconos/POLLO_FRITO.png",
  },
];

function demoProduct(id, name, emoji, price, score, ratingsCount) {
  return { id, name, emoji, image: "", price, score, ratingsCount };
}

export const demoRanking = {
  hamburguesas: [
    {
      position: 1,
      product: demoProduct("demo-burger-1", "La Bicentenaria", "🍔", 7, 4.7, 75),
      business: { name: "Sabor Coriano", sector: "Norte" },
    },
    {
      position: 2,
      product: demoProduct("demo-burger-2", "Doble Falcón", "🍔", 8, 4.5, 62),
      business: { name: "Burger del Centro", sector: "Centro" },
    },
    {
      position: 3,
      product: demoProduct("demo-burger-3", "Smash 24", "🍔", 6, 4.3, 57),
      business: { name: "Smash Coro", sector: "Sur" },
    },
  ],
  arepas: [
    {
      position: 1,
      product: demoProduct(
        "demo-arepa-1",
        "Arepa de queso de mano",
        "🫓",
        3,
        4.8,
        88,
      ),
      business: { name: "Arepera Doña Rosa", sector: "Norte" },
    },
    {
      position: 2,
      product: demoProduct("demo-arepa-2", "Reina pepiada", "🫓", 4, 4.6, 64),
      business: { name: "La Coriana", sector: "Centro" },
    },
    {
      position: 3,
      product: demoProduct(
        "demo-arepa-3",
        "Arepa de pabellón",
        "🫓",
        4,
        4.4,
        51,
      ),
      business: { name: "Sabor Norte", sector: "Norte" },
    },
  ],
  pizzas: [
    {
      position: 1,
      product: demoProduct(
        "demo-pizza-1",
        "Margarita de la casa",
        "🍕",
        10,
        4.7,
        71,
      ),
      business: { name: "Horno Falconiano", sector: "Centro" },
    },
    {
      position: 2,
      product: demoProduct(
        "demo-pizza-2",
        "Pepperoni artesanal",
        "🍕",
        12,
        4.5,
        58,
      ),
      business: { name: "Pizza Médano", sector: "Norte" },
    },
    {
      position: 3,
      product: demoProduct("demo-pizza-3", "Cuatro quesos", "🍕", 13, 4.3, 46),
      business: { name: "La Leña", sector: "Sur" },
    },
  ],
  "pollo-frito": [
    {
      position: 1,
      product: demoProduct("demo-pollo-1", "Pollo crispy", "🍗", 5, 4.6, 67),
      business: { name: "El Crujiente", sector: "Centro" },
    },
    {
      position: 2,
      product: demoProduct("demo-pollo-2", "Alitas BBQ", "🍗", 6, 4.4, 53),
      business: { name: "Sabor 24", sector: "Sur" },
    },
    {
      position: 3,
      product: demoProduct(
        "demo-pollo-3",
        "Pollo a la brasa",
        "🍗",
        8,
        4.2,
        44,
      ),
      business: { name: "Don Pollo", sector: "Norte" },
    },
  ],
};
