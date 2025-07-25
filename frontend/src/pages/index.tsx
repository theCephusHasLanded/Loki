import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useMarketStore } from '../stores/marketStore';
import { Market } from '../types';

export default function Home() {
  const { markets, loadMarkets, isLoading } = useMarketStore();
  const [featuredMarkets, setFeaturedMarkets] = useState<Market[]>([]);

  useEffect(() => {
    loadMarkets({ limit: 6, status: 'active' });
  }, [loadMarkets]);

  useEffect(() => {
    // Show top 3 markets by volume as featured
    const featured = markets
      .sort((a, b) => b.totalVolume - a.totalVolume)
      .slice(0, 3);
    setFeaturedMarkets(featured);
  }, [markets]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="text-center" style={{ padding: '4rem 0' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '1rem' }}>
          🌟 Constellation Markets
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          Predict the future using astrological insights and market wisdom. 
          Trade on celestial events and cosmic patterns.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/markets">
            <button style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Explore Markets
            </button>
          </Link>
          <Link href="/register">
            <button 
              style={{ 
                padding: '1rem 2rem', 
                fontSize: '1.1rem',
                background: 'transparent',
                border: '2px solid var(--accent-color)',
                color: 'var(--accent-color)',
              }}
            >
              Get Started
            </button>
          </Link>
        </div>
      </section>

      {/* Featured Markets */}
      <section style={{ margin: '4rem 0' }}>
        <div className="flex flex-between align-center mb-2">
          <h2 style={{ fontSize: '2rem', fontWeight: '600' }}>
            🔥 Hot Markets
          </h2>
          <Link href="/markets" className="nav-link">
            View All →
          </Link>
        </div>
        
        {isLoading ? (
          <div className="text-center" style={{ padding: '2rem' }}>
            Loading markets...
          </div>
        ) : (
          <div className="market-grid">
            {featuredMarkets.map(market => (
              <div key={market.id} className="market-card">
                <h3 className="market-title">
                  <Link href={`/markets/${market.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {market.title}
                  </Link>
                </h3>
                
                <p className="market-description">
                  {market.description.substring(0, 120)}...
                </p>

                <div className="flex flex-between align-center mb-2">
                  <span className="text-muted">Volume</span>
                  <span className="text-success">
                    {formatCurrency(market.totalVolume)}
                  </span>
                </div>

                <div className="flex flex-between align-center mb-2">
                  <span className="text-muted">Ends</span>
                  <span>{formatDate(market.endDate)}</span>
                </div>

                <div className="flex flex-between align-center">
                  <span className="text-muted">Type</span>
                  <span style={{ 
                    textTransform: 'capitalize',
                    background: 'var(--accent-color)',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                  }}>
                    {market.marketType}
                  </span>
                </div>

                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                  <Link href={`/markets/${market.id}`}>
                    <button style={{ width: '100%' }}>
                      Trade Now
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section style={{ margin: '4rem 0', padding: '3rem 0', background: 'var(--surface-color)', borderRadius: '12px' }}>
        <h2 className="text-center" style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '3rem' }}>
          Why Constellation Markets?
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          <div className="text-center">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌙</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>
              Astrological Intelligence
            </h3>
            <p className="text-muted">
              AI-powered insights using planetary positions and celestial events to inform market predictions.
            </p>
          </div>

          <div className="text-center">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>
              Real-time Trading
            </h3>
            <p className="text-muted">
              Instant order execution with live price updates and minimal slippage using our AMM system.
            </p>
          </div>

          <div className="text-center">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>
              Secure & Transparent
            </h3>
            <p className="text-muted">
              All transactions are audited and transparent. Your funds are secured with industry-standard encryption.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center" style={{ margin: '4rem 0' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '1rem' }}>
          Ready to Start Trading?
        </h2>
        <p className="text-muted" style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
          Join thousands of traders making predictions on cosmic events
        </p>
        <Link href="/register">
          <button style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
            Create Account
          </button>
        </Link>
      </section>
    </Layout>
  );
}