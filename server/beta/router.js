const router = require('express').Router();

const editBillingTypes = require('./db/editBillingTypes');
const fetchSalary = require('./db/fetchSalary');
const fetchBillingTypes = require('./db/fetchBillingTypes');
const fetchRefundExamples = require('./db/fetchRefundExamples');
const addRefundExample = require('./db/addRefundExample');
const editRefundExample = require('./db/editRefundExample');
const deleteRefundExample = require('./db/deleteRefundExample');
const calculateProceeds = require('./db/calculateProceeds');

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

router.delete('/misc/refund/:editID',
  deleteRefundExample
);
router.get('/misc/salary',
  fetchSalary
);
router.get('/misc/proceeds/:lessonMonth',
  calculateProceeds
);

module.exports = router;