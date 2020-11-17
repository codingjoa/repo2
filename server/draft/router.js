const router = require('express').Router();

const editBillingTypes = require('./db/editBillingTypes');
const fetchSalary = require('./db/fetchSalary');
const fetchBillingTypes = require('./db/fetchBillingTypes');
const fetchRefundExamples = require('./db/fetchRefundExamples');
const addRefundExample = require('./db/addRefundExample');
const editRefundExample = require('./db/editRefundExample');
router.get('/misc/billing',
  fetchBillingTypes
);
router.patch('/misc/billing',
  editBillingTypes
);

router.get('/misc/refund',
  fetchRefundExamples
);
router.post('/misc/refund',
  addRefundExample
);
router.patch('/misc/refund/:editID',
  editRefundExample
);
router.get('/misc/salary',
  fetchSalary
);

module.exports = router;
