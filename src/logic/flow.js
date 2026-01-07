
import { recommendVehicle, getSuitableVehicles, VEHICLE_TYPES } from './vehicle';
import { calculateFare, formatCurrency } from './pricing';
import { PRESET_TOURS, UPSELL_ITEMS } from './data';
import { searchAddress } from './geocoding';
import nlu from './nlu';

// Conversation Steps enum
export const STEPS = {
    GREETING: 'greeting',
    ASK_LANGUAGE: 'ask_language',
    ASK_PURPOSE: 'ask_purpose',
    ASK_AIRPORT_START_CHECK: 'ask_airport_start_check',
    ASK_START: 'ask_start',
    ASK_WAYPOINTS: 'ask_waypoints',
    ASK_DESTINATION: 'ask_destination',
    ASK_PAX: 'ask_pax',
    ASK_LUGGAGE: 'ask_luggage',
    PROPOSAL: 'proposal',
    OPTIMIZATION: 'optimization',
    UPSELL: 'upsell',
    CONFIRM: 'confirm',
    PRESET_ASK_LUGGAGE: 'preset_ask_luggage',
    PRESET_ASK_START: 'preset_ask_start',
    PRESET_ASK_END: 'preset_ask_end'
};

const TRANSLATIONS = {
    'en': {
        greeting: "Hello! I'm TourMaker AI, your Korea travel guide. 🇰🇷✨\nFirst, please select your language.",
        ask_purpose: "Welcome! What brings you to Korea?",
        purpose_airport_transfer: "Airport Transfer ✈️",
        purpose_sightseeing: "Sightseeing bei tour 🏯",
        purpose_point_to_point: "Point-to-Point 🚗",
        purpose_production: "Production/Filming 🎬",
        purpose_corporate: "Corporate/Business 💼",
        purpose_other: "Other",
        purpose_selected: "I see, [PURPOSE]! Let's plan that.",

        ask_airport_start_check: "Are you starting from the airport?",
        ask_start_airport: "Please select the airport.",
        ask_start_general: "Where are you starting from? (e.g. Hotel name, Address)",
        ask_start: "Where would you like to start?",
        start_confirmed: "[LOCATION] confirmed! ✅\n\nDo you have any waypoints? (e.g., Myeongdong)",

        ask_waypoints_empty: "Any stops in between? Or just 'None' to skip.",
        ask_waypoints_added: "Added [LOCATION] to waypoints. Any others? (Type 'Done' if finished)",
        waypoints_finished: "Waypoints set. Finally, where is your destination?",

        ask_destination: "Where is your final destination?",
        dest_confirmed: "[LOCATION] set as destination. 🏁",

        route_confirmed: "Route confirmed! 🗺️\n[START] ➡️ [DEST]\nTotal Distance: [DISTANCE] ([DURATION])",

        ask_pax: "How many passengers will be traveling? 👥",
        pax_confirmed: "[PAX] passengers. Got it.",

        ask_luggage: "How many pieces of standard luggage (24-inch) do you have? 🧳",

        proposal: "Based on your needs, I recommend the [VEHICLE]. 🚐\n\nItinerary:\nstart: [START]\ndest: [DEST]\nTotal: [DISTANCE]\n\nEstimated Quote: [PRICE] KRW (approx.)",

        error_search: "I couldn't find that location. Please try a specific name or address. 🔍",
        multiple_results: "I found [COUNT] places for '[QUERY]'. Please select one:",
        error_no_vehicle: "Apologies, we don't have a single vehicle for that many passengers/luggage. Please contact support context for bus arrangement.",
        error_impossible_route: "We cannot drive between these locations (e.g. Mainland <-> Jeju Island). Please check your route. 🚫",

        vehicle_changed: "Updated vehicle to [VEHICLE].",
        ask_alternative: "Here are other suitable vehicles:",

        optimization: "Would you like to proceed with this vehicle? Or do you need to add anything else (e.g. Guide)?",

        confirm_payment: "Great! Please use the link below to verify your booking and pay.",
        confirm_help: "No problem. Let me know if you have questions.",

        btn_yes: "Yes",
        btn_no: "No",
        btn_none: "None / Skip",
        btn_done: "Done",
        btn_keep: "Keep Current Vehicle",
        btn_payment: "Proceed to Payment",

        map_view: "Here is the route map.",

        preset_greeting_ask_luggage: "I see, a [TOUR_NAME] tour! With that many people, luggage matters. How many bags do you have?",
        preset_ask_start: "Got it. Where are you starting from?",
        preset_ask_end: "Where should we drop you off after the tour?",
        btn_same_as_start: "Same as Start Location",
        preset_proposal_details: "I recommend the [VEHICLE]. 🚐\n\nItinerary: [TOUR_NAME] Tour\nStart: [START]\nRoute: ([ROUTE_DESC])\nDistance: [DISTANCE]\nDrop-off: [DEST]\n\nEst. Quote: [PRICE] (Based on distance/time)\nIncluded: Vehicle, Driver, Tolls, Fuel, Parking\nExcluded: Overtime 20,000krw/hr\nFree cancellation within 24h of booking."
    },
    'ko': {
        greeting: "안녕하세요! 한국 여행 가이드 TourMaker AI입니다. 🇰🇷✨\n먼저 언어를 선택해주세요.",
        ask_purpose: "환영합니다! 어떤 목적으로 방문하시나요?",
        purpose_airport_transfer: "공항 픽업/샌딩 ✈️",
        purpose_sightseeing: "관광 투어 🏯",
        purpose_point_to_point: "단순 이동 🚗",
        purpose_production: "방송/촬영 🎬",
        purpose_corporate: "기업 행사/비즈니스 💼",
        purpose_other: "기타",
        purpose_selected: "[PURPOSE]이시군요! 알겠습니다.",

        ask_airport_start_check: "공항에서 출발하시나요?",
        ask_start_airport: "출발 공항을 선택해주세요.",
        ask_start_general: "어디서 출발하시나요? (호텔명, 주소 등)",
        ask_start: "출발지를 알려주세요.",
        start_confirmed: "[LOCATION] 확인되었습니다! ✅\n\n경유지가 있으신가요? (예: 명동)",

        ask_waypoints_empty: "중간에 들를 곳이 있나요? 없으시면 '없음'을 선택해주세요.",
        ask_waypoints_added: "[LOCATION]을(를) 경유지에 추가했습니다. 더 있으신가요? (완료되면 '완료')",
        waypoints_finished: "경유지 설정 완료. 마지막으로 도착지는 어디인가요?",

        ask_destination: "최종 목적지는 어디인가요?",
        dest_confirmed: "[LOCATION] 도착지로 설정됨. 🏁",

        route_confirmed: "경로 확인! 🗺️\n[START] ➡️ [DEST]\n총 거리: [DISTANCE] ([DURATION])",

        ask_pax: "총 탑승 인원은 몇 명인가요? 👥",
        pax_confirmed: "[PAX]명 확인했습니다.",

        ask_luggage: "수하물(24인치 기준)은 몇 개인가요? 🧳",

        proposal: "고객님의 일정에 [VEHICLE] 차량을 추천합니다. 🚐\n\n일정:\n출발: [START]\n도착: [DEST]\n총 운행: [DISTANCE]\n\n예상 견적: [PRICE] 원",

        error_search: "장소를 찾을 수 없습니다. 정확한 명칭이나 주소를 입력해주세요. 🔍",
        multiple_results: "'[QUERY]'에 대해 [COUNT]건이 검색되었습니다. 선택해주세요:",
        error_no_vehicle: "죄송합니다. 해당 인원/짐을 수용할 차량이 없습니다. 대형 버스는 별도 문의 바랍니다.",
        error_impossible_route: "차량으로 이동할 수 없는 경로입니다 (예: 내륙 <-> 제주). 경로를 확인해주세요. 🚫",

        vehicle_changed: "차량을 [VEHICLE](으)로 변경했습니다.",
        ask_alternative: "다른 이용 가능한 차량입니다:",

        optimization: "이 차량으로 예약하시겠습니까? 아니면 가이드 등 추가 옵션이 필요하신가요?",

        confirm_payment: "좋습니다! 아래 링크를 통해 예약을 확정하고 결제해주세요.",
        confirm_help: "알겠습니다. 궁금한 점이 있으시면 말씀해주세요.",

        btn_yes: "네",
        btn_no: "아니요",
        btn_none: "없음 / 건너뛰기",
        btn_done: "완료",
        btn_keep: "현재 차량 유지",
        btn_payment: "결제 진행",

        btn_payment: "결제 진행",

        map_view: "경로 지도입니다.",

        preset_greeting_ask_luggage: "네, [TOUR_NAME] 투어시군요! 6명이시면 짐의 양에 따라 차량 선택이 중요합니다. 혹시 가지고 계신 캐리어는 몇 개 정도일까요?",
        preset_ask_start: "확인했습니다. 그럼 어디에서 출발하시나요? (예: 부산역, 공항)",
        preset_ask_end: "투어 종료 후 내려드릴 장소는 어디인가요?",
        preset_proposal_details: "고객님의 일정에 [VEHICLE] 차량을 추천합니다. 🚐\n\n일정: [TOUR_NAME] 투어 (09:00~18:00 기준)\n출발: [START]\n일정: ([ROUTE_DESC])\n이동거리: [DISTANCE]\n도착: [DEST]\n\n예상견적: [PRICE] (이동거리와, 차량 대여 시간에 맞춘 예상견적입니다.)\n포함 사항: 차량, 운전기사, 톨비, 연료비, 주차비\n불포함 사항: 오버타임 20,000krw/시간\n취소비용: 예약 후 24시간 이내 무료 취소가능",
        btn_same_as_start: "출발지와 동일"
    }
};

