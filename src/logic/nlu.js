export class NLU {
    constructor() {
        this.patterns = {
            pax: /(\d+)\s*(명|people|pax|persons?|인|분)/i,
            luggage: /(\d+)\s*(carriers?|luggage|bags?|짐|캐리어|가방)/i,
            purpose: {
                'airport_transfer': ['airport', 'transfer', 'pickup', 'sending', '공항', '픽업', '샌딩'],
                'sightseeing': ['tour', 'sightseeing', 'trip', 'travel', '투어', '관광', '여행'],
                'corporate': ['corporate', 'business', 'executive', '의전', '비즈니스', '출장'],
                'production': ['wedding', 'production', 'shooting', '웨딩', '촬영'],
                'point_to_point': ['shuttle', 'point', 'shutle', '이동', '셔틀']
            },
            locations: ['seoul', 'busan', 'jeju', 'incheon', 'dmz', 'gyeongju', '서울', '부산', '제주', '인천', '경주', '강원', '평창']
        };
    }

    parseInput(text, context) {
        if (!text) return {};

        const result = {};

        // 1. Extract Pax
        const paxMatch = text.match(this.patterns.pax);
        if (paxMatch) {
            result.pax = parseInt(paxMatch[1]);
        }

        // 2. Extract Luggage
        const lugMatch = text.match(this.patterns.luggage);
        if (lugMatch) {
            result.luggage = parseInt(lugMatch[1]);
        }

        // 3. Extract Purpose
        for (const [key, keywords] of Object.entries(this.patterns.purpose)) {
            if (keywords.some(k => text.toLowerCase().includes(k))) {
                result.purpose = key; // this maps to locales key like 'purpose_sightseeing'
                // The actual key in context is localized text usually, but flow uses internal keys or text match
                // Let's store internal key for flow logic to map
                result.purposeKey = key;
                break;
            }
        }

        // 4. Extract Potential Location
        // Simple heuristic: if we find a known city, treat it as destination if purpose is tour
        // Or if pattern contains "to [Loc]" or "[Loc] tour"
        const lowerText = text.toLowerCase();
        const foundLoc = this.patterns.locations.find(l => lowerText.includes(l));
        if (foundLoc) {
            // Check context to decide if it's start or dest.
            // If strictly "tour", implicitly Dest is the region.
            // Or if text matches "from X to Y", complex.
            // For now, if "Tour" intent is present, foundLoc is likely Destination.
            if (result.purposeKey === 'sightseeing' || (!result.purposeKey && lowerText.includes('tour'))) {
                result.destinationQuery = foundLoc;
            } else if (lowerText.includes('airport')) {
                // If "Incheon/Gimpo Airport", it implies Start (pickup) or Dest (sending).
                // Hard to guess without "from/to" preposition parsing.
                // Let's just treat foundLoc as a potential candidate for current step search if active.
            }
            // Just returning it as a generic entity for Flow to decide
            result.locationEntity = foundLoc;
        }

        return result;
    }
}

export const nlu = new NLU();
export default nlu;
