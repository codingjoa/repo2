
function OK(res, fetchedData) {
  res.status(200);
  res.json({
    fetchedData
  });
  return true;
}

function Created(res, createdData, createdAt) {
  res.status(201);
  res.json({
    createdData,
    createdAt
  });
  return true;
}

function NoContent(res) {
  res.status(204);
  return true;
}

function BadRequest(res, err) {
  res.status(400);
  res.json({
    cause: err.message
  });
  res.end();
  return true;
}

function Unauthorized(res) {
  res.status(401);
  res.end();
  return true;
}

function Forbidden(res) {
  res.status(403);
  res.end();
  return true;
}

function NotFound(res) {
  res.status(404);
  res.end();
  return true;
}

module.exports = {
  OK,
  Created,
  NoContent,
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound
};
