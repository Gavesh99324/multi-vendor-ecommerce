// Replace with real Stripe/PayPal integration later
export const charge = async ({ amount, currency = 'LKR', source, metadata = {} }) => {
    // Simulate success
    return {
    id: `pay_${Math.random().toString(36).slice(2, 10)}`,
    amount,
    currency,
    paid: true,
    created: Date.now(),
    metadata
    };
    };