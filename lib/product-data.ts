export type ProductTier = "Gratis" | "Viajero" | "Grupo Pro";
export type ProductStatus = "Built" | "Planned";

export type ProductFeature = {
  name: string;
  description: string;
  tier: ProductTier;
  status: ProductStatus;
  note?: string;
};

export const PRODUCT_FEATURES: ProductFeature[] = [
  {
    name: "Trip Starter",
    description: "Start a group trip with a simple, template-based plan.",
    tier: "Gratis",
    status: "Built",
    note: "Template-based, simulated (not AI)",
  },
  {
    name: "Save trip starters",
    description: "Keep your trip starter plans available for later.",
    tier: "Gratis",
    status: "Built",
  },
  {
    name: "Personalized tips by destination, interests and group size",
    description: "Get trip tips shaped around your destination and group.",
    tier: "Viajero",
    status: "Planned",
    note: "From human validation, Sep 25",
  },
  {
    name: "Expense splitting",
    description: "Track shared trip costs and who owes what.",
    tier: "Viajero",
    status: "Planned",
  },
  {
    name: "Reservations storage",
    description: "Keep your group's reservation details in one place.",
    tier: "Viajero",
    status: "Planned",
  },
  {
    name: "Day-by-day itinerary",
    description: "Organize your group plans into a shared daily itinerary.",
    tier: "Grupo Pro",
    status: "Planned",
  },
  {
    name: "Multiple organizers + trip reports",
    description: "Plan together with co-organizers and review trip reports.",
    tier: "Grupo Pro",
    status: "Planned",
  },
];