export class TourAgent {
    constructor() {
        this.step = STEPS.GREETING;
        this.context = {
            language: 'en', // Default
            purpose: null,
            pax: 0,
            luggage: 0,
            route: {
                start: null,
                waypoints: [],
                destination: null
            },
            vehicle: null,
            price: 0,
            presetId: null
        };
        this.history = [];
    }

    savePoint() {
        this.history.push({
            step: this.step,
            context: JSON.parse(JSON.stringify(this.context))
        });
    }

    restorePoint() {
        if (this.history.length === 0) return false;
        const snapshot = this.history.pop();
        this.step = snapshot.step;
        this.context = snapshot.context;
        return true;
    }

    // Localization Helper
    t(key, params = {}) {
        const lang = this.context.language || 'en';
        let text = TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en'][key] || key;

        // Simple interpolation [KEY]
        Object.keys(params).forEach(k => {
            text = text.replace(`[${k.toUpperCase()}]`, params[k]);
        });
        return text;
    }

    // Helper to format "Name (Address)"
    formatLocation(loc) {
        if (!loc) return '';
        // If name matches address (e.g. typing specific address), don't repeat
        if (loc.name === loc.address) return loc.name;
        return `${loc.name} (${loc.address})`;
    }

    // Helper to check if location is in Jeju
    isJejuLocation(loc) {
        if (!loc) return false;
        // Use .address as returned by searchAddress
        const str = (loc.address || loc.name || "").toLowerCase();
        return str.includes('jeju') || str.includes('제주') || str.includes('seogwipo') || str.includes('서귀포');
    }

