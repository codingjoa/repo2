const router = require('express').Router();

const fetchBilling = require('./fetchBilling');
const fetchAvailableBilling = require('./fetchAvailableBilling');
const fetchAvailableBillingFor = require('./fetchAvailableBillingFor');
router.get('/admin/billing/retractable/:lessonMonth',
  fetchBilling
);
router.get('/admin/billing/available/',
  fetchAvailableBilling
);
router.get('/admin/billing/available/:studentID/:quarterID',
  fetchAvailableBillingFor
);

module.exports = router;
