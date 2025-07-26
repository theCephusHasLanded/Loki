interface AstronomicalDataAPI {
  timestamp: number;
  moonPhase: {
    name: string;
    illumination: number;
    angle: number;
    phase: 'new' | 'waxing-crescent' | 'first-quarter' | 'waxing-gibbous' | 'full' | 'waning-gibbous' | 'third-quarter' | 'waning-crescent';
    nextPhaseDate: string;
  };
  planets: {
    name: string;
    constellation: string;
    rightAscension: number;
    declination: number;
    distance: number;
    magnitude: number;
    isRetrograde: boolean;
    elongation: number;
  }[];
  solarActivity: {
    flareLevel: 'quiet' | 'minor' | 'moderate' | 'strong' | 'extreme';
    solarWindSpeed: number;
    geomagneticIndex: number;
    coronalMassEjection: boolean;
    lastFlareTime: string;
  };
  astronomicalEvents: {
    date: string;
    event: string;
    description: string;
    marketImpact: 'low' | 'medium' | 'high';
  }[];
}

class LiveAstronomicalDataService {
  private apiKey: string | null = null;
  private baseURL = 'https://api.astronomyapi.com/api/v2';
  private fallbackData: AstronomicalDataAPI | null = null;
  private updateInterval: NodeJS.Timeout | null = null;
  private listeners: ((data: AstronomicalDataAPI) => void)[] = [];

  constructor() {
    // Initialize with realistic simulated data
    this.generateRealisticData();
    this.startRealTimeUpdates();
  }

  private calculateMoonPhase(): { name: string; illumination: number; angle: number; phase: any; nextPhaseDate: string } {
    const now = new Date();
    const newMoon = new Date('2025-01-29'); // Actual new moon date
    const lunarCycle = 29.53 * 24 * 60 * 60 * 1000; // Lunar cycle in milliseconds
    
    const daysSinceNewMoon = (now.getTime() - newMoon.getTime()) / (24 * 60 * 60 * 1000);
    const phase = (daysSinceNewMoon % 29.53) / 29.53;
    
    let phaseName: string;
    let phaseType: any;
    
    if (phase < 0.03 || phase > 0.97) {
      phaseName = 'New Moon';
      phaseType = 'new';
    } else if (phase < 0.22) {
      phaseName = 'Waxing Crescent';
      phaseType = 'waxing-crescent';
    } else if (phase < 0.28) {
      phaseName = 'First Quarter';
      phaseType = 'first-quarter';
    } else if (phase < 0.47) {
      phaseName = 'Waxing Gibbous';
      phaseType = 'waxing-gibbous';
    } else if (phase < 0.53) {
      phaseName = 'Full Moon';
      phaseType = 'full';
    } else if (phase < 0.72) {
      phaseName = 'Waning Gibbous';
      phaseType = 'waning-gibbous';
    } else if (phase < 0.78) {
      phaseName = 'Third Quarter';
      phaseType = 'third-quarter';
    } else {
      phaseName = 'Waning Crescent';
      phaseType = 'waning-crescent';
    }

    const illumination = Math.abs(Math.cos((phase - 0.5) * Math.PI * 2)) * 0.5 + 0.5;
    const nextPhase = new Date(newMoon.getTime() + Math.ceil(daysSinceNewMoon / 7.38) * 7.38 * 24 * 60 * 60 * 1000);

    return {
      name: phaseName,
      illumination: Number(illumination.toFixed(3)),
      angle: Number((phase * 360).toFixed(1)),
      phase: phaseType,
      nextPhaseDate: nextPhase.toISOString().split('T')[0]
    };
  }