    // Helper to validate route (Impossible Route Check)
    validateRoute(start, dest) {
        const startIsJeju = this.isJejuLocation(start);
        const destIsJeju = this.isJejuLocation(dest);

        if (startIsJeju !== destIsJeju) {
            // One is Jeju, one is not -> Impossible for car
            let errorMsg = this.t('error_impossible_route');
            if (!errorMsg || errorMsg === 'error_impossible_route') {
                errorMsg = "We cannot drive between these locations (e.g. Mainland <-> Jeju Island). Please check your route. 🚫";
            }
            return errorMsg;
        }
        return null;
    }

    // Dynamic Step Resolution (Slot Filling)
    resolveNextStep() {
        // Checks what is missing in context and returns the next appropriate logic
        if (!this.context.purpose) return STEPS.ASK_PURPOSE;

        // Check for Airport Start Confirmation
        if (this.context.purpose === this.t('purpose_airport_transfer') && this.context.isAirportPickup === undefined) {
            return STEPS.ASK_AIRPORT_START_CHECK;
        }

        if (!this.context.route.start) return STEPS.ASK_START;

        // Waypoints logic:
        if (this.step === STEPS.ASK_WAYPOINTS) return STEPS.ASK_WAYPOINTS;
        if (this.step === STEPS.ASK_DESTINATION) return STEPS.ASK_DESTINATION;

        // If we represent Step 4 as ASK_WAYPOINTS, we only go there if not skipped.
        // But here we just check if destination is missing.
        if (!this.context.route.destination) {
            // Flow: Start -> Waypoints -> Destination
            return STEPS.ASK_WAYPOINTS;
        }

        if (this.context.pax === 0) return STEPS.ASK_PAX;
        if (this.context.luggage === 0) return STEPS.ASK_LUGGAGE;

        // All main slots filled?
        return STEPS.PROPOSAL;
    }

