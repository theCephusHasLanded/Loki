export interface PlanetaryPosition {
  name: string;
  symbol: string;
  longitude: number;
  retrograde: boolean;
  speed: number;
  influence: 'bullish' | 'bearish' | 'neutral';
  strength: number; // 0-1
  color: string;
}

export interface CelestialEvent {
  date: Date;
  type: 'conjunction' | 'opposition' | 'square' | 'trine' | 'retrograde_start' | 'retrograde_end';
  planets: string[];
  influence: 'bullish' | 'bearish' | 'neutral';
  magnitude: number; // 0-1
  description: string;
}

export interface MarketCelestialData {
  timestamp: Date;
  price: number;
  volume: number;
  planetaryPositions: PlanetaryPosition[];
  celestialEvents: CelestialEvent[];
  lunarPhase: number; // 0-1 (0 = new, 0.5 = full)
  mercuryRetrograde: boolean;
  dominantInfluence: 'bullish' | 'bearish' | 'neutral';
  astroConfidence: number; // 0-1
}

class CelestialDataService {
  private basePrice = 78.90;
  private planets: PlanetaryPosition[] = [
    {
      name: 'Mercury',
      symbol: '☿',
      longitude: 0,
      retrograde: false,
      speed: 1.59,
      influence: 'neutral',
      strength: 0.8,
      color: '#FFA500'
    },
    {
      name: 'Venus',
      symbol: '♀',
      longitude: 45,
      retrograde: false,
      speed: 1.20,
      influence: 'bullish',
      strength: 0.9,
      color: '#FF6B9D'
    },
    {
      name: 'Mars',
      symbol: '♂',
      longitude: 120,
      retrograde: false,
      speed: 0.52,
      influence: 'bearish',
      strength: 0.7,
      color: '#FF4444'
    },
    {
      name: 'Jupiter',
      symbol: '♃',
      longitude: 200,
      retrograde: false,
      speed: 0.08,
      influence: 'bullish',
      strength: 0.95,
      color: '#4A90E2'
    },
    {
      name: 'Saturn',
      symbol: '♄',
      longitude: 280,
      retrograde: false,
      speed: 0.03,
      influence: 'bearish',
      strength: 0.85,
      color: '#8E44AD'
    },
    {
      name: 'Uranus',
      symbol: '♅',
      longitude: 15,
      retrograde: true,
      speed: -0.01,
      influence: 'neutral',
      strength: 0.6,
      color: '#00CED1'
    }
  ];

  private historicalData: MarketCelestialData[] = [];
  private subscribers: Set<(data: MarketCelestialData[]) => void> = new Set();

  constructor() {
    this.generateHistoricalData();
    this.startRealTimeUpdates();
  }

  private generateHistoricalData(): void {
    const now = new Date();
    
    // Generate 90 days of historical data
    for (let i = 90; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const dataPoint = this.generateDataPoint(date, i);
      this.historicalData.push(dataPoint);
    }
  }

  private generateDataPoint(date: Date, daysAgo: number): MarketCelestialData {
    // Update planetary positions based on time
    const updatedPlanets = this.planets.map(planet => ({
      ...planet,
      longitude: (planet.longitude + (planet.speed * daysAgo)) % 360,
      retrograde: this.calculateRetrogradeStatus(planet.name, daysAgo)
    }));

    // Calculate lunar phase (29.5-day cycle)
    const lunarPhase = ((daysAgo % 29.5) / 29.5);
    
    // Determine Mercury retrograde periods (approximately every 116 days for 23 days)
    const mercuryRetrograde = this.isMercuryRetrograde(daysAgo);
    
    // Generate celestial events
    const celestialEvents = this.generateCelestialEvents(date, updatedPlanets);
    
    // Calculate price based on celestial influences
    const baseInfluence = this.calculateCelestialInfluence(updatedPlanets, lunarPhase, mercuryRetrograde);
    const eventInfluence = celestialEvents.reduce((acc, event) => 
      acc + (event.influence === 'bullish' ? event.magnitude : 
             event.influence === 'bearish' ? -event.magnitude : 0), 0);
    
    const totalInfluence = baseInfluence + eventInfluence;
    const priceVariation = totalInfluence * 15; // Max 15% swing
    const randomNoise = (Math.random() - 0.5) * 2; // ±1% random noise
    
    const price = this.basePrice * (1 + (priceVariation + randomNoise) / 100);
    
    // Generate volume based on volatility
    const volatility = Math.abs(totalInfluence) + Math.abs(randomNoise);
    const volume = 15000000 + (volatility * 8000000);

    // Determine dominant influence
    const dominantInfluence = totalInfluence > 0.1 ? 'bullish' : 
                            totalInfluence < -0.1 ? 'bearish' : 'neutral';

    // Calculate astro confidence based on planetary alignment strength
    const astroConfidence = updatedPlanets.reduce((acc, planet) => 
      acc + (planet.strength * (planet.retrograde ? 0.7 : 1.0)), 0) / updatedPlanets.length;

    return {
      timestamp: date,
      price,
      volume,
      planetaryPositions: updatedPlanets,
      celestialEvents,
      lunarPhase,
      mercuryRetrograde,
      dominantInfluence,
      astroConfidence
    };
  }

