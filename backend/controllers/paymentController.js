const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');

exports.createCheckoutSession = async (req, res) => {
  try {
    const { plan } = req.body;
    const userId = req.user.userId;
    const priceIds = { Premium: process.env.STRIPE_PREMIUM_PRICE_ID, Advance: process.env.STRIPE_ADVANCE_PRICE_ID };
    if (!['Premium', 'Advance'].includes(plan)) return res.status(400).json({ message: 'Choose a valid paid plan.' });
    if (!priceIds[plan]) return res.status(503).json({ message: `${plan} payment is not configured yet.` });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceIds[plan], quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/pricing`,
      client_reference_id: userId,
      metadata: { plan },
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: 'Payment session failed', error: error.message });
  }
};

exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try { event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET); }
  catch (err) { return res.status(400).send(`Webhook Error: ${err.message}`); }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id;
    const plan = session.metadata?.plan;
    if (userId && ['Premium', 'Advance'].includes(plan)) await User.findByIdAndUpdate(userId, { plan });
  }
  res.json({ received: true });
};