    async process(input) {
        // Handle "Back" Command (Removed logic for simplicity in this artifact, utilizing history if needed)
        if (this.step !== STEPS.GREETING && input && input.length > 0) {
            this.savePoint();
        }

        // 1. Handle "Address Selection" (Hidden Message)
        if (input && input.startsWith('SELECTED_ADDRESS:')) {
            try {
                const jsonStr = input.replace('SELECTED_ADDRESS:', '');
                const selectedLoc = JSON.parse(jsonStr);

                // Address selection logic
                if (this.step === STEPS.ASK_START) {
                    this.context.route.start = { ...selectedLoc, originalText: selectedLoc.name };
                    this.step = STEPS.ASK_WAYPOINTS;
                    return {
                        text: this.t('start_confirmed', { location: this.formatLocation(selectedLoc) }),
                        data: { type: 'quick_replies', items: [this.t('btn_none')] }
                    };
                } else if (this.step === STEPS.ASK_WAYPOINTS) {
                    this.context.route.waypoints.push({ ...selectedLoc, originalText: selectedLoc.name });
                    return {
                        text: this.t('ask_waypoints_added', { location: this.formatLocation(selectedLoc) }),
                        data: { type: 'quick_replies', items: [this.t('btn_done')] }
                    };
                } else if (this.step === STEPS.ASK_DESTINATION) {
                    // Validate Route before setting
                    const errorMsg = this.validateRoute(this.context.route.start, selectedLoc);
                    if (errorMsg) {
                        return {
                            text: errorMsg,
                            data: null
                        };
                    }

                    this.context.route.destination = { ...selectedLoc, originalText: selectedLoc.name };

                    // Slot Filling check: Do we have Pax?
                    if (this.context.pax > 0) {
                        this.step = STEPS.ASK_LUGGAGE; // Skip Pax ask
                        // If Luggage also filled?
                        if (this.context.luggage > 0) {
                            // Go straight to Proposal (need to trigger logic)
                            this.step = STEPS.PROPOSAL;
                            return this.process(""); // Recursive call
                        }
                    } else {
                        this.step = STEPS.ASK_PAX;
                    }

                    return {
                        text: this.t('dest_confirmed', { location: this.formatLocation(selectedLoc) }),
                        data: null
                    };
                }
            } catch (e) {
                console.error("Address parse error", e);
            }
        }

        // Standard Input Processing
        let text = input ? input.trim().normalize('NFC') : "";
        let stepChangedViaNLU = false;

        // --- NLU integration ---
        // Parse input for entities regardless of current step
        if (this.step !== STEPS.GREETING && this.step !== STEPS.ASK_LANGUAGE && text) {
            const entities = nlu.parseInput(text, this.context);
            if (entities.pax) this.context.pax = entities.pax;
            if (entities.luggage) this.context.luggage = entities.luggage;

            // Special Intent: Preset Tour (Consultation Flow)
            // Check for Busan OR Nami/Gapyeong
            // Condition: Pax >= 4, Sightseeing purpose, current Step Ask Purpose
            if (entities.pax >= 4 && entities.purposeKey === 'sightseeing' && this.step === STEPS.ASK_PURPOSE) {
                let presetId = null;
                const locLower = entities.locationEntity ? entities.locationEntity.toLowerCase() : "";

                if (locLower.includes('busan') || locLower.includes('부산')) {
                    presetId = 'busan-full';
                } else if (locLower.includes('nami') || locLower.includes('gapyeong') || locLower.includes('남이') || locLower.includes('가평')) {
                    presetId = 'seoul-nami';
                }

                if (presetId) {
                    // Auto-switch language if Korean detected
                    if (text.match(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/)) {
                        this.context.language = 'ko';
                    }

                    this.context.pax = entities.pax;
                    this.context.purpose = this.t('purpose_sightseeing');
                    this.context.presetId = presetId;

                    this.step = STEPS.PRESET_ASK_LUGGAGE;

                    const tourName = presetId === 'busan-full' ? (this.context.language === 'ko' ? "부산" : "Busan") : (this.context.language === 'ko' ? "가평/남이섬" : "Gapyeong/Nami");

                    return {
                        text: this.t('preset_greeting_ask_luggage', { tour_name: tourName }),
                        data: null
                    };
                }
            }



            if (entities.purposeKey) {
                const purposes = {
                    'airport_transfer': this.t('purpose_airport_transfer'),
                    'sightseeing': this.t('purpose_sightseeing'),
                    'point_to_point': this.t('purpose_point_to_point'),
                    'production': this.t('purpose_production'),
                    'corporate': this.t('purpose_corporate'),
                    'other': this.t('purpose_other')
                };
                if (purposes[entities.purposeKey]) {
                    this.context.purpose = purposes[entities.purposeKey];
                }
            }
            // If location entity found, we might want to use it
            if (entities.destinationQuery && !this.context.route.destination) {
                this.context.pendingDestQuery = entities.destinationQuery;
            }
        }
        // -----------------------

        // Dynamic Step Resolution / Auto-Skip
        const gatheringSteps = [
            STEPS.ASK_PURPOSE, STEPS.ASK_START, STEPS.ASK_WAYPOINTS,
            STEPS.ASK_DESTINATION, STEPS.ASK_PAX, STEPS.ASK_LUGGAGE
        ];

        if (gatheringSteps.includes(this.step) || (this.step === STEPS.OPTIMIZATION && this.context.pendingDestQuery)) {
            const idealStep = this.resolveNextStep();

            if (this.step !== idealStep) {
                // Special handling for Pending Destination (Busan)
                if (this.context.pendingDestQuery && idealStep === STEPS.ASK_DESTINATION) {
                    this.step = STEPS.ASK_DESTINATION;
                    text = "";
                } else if (this.step !== idealStep) {
                    this.step = idealStep;
                    text = ""; // Clear text to avoid double processing
                    stepChangedViaNLU = true;
                }
            }
        }

        // -----------------------

        let responseText = '';
        let nextStep = this.step;
        let data = null;

        switch (this.step) {
            case STEPS.GREETING:
                responseText = this.t('greeting');
                data = {
                    type: 'quick_replies',
                    items: ['English', '한국어']
                };
                nextStep = STEPS.ASK_LANGUAGE;
                break;

            case STEPS.ASK_LANGUAGE:
                if (text.toLowerCase().includes('korean') || text === '한국어') {
                    this.context.language = 'ko';
                } else {
                    this.context.language = 'en';
                }
                responseText = this.t('ask_purpose');
                data = {
                    type: 'quick_replies',
                    items: [
                        this.t('purpose_airport_transfer'),
                        this.t('purpose_sightseeing'),
                        this.t('purpose_point_to_point'),
                        this.t('purpose_production'),
                        this.t('purpose_corporate'),
                        this.t('purpose_other')
                    ]
                };
                nextStep = STEPS.ASK_PURPOSE;
                break;

            case STEPS.ASK_PURPOSE:
                if (!text) {
                    responseText = this.t('ask_purpose');
                    data = {
                        type: 'quick_replies',
                        items: [
                            this.t('purpose_airport_transfer'),
                            this.t('purpose_sightseeing'),
                            this.t('purpose_point_to_point'),
                            this.t('purpose_production'),
                            this.t('purpose_corporate'),
                            this.t('purpose_other')
                        ]
                    };
                    break;
                }
                this.context.purpose = text;
                responseText = this.t('purpose_selected', { purpose: text });

                // If Purpose is Airport Transfer, go to confirmation check
                if (text === this.t('purpose_airport_transfer')) {
                    nextStep = STEPS.ASK_AIRPORT_START_CHECK;
                    responseText += "\n\n" + this.t('ask_airport_start_check');
                    data = { type: 'quick_replies', items: [this.t('btn_yes'), this.t('btn_no')] };
                } else {
                    nextStep = STEPS.ASK_START;
                }
                break;

            case STEPS.PRESET_ASK_LUGGAGE: {
                const luggage = parseInt(text.replace(/[^0-9]/g, ''));
                if (isNaN(luggage)) {
                    const lugMatch = text.match(/(\d+)\s*(carriers?|luggage|bags?|짐|캐리어|가방)/i);
                    if (lugMatch) this.context.luggage = parseInt(lugMatch[1]);
                    else {
                        // fallback or ask again logic if strict, but user wants smoothness.
                        // We will just break to standard fallback or assume 0 for now?
                        // Actually let's assume valid answer expected.
                        responseText = this.t('ask_luggage');
                        break;
                    }
                } else {
                    this.context.luggage = luggage;
                }

                this.step = STEPS.PRESET_ASK_START;
                return {
                    text: this.t('preset_ask_start'),
                    data: null
                };
            }

            case STEPS.PRESET_ASK_START: {
                // User responds with Start
                if (text) {
                    const candidates = await searchAddress(text);
                    if (candidates && candidates.length > 0) {
                        this.context.route.start = { ...candidates[0], originalText: text };
                    }
                    if (!this.context.route.start) {
                        // Default start based on Preset
                        const def = this.context.presetId === 'busan-full' ? "Busan Station" : "Seoul Station";
                        const defaultStart = await searchAddress(def);
                        if (defaultStart && defaultStart.length > 0) this.context.route.start = defaultStart[0];
                    }
                }

                // Ask for Drop-off
                this.step = STEPS.PRESET_ASK_END;
                return {
                    text: this.t('preset_ask_end'),
                    data: { type: 'quick_replies', items: [this.t('btn_same_as_start')] }
                };
            }

            case STEPS.PRESET_ASK_END: {
                // Determine Drop-off Location
                if (text === this.t('btn_same_as_start') || text === '출발지와 동일') {
                    this.context.route.destination = { ...this.context.route.start };
                } else if (text) {
                    const candidates = await searchAddress(text);
                    if (candidates && candidates.length > 0) {
                        this.context.route.destination = { ...candidates[0], originalText: text };
                    }
                }

                if (!this.context.route.destination && this.context.route.start) {
                    this.context.route.destination = { ...this.context.route.start };
                }
                if (!this.context.route.destination) {
                    const def = this.context.presetId === 'busan-full' ? "Busan Station" : "Seoul Station";
                    const defaultDest = await searchAddress(def);
                    this.context.route.destination = defaultDest[0];
                }

                // Auto-fill Preset Waypoints
                const getLoc = async (q) => { const r = await searchAddress(q); return r[0]; };
                let presetWps = [];
                let routeDesc = "";
                let tourName = "";

                if (this.context.presetId === 'busan-full') {
                    tourName = this.context.language === 'ko' ? "부산" : "Busan";
                    const wp1 = await getLoc("Haeundae Beach");
                    const wp2 = await getLoc("Gwangalli Beach");
                    const wp3 = await getLoc("Taejongdae");
                    const wp4 = await getLoc("Gamcheon Culture Village");
                    if (wp1) presetWps.push(wp1);
                    if (wp2) presetWps.push(wp2);
                    if (wp3) presetWps.push(wp3);
                    if (wp4) presetWps.push(wp4);
                    routeDesc = "Haeundae -> Gwangalli -> Taejongdae -> Gamcheon";
                } else if (this.context.presetId === 'seoul-nami') {
                    tourName = this.context.language === 'ko' ? "가평/남이섬" : "Gapyeong/Nami";
                    const wp1 = await getLoc("Nami Island");
                    const wp2 = await getLoc("Petite France");
                    const wp3 = await getLoc("The Garden of Morning Calm");
                    if (wp1) presetWps.push(wp1);
                    if (wp2) presetWps.push(wp2);
                    if (wp3) presetWps.push(wp3);
                    routeDesc = "Nami Island -> Petite France -> Morning Calm";
                }

                // Push all preset waypoints
                presetWps.forEach(wp => this.context.route.waypoints.push(wp));

                // Calculate & Recommend
                const vehicle = recommendVehicle(this.context.pax, this.context.luggage);
                this.context.vehicle = vehicle;

                if (!vehicle) {
                    responseText = this.t('error_no_vehicle');
                    break;
                }

                const dist_est = this.context.presetId === 'busan-full' ? 80 : 150; // approx km
                const dur_est = 300;
                this.context.price = calculateFare(vehicle.id, dist_est, dur_est);

                // Adjust price for preset fixed rates if needed (optional)
                // For now, keep dynamic fare.

                this.step = STEPS.OPTIMIZATION;
                return [
                    {
                        text: this.t('preset_proposal_details', {
                            vehicle: vehicle.name,
                            tour_name: tourName,
                            start: this.context.route.start ? this.context.route.start.name : "Starting Point",
                            dest: this.context.route.destination ? this.context.route.destination.name : "Drop-off Point",
                            route_desc: routeDesc,
                            distance: "Full Course",
                            price: formatCurrency(this.context.price)
                        }),
                        data: { type: 'vehicle_card', vehicle: vehicle, price: this.context.price }
                    },
                    {
                        text: this.t('map_view'),
                        data: { type: 'map_view', route: this.context.route }
                    }
                ];
            }
            case STEPS.ASK_AIRPORT_START_CHECK:
                // If skipped here via NLU, text is empty. We must Ask.
                if (!text) {
                    responseText = this.t('ask_airport_start_check');
                    data = { type: 'quick_replies', items: [this.t('btn_yes'), this.t('btn_no')] };
                    break;
                }

                // User answered Yes or No
                const yes = this.t('btn_yes');
                const no = this.t('btn_no');

                if (text === yes || text.toLowerCase() === 'yes' || text === 'y') {
                    this.context.isAirportPickup = true;
                    this.step = STEPS.ASK_START; // Trigger Start prompt
                    return this.process("");
                } else if (text === no || text.toLowerCase() === 'no' || text === 'n') {
                    this.context.isAirportPickup = false;
                    this.step = STEPS.ASK_START;
                    return this.process("");
                } else {
                    // Invalid input, ask again
                    responseText = this.t('ask_airport_start_check');
                    data = { type: 'quick_replies', items: [this.t('btn_yes'), this.t('btn_no')] };
                }
                break;

            case STEPS.ASK_START:
                if (!text) {
                    // Prompting Phase
                    if (this.context.isAirportPickup) {
                        responseText = this.t('ask_start_airport');
                        data = {
                            type: 'quick_replies',
                            items: [
                                'Incheon Airport (ICN)',
                                'Gimpo Airport (GMP)',
                                'Gimhae Airport (PUS)',
                                'Jeju Airport (CJU)'
                            ]
                        };
                    } else if (this.context.isAirportPickup === false) {
                        // Explicitly NO airport pickup
                        responseText = this.t('ask_start_general');
                    } else {
                        // Default (other purposes, or skipped check)
                        responseText = this.t('ask_start');
                    }
                    break;
                }
                const startCandidates = await searchAddress(text);
                if (!startCandidates || startCandidates.length === 0) {
                    responseText = this.t('error_search');
                    break;
                }

                if (startCandidates.length > 1) {
                    responseText = this.t('multiple_results', { query: text, count: startCandidates.length });
                    data = { type: 'address_picker', items: startCandidates };
                    nextStep = STEPS.ASK_START;
                } else {
                    const startLoc = startCandidates[0];
                    this.context.route.start = { ...startLoc, originalText: text };
                    responseText = this.t('start_confirmed', { location: this.formatLocation(startLoc) });
                    data = { type: 'quick_replies', items: [this.t('btn_none')] };
                    nextStep = STEPS.ASK_WAYPOINTS;
                }
                break;

            case STEPS.ASK_WAYPOINTS:
                if (text.includes(this.t('btn_none')) || text.includes(this.t('btn_done'))) {
                    responseText = this.t('waypoints_finished');
                    nextStep = STEPS.ASK_DESTINATION;
                } else if (!text) {
                    responseText = this.t('ask_waypoints_empty');
                    data = { type: 'quick_replies', items: [this.t('btn_none')] };
                } else {
                    const wpCandidates = await searchAddress(text);
                    if (wpCandidates && wpCandidates.length > 0) {
                        if (wpCandidates.length > 1) {
                            responseText = this.t('multiple_results', { query: text, count: wpCandidates.length });
                            data = { type: 'address_picker', items: wpCandidates };
                            nextStep = STEPS.ASK_WAYPOINTS;
                        } else {
                            const waypoint = wpCandidates[0];
                            this.context.route.waypoints.push({ ...waypoint, originalText: text });
                            responseText = this.t('ask_waypoints_added', { location: this.formatLocation(waypoint) });
                            data = { type: 'quick_replies', items: [this.t('btn_done')] };
                        }
                    } else {
                        responseText = this.t('error_search');
                        data = { type: 'quick_replies', items: [this.t('btn_none')] };
                    }
                }
                break;

            case STEPS.ASK_DESTINATION:
                let query = text;
                // If we have a pending query from NLU (e.g. "Busan Tour"), use it.
                if (!query && this.context.pendingDestQuery) {
                    query = this.context.pendingDestQuery;
                    this.context.pendingDestQuery = null; // Consume perfectly
                }

                if (!query) {
                    responseText = this.t('ask_destination');
                    break;
                }

                const destCandidates = await searchAddress(query);

                if (!destCandidates || destCandidates.length === 0) {
                    responseText = this.t('error_search');
                    break;
                }

                if (destCandidates.length > 1) {
                    responseText = this.t('multiple_results', { query: query, count: destCandidates.length });
                    data = { type: 'address_picker', items: destCandidates };
                    nextStep = STEPS.ASK_DESTINATION;
                } else {
                    const destLoc = destCandidates[0];

                    // Duplicate Check: Remove from Waypoints if same as Destination
                    this.context.route.waypoints = this.context.route.waypoints.filter(wp => {
                        const isSameName = wp.name === destLoc.name;
                        const isSameAddr = wp.address && destLoc.address && wp.address === destLoc.address;
                        return !(isSameName || isSameAddr);
                    });

                    // Route Check: Impossible Route (Mainland <-> Jeju)
                    const errorMsg = this.validateRoute(this.context.route.start, destLoc);
                    if (errorMsg) {
                        return { text: errorMsg, data: null };
                    }

                    this.context.route.destination = { ...destLoc, originalText: query };

                    // Route Complete! Calculate Stats & Show Map
                    const dist = 50 + (this.context.route.waypoints.length * 30);
                    const dur = 120 + (this.context.route.waypoints.length * 60);
                    const miles = dist * 0.621371;
                    const distanceStr = `${dist}km / ${miles.toFixed(1)}mile`;
                    const durationStr = `${Math.floor(dur / 60)}h ${dur % 60}m`;

                    const startName = (this.context.route.start && this.context.route.start.name) ? this.context.route.start.name : "Start";
                    const destStr = this.formatLocation(destLoc);

                    // Fallback text construction
                    let confirmedText = this.t('route_confirmed', {
                        start: startName,
                        dest: destStr,
                        distance: distanceStr,
                        duration: durationStr
                    });

                    if (!confirmedText || confirmedText === 'route_confirmed') {
                        confirmedText = `Route Confirmed: ${startName} -> ${destStr}\nDist: ${distanceStr}`;
                    }

                    // Slot Filling check
                    let nextPrompt = this.t('ask_pax');

                    if (this.context.pax > 0) {
                        this.step = STEPS.ASK_LUGGAGE;
                        nextPrompt = this.t('pax_confirmed', { pax: this.context.pax });

                        if (this.context.luggage > 0) {
                            this.step = STEPS.PROPOSAL;
                            const proposalResponse = await this.process("");
                            const mapMsg = {
                                text: confirmedText,
                                data: { type: 'map_view', route: this.context.route }
                            };

                            if (Array.isArray(proposalResponse)) {
                                return [mapMsg, ...proposalResponse];
                            } else {
                                return [mapMsg, proposalResponse];
                            }
                        }
                    } else {
                        this.step = STEPS.ASK_PAX;
                    }

                    return [
                        {
                            text: confirmedText,
                            data: { type: 'map_view', route: this.context.route }
                        },
                        {
                            text: nextPrompt,
                            data: null
                        }
                    ];
                }
                break;

            case STEPS.ASK_PAX:
                const pax = parseInt(text.replace(/[^0-9]/g, ''));
                if (!pax || isNaN(pax)) {
                    responseText = this.t('ask_pax');
                    break;
                }
                this.context.pax = pax;
                responseText = this.t('pax_confirmed', { pax });
                nextStep = STEPS.ASK_LUGGAGE;
                break;

            case STEPS.ASK_LUGGAGE: {
                const luggage = parseInt(text.replace(/[^0-9]/g, ''));
                if (isNaN(luggage)) {
                    responseText = this.t('ask_luggage');
                    break;
                }
                this.context.luggage = luggage;

                const vehicle = recommendVehicle(this.context.pax, this.context.luggage);
                this.context.vehicle = vehicle;

                if (!vehicle) {
                    responseText = this.t('error_no_vehicle');
                    break;
                }

                const dist_calc = 50 + (this.context.route.waypoints.length * 30);
                const dur_calc = 120 + (this.context.route.waypoints.length * 60);
                this.context.price = calculateFare(vehicle.id, dist_calc, dur_calc);

                const miles_calc = dist_calc * 0.621371;
                const distanceStr_calc = `${dist_calc}km / ${miles_calc.toFixed(1)}mile`;

                this.step = STEPS.OPTIMIZATION;

                // Return two messages
                return [
                    {
                        text: this.t('proposal', {
                            vehicle: vehicle.name,
                            start: this.context.route.start.name,
                            dest: this.context.route.destination.name,
                            distance: distanceStr_calc,
                            price: formatCurrency(this.context.price)
                        }),
                        data: { type: 'vehicle_card', vehicle: vehicle, price: this.context.price }
                    },
                    {
                        text: this.t('map_view'),
                        data: { type: 'map_view', route: this.context.route }
                    }
                ];
            }

            case STEPS.PROPOSAL:
                this.step = STEPS.OPTIMIZATION;
                responseText = this.t('optimization');
                nextStep = STEPS.CONFIRM;
                break;

            case STEPS.OPTIMIZATION:
                // 1. Check if input is selecting a new vehicle
                const selectedVehicle = Object.values(VEHICLE_TYPES).find(v => input.includes(v.name) || input === v.name);
                if (selectedVehicle) {
                    this.context.vehicle = selectedVehicle;
                    const dist = 50 + (this.context.route.waypoints.length * 30);
                    const dur = 120 + (this.context.route.waypoints.length * 60);
                    this.context.price = calculateFare(selectedVehicle.id, dist, dur);

                    const miles = dist * 0.621371;
                    const distanceStr = `${dist}km / ${miles.toFixed(1)}mile`;

                    return [
                        {
                            text: this.t('vehicle_changed', { vehicle: selectedVehicle.name }),
                            data: null
                        },
                        {
                            text: this.t('proposal', {
                                vehicle: selectedVehicle.name,
                                start: this.context.route.start.name,
                                dest: this.context.route.destination.name,
                                distance: distanceStr,
                                price: formatCurrency(this.context.price)
                            }),
                            data: { type: 'vehicle_card', vehicle: selectedVehicle, price: this.context.price }
                        },
                        {
                            text: this.t('optimization'),
                            data: null
                        }
                    ];
                }

                // 2. Check for "Change Vehicle" Intent
                const changeKeywords = ['change', 'vehicle', 'car', 'van', 'bus', 'different', 'other', '차량', '변경', '다른', 'ganti', 'mobil', 'lain', 'changer', 'véhicule', 'autre', '変更', '車', '違う'];
                const isChangeRequest = changeKeywords.some(k => text.toLowerCase().includes(k));

                if (isChangeRequest) {
                    const suitable = getSuitableVehicles(this.context.pax, this.context.luggage);
                    const others = suitable.filter(v => v.id !== this.context.vehicle.id);

                    if (others.length > 0) {
                        responseText = this.t('ask_alternative');
                        const buttons = others.map(v => {
                            const dist = 50 + (this.context.route.waypoints.length * 30);
                            const dur = 120 + (this.context.route.waypoints.length * 60);
                            const newPrice = calculateFare(v.id, dist, dur);
                            const currentPrice = this.context.price;
                            const diff = newPrice - currentPrice;
                            const sign = diff >= 0 ? '+' : '';
                            return `${v.name} (${sign}${formatCurrency(diff)})`;
                        });
                        buttons.push(this.t('btn_keep'));

                        data = { type: 'quick_replies', items: buttons };
                        nextStep = STEPS.OPTIMIZATION;
                        break;
                    } else {
                        responseText = "Sorry, no other suitable vehicles found. \n" + this.t('optimization');
                        nextStep = STEPS.OPTIMIZATION;
                        break;
                    }
                }

                // Default Optimization flow
                responseText = this.t('optimization');
                nextStep = STEPS.CONFIRM;
                break;

            case STEPS.CONFIRM:
                if (text.includes(this.t('btn_payment')) || text.toLowerCase().includes('payment')) {
                    responseText = this.t('confirm_payment');
                    data = { type: 'payment_link', amount: this.context.price };
                } else {
                    responseText = this.t('confirm_help');
                }
                break;

            default:
                responseText = this.t('greeting');
                nextStep = STEPS.GREETING;
        }

        this.step = nextStep;
        return { text: responseText, data };
    }
}