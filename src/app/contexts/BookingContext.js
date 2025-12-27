'use client';

import { createContext, useContext, useState } from 'react';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [bookingData, setBookingData] = useState({
    serviceId: null,
    bookedDate: null,
    bookedTime: null,
    serviceAddressId: null,
    addMoreInfo: '',
    sourceOfLead: 'Website',
  });

  const updateBooking = (data) => {
    setBookingData((prev) => ({ ...prev, ...data }));
  };

  return (
    <BookingContext.Provider value={{ bookingData, updateBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