  private calculateRetrogradeStatus(planetName: string, daysAgo: number): boolean {
    switch (planetName) {
      case 'Mercury':
        // Mercury retrograde ~3 times per year, ~23 days each
        const mercuryPattern = Math.floor(daysAgo / 116) % 2;
        const dayInCycle = daysAgo % 116;
        return mercuryPattern === 1 && dayInCycle < 23;
      
      case 'Venus':
        // Venus retrograde ~every 584 days for ~40 days
        const venusPattern = Math.floor(daysAgo / 584) % 2;
        const venusDayInCycle = daysAgo % 584;
        return venusPattern === 1 && venusDayInCycle < 40;
      
      case 'Mars':
        // Mars retrograde ~every 687 days for ~72 days
        const marsPattern = Math.floor(daysAgo / 687) % 2;
        const marsDayInCycle = daysAgo % 687;
        return marsPattern === 1 && marsDayInCycle < 72;
      
      case 'Jupiter':
        // Jupiter retrograde ~121 days per year
        return (daysAgo % 365) > 122 && (daysAgo % 365) < 243;
      
      case 'Saturn':
        // Saturn retrograde ~138 days per year
        return (daysAgo % 365) > 114 && (daysAgo % 365) < 252;
      
      case 'Uranus':
        // Uranus retrograde ~151 days per year
        return (daysAgo % 365) > 107 && (daysAgo % 365) < 258;
      
      default:
        return false;
    }
  }

  private isMercuryRetrograde(daysAgo: number): boolean {
    return this.calculateRetrogradeStatus('Mercury', daysAgo);
  }

