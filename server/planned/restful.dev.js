const apiVersion = 'development';

async function MiddleWare(
  next,
  promise
) {
  try {
    (await promise)===0 && next();

  } catch(err) {
    next(err);
  }
}

async function GET(
  req,
  res,
  ...functions
) {
  try {
    const rest = {
      apiVersion
    };
    let s = 0;
    for(const fn of functions) {
      const result = await fn(req);
      if(result !== null) {
        rest[fn.name] = result;
        s++;
      }
    }
    if(s>0) {
      res.status(200);
      res.json(rest);
    } else {
      res.status(404);
    }
    res.end();
  } catch(err) {
    res.status(403);
    res.end();
  }
  res.status();
  //process.env?.DEBUG === '1' && console.log();
}
async function POST() {

}

module.exports = {
  MiddleWare,
  GET,
  POST,
}