  private getCurrentPlanetaryData() {
    const now = new Date();
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    
    // Simplified orbital calculations for demonstration
    const planets = [
      {
        name: 'Mercury',
        constellation: this.getConstellation(dayOfYear * 4.15), // Fast orbit
        rightAscension: Number(((dayOfYear * 4.15) % 360).toFixed(2)),
        declination: Number((Math.sin(dayOfYear * 0.1) * 23.4).toFixed(2)),
        distance: Number((0.39 + Math.sin(dayOfYear * 0.1) * 0.1).toFixed(3)),
        magnitude: Number((-0.4 + Math.random() * 0.8).toFixed(1)),
        isRetrograde: (dayOfYear % 88) < 22, // Mercury retrograde periods
        elongation: Number((Math.abs(Math.sin(dayOfYear * 0.2)) * 28).toFixed(1))
      },
      {
        name: 'Venus',
        constellation: this.getConstellation(dayOfYear * 1.62),
        rightAscension: Number(((dayOfYear * 1.62) % 360).toFixed(2)),
        declination: Number((Math.sin(dayOfYear * 0.08) * 23.4).toFixed(2)),
        distance: Number((0.72 + Math.sin(dayOfYear * 0.08) * 0.05).toFixed(3)),
        magnitude: Number((-4.6 + Math.random() * 0.4).toFixed(1)),
        isRetrograde: (dayOfYear % 225) < 40,
        elongation: Number((Math.abs(Math.sin(dayOfYear * 0.15)) * 47).toFixed(1))
      },
      {
        name: 'Mars',
        constellation: this.getConstellation(dayOfYear * 0.53),
        rightAscension: Number(((dayOfYear * 0.53) % 360).toFixed(2)),
        declination: Number((Math.sin(dayOfYear * 0.05) * 25.2).toFixed(2)),
        distance: Number((1.52 + Math.sin(dayOfYear * 0.05) * 0.3).toFixed(3)),
        magnitude: Number((-2.9 + Math.random() * 4).toFixed(1)),
        isRetrograde: (dayOfYear % 687) < 70,
        elongation: Number((Math.abs(Math.sin(dayOfYear * 0.1)) * 180).toFixed(1))
      },
      {
        name: 'Jupiter',
        constellation: this.getConstellation(dayOfYear * 0.08),
        rightAscension: Number(((dayOfYear * 0.08) % 360).toFixed(2)),
        declination: Number((Math.sin(dayOfYear * 0.02) * 23.4).toFixed(2)),
        distance: Number((5.2 + Math.sin(dayOfYear * 0.02) * 0.5).toFixed(3)),
        magnitude: Number((-2.9 + Math.random() * 0.5).toFixed(1)),
        isRetrograde: (dayOfYear % 399) < 120,
        elongation: Number((Math.abs(Math.sin(dayOfYear * 0.05)) * 180).toFixed(1))
      },
      {
        name: 'Saturn',
        constellation: this.getConstellation(dayOfYear * 0.03),
        rightAscension: Number(((dayOfYear * 0.03) % 360).toFixed(2)),
        declination: Number((Math.sin(dayOfYear * 0.01) * 26.7).toFixed(2)),
        distance: Number((9.5 + Math.sin(dayOfYear * 0.01) * 0.8).toFixed(3)),
        magnitude: Number((0.7 + Math.random() * 0.4).toFixed(1)),
        isRetrograde: (dayOfYear % 378) < 140,
        elongation: Number((Math.abs(Math.sin(dayOfYear * 0.03)) * 180).toFixed(1))
      }
    ];

    return planets;
  }

  private getConstellation(angle: number): string {
    const constellations = [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];
    const index = Math.floor((angle % 360) / 30);
    return constellations[index];
  }

  private calculateSolarActivity() {
    const now = new Date();
    const solarCycle = 11 * 365.25; // 11-year solar cycle in days
    const daysSinceCycleStart = (now.getTime() - new Date('2019-12-01').getTime()) / (24 * 60 * 60 * 1000);
    const cyclePhase = (daysSinceCycleStart % solarCycle) / solarCycle;
    
    // Solar activity peaks around mid-cycle
    const activityLevel = Math.sin(cyclePhase * Math.PI) * 0.7 + 0.3;
    const randomFactor = Math.random() * 0.3;
    const totalActivity = Math.min(1, activityLevel + randomFactor);

    const flareLevel = totalActivity > 0.8 ? 'extreme' :
                      totalActivity > 0.6 ? 'strong' :
                      totalActivity > 0.4 ? 'moderate' :
                      totalActivity > 0.2 ? 'minor' : 'quiet';

    return {
      flareLevel: flareLevel as any,
      solarWindSpeed: Number((300 + totalActivity * 400 + Math.random() * 100).toFixed(1)),
      geomagneticIndex: Number((totalActivity * 9).toFixed(1)),
      coronalMassEjection: totalActivity > 0.7 && Math.random() < 0.1,
      lastFlareTime: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
    };
  }

  private generateUpcomingEvents() {
    const events = [];
    const today = new Date();

    // Mercury retrograde periods (simplified)
    const mercuryRetrograde = new Date('2025-03-14');
    if (mercuryRetrograde > today) {
      events.push({
        date: mercuryRetrograde.toISOString().split('T')[0],
        event: 'Mercury Retrograde Begins',
        description: 'Communication and technology may experience disruptions. Market volatility often increases.',
        marketImpact: 'medium' as const
      });
    }

    // Full Moon
    const nextFullMoon = new Date('2025-02-12');
    if (nextFullMoon > today) {
      events.push({
        date: nextFullMoon.toISOString().split('T')[0],
        event: 'Full Moon in Leo',
        description: 'High emotional energy period. Historically correlates with increased trading volume.',
        marketImpact: 'low' as const
      });
    }

    // Solar eclipse
    const solarEclipse = new Date('2025-03-29');
    if (solarEclipse > today) {
      events.push({
        date: solarEclipse.toISOString().split('T')[0],
        event: 'Partial Solar Eclipse',
        description: 'Rare astronomical event. Major market movements have historically occurred around eclipses.',
        marketImpact: 'high' as const
      });
    }

    // Jupiter-Saturn conjunction
    const conjunction = new Date('2025-08-15');
    if (conjunction > today) {
      events.push({
        date: conjunction.toISOString().split('T')[0],
        event: 'Jupiter-Saturn Alignment',
        description: 'Significant planetary alignment. Long-term market trends may shift.',
        marketImpact: 'high' as const
      });
    }

    return events.slice(0, 3); // Return next 3 events
  }

