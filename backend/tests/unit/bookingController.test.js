/**
 * @file tests/unit/bookingController.test.js
 */
jest.mock('uuid', () => ({
  v4: () => 'fixed-booking-id'
}));
const dayjs = require('dayjs');
const { createBooking } = require('../../controllers/bookingController');
const { db } = require('../../config/firebase');

jest.mock('../../config/firebase', () => ({
  db: { collection: jest.fn() }
}));

describe('createBooking controller', () => {
  let req, res, flightDocMock, flightRefMock, bookingsColMock;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {},
      user: { uid: 'test-user-uid' },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    flightDocMock = { exists: false, data: () => ({ seats: [] }) };
    flightRefMock = {
      get: jest.fn().mockResolvedValue(flightDocMock),
      update: jest.fn().mockResolvedValue(),
    };
    bookingsColMock = {
      doc: jest.fn().mockReturnThis(),
      set: jest.fn().mockResolvedValue(),
    };

    db.collection.mockImplementation(colName => {
      if (colName === 'flights') return { doc: jest.fn(() => flightRefMock) };
      if (colName === 'bookings') return bookingsColMock;
      throw new Error(`Unexpected collection ${colName}`);
    });
  });

  test('returns 400 if flightId or passengers missing/invalid', async () => {
    req.body = { passengers: [] };
    await createBooking(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Flight ID and between 1-7 passengers are required.'
    });

    req.body = { flightId: 'f1', passengers: new Array(8).fill({}) };
    await createBooking(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('returns 404 when flight not found', async () => {
    req.body = {
      flightId: 'nonexistent',
      passengers: [{ name: 'A', dob: '2010-01-01', zone: 'standard' }]
    };
    flightDocMock.exists = false;
    await createBooking(req, res);
    expect(flightRefMock.get).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Flight not found.' });
  });

  // --- existing window-seat test, adjusted to use 'standard' zone seats in mock:
  test('books a single adult into a window if available', async () => {
    const seats = [
      // in standard zone only
      { row: 1, column: 'A', type: 'window', zone: 'standard', status: 'available' },
      { row: 1, column: 'B', type: 'aisle',  zone: 'standard', status: 'available' },
      { row: 1, column: 'C', type: 'middle', zone: 'standard', status: 'available' },
    ];
    flightDocMock.exists = true;
    flightDocMock.data = () => ({ seats });

    req.body = {
      flightId: 'f1',
      passengers: [{
        name: 'Alice',
        dob: dayjs().subtract(30, 'year').format('YYYY-MM-DD'),
        zone: 'standard'
      }]
    };

    await createBooking(req, res);

    expect(flightRefMock.update).toHaveBeenCalledWith({
      seats: expect.arrayContaining([
        expect.objectContaining({
          column: 'A',
          status: 'booked',
          assignedTo: 'fixed-booking-id'
        })
      ])
    });
    expect(bookingsColMock.doc).toHaveBeenCalledWith('fixed-booking-id');
    expect(bookingsColMock.set).toHaveBeenCalledWith({
      bookingId: 'fixed-booking-id',
      flightId: 'f1',
      userId: 'test-user-uid',
      passengers: [
        expect.objectContaining({ name: 'Alice', row: 1, column: 'A' })
      ],
      createdAt: expect.any(Date)
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Booking successful',
      bookingId: 'fixed-booking-id',
      passengers: expect.any(Array)
    });
  });

  test('books a single child avoiding aisle seats', async () => {
    const seats = [
      { row: 1, column: 'A', type: 'aisle',  zone: 'standard', status: 'available' },
      { row: 1, column: 'B', type: 'window', zone: 'standard', status: 'available' },
      { row: 1, column: 'C', type: 'middle', zone: 'standard', status: 'available' },
    ];
    flightDocMock.exists = true;
    flightDocMock.data = () => ({ seats });

    req.body = {
      flightId: 'f1',
      passengers: [{
        name: 'Tommy',
        dob: dayjs().subtract(5, 'year').format('YYYY-MM-DD'),
        zone: 'standard'
      }]
    };

    await createBooking(req, res);

    // child should not get the aisle at A, but pick window B
    expect(flightRefMock.update).toHaveBeenCalledWith({
      seats: expect.arrayContaining([
        expect.objectContaining({
          column: 'B',
          status: 'booked',
          assignedTo: 'fixed-booking-id'
        })
      ])
    });
  });

  test('books a single senior preferring aisle seats', async () => {
    const seats = [
      { row: 1, column: 'A', type: 'window', zone: 'standard', status: 'available' },
      { row: 1, column: 'B', type: 'aisle',  zone: 'standard', status: 'available' },
      { row: 1, column: 'C', type: 'middle', zone: 'standard', status: 'available' },
    ];
    flightDocMock.exists = true;
    flightDocMock.data = () => ({ seats });

    req.body = {
      flightId: 'f1',
      passengers: [{
        name: 'Elder',
        dob: dayjs().subtract(65, 'year').format('YYYY-MM-DD'),
        zone: 'standard'
      }]
    };

    await createBooking(req, res);

    // senior should get the aisle at B
    expect(flightRefMock.update).toHaveBeenCalledWith({
      seats: expect.arrayContaining([
        expect.objectContaining({
          column: 'B',
          status: 'booked',
          assignedTo: 'fixed-booking-id'
        })
      ])
    });
  });

  test('books a 2-person group contiguously when block exists', async () => {
    const seats = [
      // Row 1 has A,B adjacent
      { row: 1, column: 'A', type: 'window', zone: 'standard', status: 'available' },
      { row: 1, column: 'B', type: 'aisle',  zone: 'standard', status: 'available' },
      // Row 2 has C,D adjacent but we won't reach row 2
      { row: 2, column: 'C', type: 'window', zone: 'standard', status: 'available' },
      { row: 2, column: 'D', type: 'aisle',  zone: 'standard', status: 'available' },
    ];
    flightDocMock.exists = true;
    flightDocMock.data = () => ({ seats });

    req.body = {
      flightId: 'f1',
      passengers: [
        { name: 'P1', dob: '2000-01-01', zone: 'standard' },
        { name: 'P2', dob: '2000-01-01', zone: 'standard' }
      ]
    };

    await createBooking(req, res);

    // should take A and B as the contiguous block
    expect(flightRefMock.update).toHaveBeenCalledWith({
      seats: expect.arrayContaining([
        expect.objectContaining({ column: 'A', status: 'booked' }),
        expect.objectContaining({ column: 'B', status: 'booked' }),
      ])
    });
  });

  test('books a 2-person group with fallback when no contiguous block', async () => {
    const seats = [
      // No two adjacent in same row: only single seats scattered
      { row: 1, column: 'A', type: 'window', zone: 'standard', status: 'available' },
      { row: 2, column: 'B', type: 'aisle',  zone: 'standard', status: 'available' },
      { row: 3, column: 'C', type: 'middle', zone: 'standard', status: 'available' },
    ];
    flightDocMock.exists = true;
    flightDocMock.data = () => ({ seats });

    req.body = {
      flightId: 'f1',
      passengers: [
        { name: 'G1', dob: '2000-01-01', zone: 'standard' },
        { name: 'G2', dob: '2000-01-01', zone: 'standard' }
      ]
    };

    await createBooking(req, res);

    // fallback picks first two in sorted order: A and B
    expect(flightRefMock.update).toHaveBeenCalledWith({
      seats: expect.arrayContaining([
        expect.objectContaining({ row: 1, column: 'A', status: 'booked' }),
        expect.objectContaining({ row: 2, column: 'B', status: 'booked' }),
      ])
    });
  });

});
