// Google Maps API Geocoding
const GOOGLE_API_KEY = 'AIzaSyA5zQlY7fk6ShSckdd2giP3jQhkbLG2Css';

export const searchAddress = async (query) => {
    if (!query) return [];

    try {
        // Use proxy '/google-maps' -> 'https://maps.googleapis.com'
        // Use Places Text Search API for better POI finding (returns lists)
        // region=kr biases results to Korea
        const response = await fetch(`/google-maps/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}&language=ko&region=kr`);
        const data = await response.json();

        if (data.status === 'OK' && data.results) {
            return data.results.map(item => {
                return {
                    name: item.name || item.formatted_address,
                    address: item.formatted_address,
                    lat: item.geometry.location.lat,
                    lng: item.geometry.location.lng,
                    originalText: item.formatted_address
                };
            });
        } else {
            console.warn("Google Places API failed:", data.status, data.error_message);
            return [];
        }
    } catch (e) {
        console.error("Google Search Error:", e);
        return [];
    }
};
