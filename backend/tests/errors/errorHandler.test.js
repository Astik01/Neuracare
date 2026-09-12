const { notFoundHandler, errorHandler } = require('../../src/middleware/errorHandler');

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('notFoundHandler', () => {
  it('responds 404 with a generic route-not-found message', () => {
    const res = mockRes();

    notFoundHandler({}, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Route not found' });
  });
});

describe('errorHandler', () => {
  it('responds 500 with a generic message and does not leak error internals', () => {
    const res = mockRes();
    const err = new Error('some internal detail that should not reach the client');
    jest.spyOn(console, 'error').mockImplementation(() => {});

    errorHandler(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    expect(res.json.mock.calls[0][0].error).not.toContain('internal detail');

    console.error.mockRestore();
  });
});