  private generateRealisticData(): void {
    this.fallbackData = {
      timestamp: Date.now(),
      moonPhase: this.calculateMoonPhase(),
      planets: this.getCurrentPlanetaryData(),
      solarActivity: this.calculateSolarActivity(),
      astronomicalEvents: this.generateUpcomingEvents()
    };
  }

  private startRealTimeUpdates(): void {
    // Update data every 5 minutes
    this.updateInterval = setInterval(() => {
      this.generateRealisticData();
      this.notifyListeners();
    }, 5 * 60 * 1000);
  }

  private notifyListeners(): void {
    if (this.fallbackData) {
      this.listeners.forEach(listener => listener(this.fallbackData!));
    }
  }

  public async getCurrentData(): Promise<AstronomicalDataAPI> {
    // Always return the realistic simulated data for now
    this.generateRealisticData();
    return this.fallbackData!;
  }

  public subscribe(callback: (data: AstronomicalDataAPI) => void): () => void {
    this.listeners.push(callback);
    
    // Immediately send current data to new subscriber
    if (this.fallbackData) {
      callback(this.fallbackData);
    }

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  public destroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    this.listeners = [];
  }

  // Get market correlation insights based on current astronomical data
  public getMarketCorrelations(): {
    moonPhaseImpact: string;
    planetaryRetrograde: string;
    solarActivityImpact: string;
    overallCosmicSentiment: 'bullish' | 'bearish' | 'neutral';
  } {
    if (!this.fallbackData) {
      this.generateRealisticData();
    }

    const data = this.fallbackData!;
    const retrogradeCount = data.planets.filter(p => p.isRetrograde).length;
    
    let moonPhaseImpact = '';
    switch (data.moonPhase.phase) {
      case 'new':
        moonPhaseImpact = 'New beginnings favor fresh market positions';
        break;
      case 'full':
        moonPhaseImpact = 'Peak emotional energy may increase volatility';
        break;
      case 'waxing-gibbous':
        moonPhaseImpact = 'Growth phase supports bullish momentum';
        break;
      case 'waning-gibbous':
        moonPhaseImpact = 'Release phase may trigger profit-taking';
        break;
      default:
        moonPhaseImpact = 'Transitional energy suggests cautious positioning';
    }

    let planetaryRetrograde = retrogradeCount === 0 ? 'Clear planetary energy supports forward movement' :
                             retrogradeCount === 1 ? 'Single retrograde suggests minor delays' :
                             retrogradeCount >= 2 ? 'Multiple retrogrades indicate caution needed' :
                             'Significant retrograde activity - expect reversals';

    let solarActivityImpact = '';
    switch (data.solarActivity.flareLevel) {
      case 'quiet':
        solarActivityImpact = 'Stable solar conditions support steady trends';
        break;
      case 'minor':
        solarActivityImpact = 'Minor solar activity may cause small fluctuations';
        break;
      case 'moderate':
        solarActivityImpact = 'Moderate solar storms could increase volatility';
        break;
      case 'strong':
        solarActivityImpact = 'Strong solar activity suggests major market events';
        break;
      case 'extreme':
        solarActivityImpact = 'Extreme solar activity warns of potential disruptions';
        break;
    }

    // Calculate overall sentiment
    let sentimentScore = 0;
    sentimentScore += data.moonPhase.illumination > 0.7 ? 1 : data.moonPhase.illumination < 0.3 ? -1 : 0;
    sentimentScore += retrogradeCount > 2 ? -1 : retrogradeCount === 0 ? 1 : 0;
    sentimentScore += data.solarActivity.flareLevel === 'quiet' ? 1 : 
                     data.solarActivity.flareLevel === 'extreme' ? -1 : 0;

    const overallCosmicSentiment = sentimentScore > 0 ? 'bullish' : 
                                  sentimentScore < 0 ? 'bearish' : 'neutral';

    return {
      moonPhaseImpact,
      planetaryRetrograde,
      solarActivityImpact,
      overallCosmicSentiment
    };
  }
}

// Export singleton instance
export const liveAstronomicalDataService = new LiveAstronomicalDataService();
export default liveAstronomicalDataService;
