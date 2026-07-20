const NOMI_CATEGORIE = {
    "men's clothing": "Abbigliamento uomo",
    "women's clothing": "Abbigliamento donna",
    "jewelery": "Gioielli",
    "electronics": "Elettronica",
};

export const traduciCategoria = (cat) => NOMI_CATEGORIE[cat] ?? cat;

const CATEGORIE_CON_TAGLIA = ["men's clothing", "women's clothing"];
export const richiedeTaglia = (cat) => CATEGORIE_CON_TAGLIA.includes(cat);
export const TAGLIE_DISPONIBILI = ["S", "M", "L", "XL", "XXL"];
