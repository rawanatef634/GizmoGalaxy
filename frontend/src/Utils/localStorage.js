// Add a product to localStorage 

export const addFavoriteToLocalStorage = (product) => {
    const favorites = getFavoritesFromLocalStorage();
    if (!favorites.some((p) => p._id === product._id)) {
        favorites.push(product);
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }
}

// Remove a product from localStorage
export const removeFavoriteFromLocalStorage = (product) => {
    const favorites = getFavoritesFromLocalStorage();
    const updatedFavorites = favorites.filter(
        (product) => product._id !== product._id
    );
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
}

// Retrieve favorites from localStorage
export const getFavoritesFromLocalStorage = () => {
    const favorites = localStorage.getItem("favorites");
    return favorites ? JSON.parse(favorites) : [];
}