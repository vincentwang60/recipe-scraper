declare interface Ingredient {
    amount: string;
    unit: string;
    name: string;
    notes: string;
}

declare interface Recipe {
    _id: string;
    ingredients: Ingredient[];
    steps: string[];
}
