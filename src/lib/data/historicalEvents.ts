/**
 * Historical nuclear events database
 * Real historical data for educational purposes
 */

export interface HistoricalEvent {
    id: string;
    name: string;
    nameId: string; // Indonesian name
    date: string;
    location: {
        lat: number;
        lon: number;
        city: string;
        country: string;
    };
    bombId: string; // References BOMB_TYPES
    casualties: {
        immediate: number;
        total: number; // Including long-term effects
    };
    description: string;
    descriptionId: string; // Indonesian description
    category: 'warfare' | 'test' | 'accident';
}

export const HISTORICAL_EVENTS: HistoricalEvent[] = [
    {
        id: 'hiroshima',
        name: 'Hiroshima Bombing',
        nameId: 'Pemboman Hiroshima',
        date: '1945-08-06',
        location: {
            lat: 34.3853,
            lon: 132.4553,
            city: 'Hiroshima',
            country: 'Japan'
        },
        bombId: 'little-boy',
        casualties: {
            immediate: 70000,
            total: 140000
        },
        description: 'First atomic bomb used in warfare. Detonated at 8:15 AM local time at an altitude of 600 meters. The bomb destroyed 5 square miles of the city and killed approximately 70,000 people immediately, with the death toll reaching 140,000 by the end of 1945.',
        descriptionId: 'Bom atom pertama yang digunakan dalam peperangan. Diledakkan pada pukul 08:15 waktu setempat pada ketinggian 600 meter. Bom ini menghancurkan 5 mil persegi kota dan menewaskan sekitar 70.000 orang seketika, dengan total korban mencapai 140.000 pada akhir tahun 1945.',
        category: 'warfare'
    },
    {
        id: 'nagasaki',
        name: 'Nagasaki Bombing',
        nameId: 'Pemboman Nagasaki',
        date: '1945-08-09',
        location: {
            lat: 32.7503,
            lon: 129.8779,
            city: 'Nagasaki',
            country: 'Japan'
        },
        bombId: 'fat-man',
        casualties: {
            immediate: 40000,
            total: 80000
        },
        description: 'Second and last atomic bomb used in warfare. Detonated at 11:02 AM local time. The hilly terrain of Nagasaki reduced the destructive radius compared to Hiroshima. Approximately 40,000 people were killed immediately, with total casualties reaching 80,000.',
        descriptionId: 'Bom atom kedua dan terakhir yang digunakan dalam peperangan. Diledakkan pada pukul 11:02 waktu setempat. Medan berbukit Nagasaki mengurangi radius destruksi dibandingkan Hiroshima. Sekitar 40.000 orang tewas seketika, dengan total korban mencapai 80.000.',
        category: 'warfare'
    },
    {
        id: 'castle-bravo',
        name: 'Castle Bravo Test',
        nameId: 'Uji Coba Castle Bravo',
        date: '1954-03-01',
        location: {
            lat: 11.6920,
            lon: 165.2719,
            city: 'Bikini Atoll',
            country: 'Marshall Islands'
        },
        bombId: 'castle-bravo',
        casualties: {
            immediate: 0,
            total: 0 // Test, but caused radiation exposure to islanders
        },
        description: 'Most powerful nuclear weapon ever tested by the United States (15 megatons). The yield was 2.5 times larger than expected, causing significant radioactive contamination of nearby atolls and a Japanese fishing vessel.',
        descriptionId: 'Senjata nuklir paling kuat yang pernah diuji oleh Amerika Serikat (15 megaton). Hasil ledakan 2,5 kali lebih besar dari yang diperkirakan, menyebabkan kontaminasi radioaktif signifikan di atol-atol terdekat dan kapal nelayan Jepang.',
        category: 'test'
    },
    {
        id: 'tsar-bomba',
        name: 'Tsar Bomba Test',
        nameId: 'Uji Coba Tsar Bomba',
        date: '1961-10-30',
        location: {
            lat: 73.4822,
            lon: 54.5854,
            city: 'Novaya Zemlya',
            country: 'Soviet Union'
        },
        bombId: 'tsar-bomba',
        casualties: {
            immediate: 0,
            total: 0 // Test in remote area
        },
        description: 'Largest nuclear weapon ever tested (50 megatons). The fireball was 8 km in diameter, and the mushroom cloud rose to 64 km. The shockwave circled the Earth three times. Tested at reduced yield (designed for 100 MT).',
        descriptionId: 'Senjata nuklir terbesar yang pernah diuji (50 megaton). Bola api berdiameter 8 km, dan awan jamur naik hingga 64 km. Gelombang kejut mengelilingi Bumi tiga kali. Diuji dengan yield yang dikurangi (dirancang untuk 100 MT).',
        category: 'test'
    }
];

/**
 * Get event by ID
 */
export function getHistoricalEvent(id: string): HistoricalEvent | undefined {
    return HISTORICAL_EVENTS.find(event => event.id === id);
}

/**
 * Get events by category
 */
export function getEventsByCategory(category: HistoricalEvent['category']): HistoricalEvent[] {
    return HISTORICAL_EVENTS.filter(event => event.category === category);
}

/**
 * Get warfare events only (Hiroshima & Nagasaki)
 */
export function getWarfareEvents(): HistoricalEvent[] {
    return getEventsByCategory('warfare');
}
