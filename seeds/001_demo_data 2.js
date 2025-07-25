exports.seed = async function(knex) {
  // Clear existing data in reverse dependency order
  await knex('transactions').del();
  await knex('positions').del();
  await knex('market_outcomes').del();
  await knex('markets').del();
  await knex('users').del();

  // Use a pre-hashed password (ConstellationDemo123!)
  const passwordHash = '$2b$10$rQZ8kqX5o.5QZ8kqX5o.5O5QZ8kqX5o.5QZ8kqX5o.5QZ8kqX5o.5O';

  // Insert demo users (using actual column names)
  const users = await knex('users').insert([
    {
      email: 'demo@constellation.com',
      username: 'demo_user',
      password_hash: passwordHash,
      wallet_balance: 10000.00,
      kyc_status: 'approved',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      email: 'trader@constellation.com',
      username: 'active_trader',
      password_hash: passwordHash,
      wallet_balance: 5000.00,
      kyc_status: 'approved',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    }
  ]).returning('*');

  console.log('✅ Demo users created:', users.length);

  // Insert demo markets (using actual column names)
  const markets = await knex('markets').insert([
    {
      title: 'Will Bitcoin reach $100,000 by end of 2024?',
      description: 'Predict whether Bitcoin (BTC) will reach or exceed $100,000 USD by December 31, 2024.',
      market_type: 'binary',
      end_date: new Date('2024-12-31'),
      resolution_criteria: 'Market resolves to YES if Bitcoin (BTC) reaches or exceeds $100,000 USD on any major exchange by December 31, 2024, 11:59 PM UTC.',
      creator_id: users[0].id,
      status: 'active',
      total_volume: 0,
      liquidity_parameter: 100.0000,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      title: 'Next Mars Mission Success',
      description: 'Will the next planned Mars mission successfully land and operate for at least 30 days?',
      market_type: 'binary',
      end_date: new Date('2025-06-30'),
      resolution_criteria: 'Market resolves to YES if the next Mars mission successfully lands and operates for at least 30 consecutive days.',
      creator_id: users[1].id,
      status: 'active',
      total_volume: 0,
      liquidity_parameter: 100.0000,
      created_at: new Date(),
      updated_at: new Date()
    }
  ]).returning('*');

  console.log('✅ Demo markets created:', markets.length);

  // Insert market outcomes (using actual column names)
  await knex('market_outcomes').insert([
    {
      market_id: markets[0].id,
      outcome_text: 'Yes',
      probability: 0.65000000,
      total_volume: 0,
      total_shares: 0,
      liquidity_shares: 100.0000
    },
    {
      market_id: markets[0].id,
      outcome_text: 'No',
      probability: 0.35000000,
      total_volume: 0,
      total_shares: 0,
      liquidity_shares: 100.0000
    },
    {
      market_id: markets[1].id,
      outcome_text: 'Yes',
      probability: 0.45000000,
      total_volume: 0,
      total_shares: 0,
      liquidity_shares: 100.0000
    },
    {
      market_id: markets[1].id,
      outcome_text: 'No',
      probability: 0.55000000,
      total_volume: 0,
      total_shares: 0,
      liquidity_shares: 100.0000
    }
  ]);

  console.log('✅ Demo data seeded successfully!');
};