  private generateCelestialEvents(date: Date, planets: PlanetaryPosition[]): CelestialEvent[] {
    const events: CelestialEvent[] = [];
    
    // Check for planetary aspects (simplified)
    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) {
        const planet1 = planets[i];
        const planet2 = planets[j];
        const angle = Math.abs(planet1.longitude - planet2.longitude);
        const normalizedAngle = angle > 180 ? 360 - angle : angle;
        
        // Check for major aspects (within 5 degrees orb)
        if (Math.abs(normalizedAngle - 0) < 5) { // Conjunction
          events.push({
            date,
            type: 'conjunction',
            planets: [planet1.name, planet2.name],
            influence: this.determineAspectInfluence('conjunction', planet1, planet2),
            magnitude: 0.8,
            description: `${planet1.symbol} conjunction ${planet2.symbol}: Powerful unified energy`
          });
        } else if (Math.abs(normalizedAngle - 180) < 5) { // Opposition
          events.push({
            date,
            type: 'opposition',
            planets: [planet1.name, planet2.name],
            influence: this.determineAspectInfluence('opposition', planet1, planet2),
            magnitude: 0.7,
            description: `${planet1.symbol} opposition ${planet2.symbol}: Tension and balance`
          });
        } else if (Math.abs(normalizedAngle - 90) < 5) { // Square
          events.push({
            date,
            type: 'square',
            planets: [planet1.name, planet2.name],
            influence: 'bearish',
            magnitude: 0.6,
            description: `${planet1.symbol} square ${planet2.symbol}: Challenge and friction`
          });
        } else if (Math.abs(normalizedAngle - 120) < 5) { // Trine
          events.push({
            date,
            type: 'trine',
            planets: [planet1.name, planet2.name],
            influence: 'bullish',
            magnitude: 0.5,
            description: `${planet1.symbol} trine ${planet2.symbol}: Harmonious flow`
          });
        }
      }
    }

    // Check for retrograde starts/ends
    planets.forEach(planet => {
      if (planet.retrograde && Math.abs(planet.speed) < 0.01) {
        events.push({
          date,
          type: 'retrograde_start',
          planets: [planet.name],
          influence: planet.name === 'Jupiter' ? 'neutral' : 'bearish',
          magnitude: 0.4,
          description: `${planet.symbol} stations retrograde: Review and reflection period`
        });
      }
    });

    return events.slice(0, 3); // Limit to 3 events per day
  }

  private determineAspectInfluence(
    aspect: string, 
    planet1: PlanetaryPosition, 
    planet2: PlanetaryPosition
  ): 'bullish' | 'bearish' | 'neutral' {
    if (aspect === 'conjunction') {
      // Venus-Jupiter conjunction is very bullish
      if ((planet1.name === 'Venus' && planet2.name === 'Jupiter') ||
          (planet1.name === 'Jupiter' && planet2.name === 'Venus')) {
        return 'bullish';
      }
      // Mars-Saturn conjunction is bearish
      if ((planet1.name === 'Mars' && planet2.name === 'Saturn') ||
          (planet1.name === 'Saturn' && planet2.name === 'Mars')) {
        return 'bearish';
      }
    }
    
    return 'neutral';
  }

  private calculateCelestialInfluence(
    planets: PlanetaryPosition[], 
    lunarPhase: number, 
    mercuryRetrograde: boolean
  ): number {
    let influence = 0;

    // Planetary influences
    planets.forEach(planet => {
      let planetInfluence = planet.strength;
      
      if (planet.retrograde) {
        planetInfluence *= 0.7; // Reduce influence when retrograde
        if (planet.name === 'Mercury') planetInfluence *= 0.5; // Mercury retrograde is more significant
      }

      switch (planet.influence) {
        case 'bullish':
          influence += planetInfluence;
          break;
        case 'bearish':
          influence -= planetInfluence;
          break;
        // neutral adds nothing
      }
    });

    // Lunar phase influence
    if (lunarPhase < 0.1 || lunarPhase > 0.9) { // New moon
      influence += 0.2; // New moon slightly bullish (new beginnings)
    } else if (lunarPhase > 0.4 && lunarPhase < 0.6) { // Full moon
      influence -= 0.3; // Full moon bearish (emotional volatility)
    }

    // Mercury retrograde penalty
    if (mercuryRetrograde) {
      influence -= 0.4;
    }

    return Math.max(-1, Math.min(1, influence)); // Clamp between -1 and 1
  }

  private startRealTimeUpdates(): void {
    setInterval(() => {
      const now = new Date();
      const latestData = this.generateDataPoint(now, 0);
      
      // Add new data point
      this.historicalData.push(latestData);
      
      // Keep only last 90 days
      if (this.historicalData.length > 90) {
        this.historicalData.shift();
      }

      // Notify subscribers
      this.notifySubscribers();
    }, 30000); // Update every 30 seconds
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback([...this.historicalData]));
  }

  public subscribe(callback: (data: MarketCelestialData[]) => void): () => void {
    this.subscribers.add(callback);
    
    // Send initial data
    callback([...this.historicalData]);
    
    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  public getHistoricalData(days: number = 30): MarketCelestialData[] {
    return this.historicalData.slice(-days);
  }

  public getCurrentCelestialData(): MarketCelestialData {
    return this.historicalData[this.historicalData.length - 1] || this.generateDataPoint(new Date(), 0);
  }

  public getPlanetaryPositions(): PlanetaryPosition[] {
    const current = this.getCurrentCelestialData();
    return current.planetaryPositions;
  }

  public getCelestialEvents(days: number = 7): CelestialEvent[] {
    return this.historicalData
      .slice(-days)
      .flatMap(data => data.celestialEvents)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }
}

export const celestialDataService = new CelestialDataService();