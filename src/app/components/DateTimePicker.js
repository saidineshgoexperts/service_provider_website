'use client';

import { Box, Typography, IconButton, Button, Dialog } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InfoIcon from '@mui/icons-material/Info';
import { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';

export default function DateTimePicker({ open, onClose, onConfirm }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const scrollContainerRef = useRef(null);

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  // 🔥 SERVICE BOOKING HOURS: 8 AM - 8 PM
  const SERVICE_START_HOUR = 8;
  const SERVICE_END_HOUR = 20; // 8 PM
  const SLOT_DURATION = 1; // 1 hour slots
  const ADVANCE_BOOKING_HOURS = 3; // Must book 3 hours in advance

  // Get current time
  const now = dayjs();

  // ✅ Generate available time slots
  const generateAvailableSlots = (date) => {
    const selectedDayjs = dayjs(
      `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      'YYYY-M-D'
    );
    const isToday = selectedDayjs.isSame(now, 'day');

    const slots = [];

    // If today: show only slots 3+ hours from now, up to 8 PM
    if (isToday) {
      const earliestHour = Math.ceil(now.hour() + ADVANCE_BOOKING_HOURS + now.minute() / 60);

      // If earliest hour exceeds 8 PM, return empty (no slots today)
      if (earliestHour > SERVICE_END_HOUR) {
        return [];
      }

      for (let hour = earliestHour; hour <= SERVICE_END_HOUR; hour++) {
        slots.push({
          hour,
          label: dayjs().hour(hour).minute(0).format('h:mm A'),
          disabled: false,
        });
      }
    }
    // If tomorrow or later: show all service hours
    else {
      for (let hour = SERVICE_START_HOUR; hour <= SERVICE_END_HOUR; hour++) {
        slots.push({
          hour,
          label: dayjs().hour(hour).minute(0).format('h:mm A'),
          disabled: false,
        });
      }
    }

    return slots;
  };

  // Update available times when date changes
  useEffect(() => {
    if (selectedDate) {
      const slots = generateAvailableSlots(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth(), selectedDate)
      );
      setAvailableTimes(slots);
      // Auto-select first available slot
      if (slots.length > 0 && !selectedTime) {
        setSelectedTime(slots[0].label);
      } else {
        setSelectedTime(null);
      }
    }
  }, [selectedDate, currentMonth]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const handlePrevMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
    // Don't allow going to past months
    if (newMonth >= new Date(now.year(), now.month())) {
      setCurrentMonth(newMonth);
      setSelectedDate(null);
      setSelectedTime(null);
    }
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    setSelectedDate(null);
    setSelectedTime(null);
  };

  // 🔥 UPDATED: Close modal after confirming
  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onConfirm({
        date: selectedDate,
        month: currentMonth,
        time: selectedTime,
      });
      
      // ✅ Close modal immediately after confirmation
      onClose();
      
      // Reset form for next use
      setTimeout(() => {
        setSelectedDate(null);
        setSelectedTime(null);
        setCurrentMonth(new Date());
      }, 0);
    }
  };

  const days = getDaysInMonth(currentMonth);
  const todayDate = now.date();
  const todayMonth = now.month();
  const todayYear = now.year();

  // Check if date is disabled (past dates)
  const isDateDisabled = (day) => {
    if (!day) return false;
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const startOfToday = new Date(todayYear, todayMonth, todayDate);
    return checkDate < startOfToday;
  };

  // Check if date is today
  const isToday = (day) => {
    if (!day) return false;
    return (
      day === todayDate &&
      currentMonth.getMonth() === todayMonth &&
      currentMonth.getFullYear() === todayYear
    );
  };

  // Check if date is tomorrow
  const isTomorrow = (day) => {
    if (!day) return false;
    const tomorrow = new Date(todayYear, todayMonth, todayDate + 1);
    return (
      day === tomorrow.getDate() &&
      currentMonth.getMonth() === tomorrow.getMonth() &&
      currentMonth.getFullYear() === tomorrow.getFullYear()
    );
  };

  // Check if today has no available slots
  const todayHasNoSlots = () => {
    const todaySlots = generateAvailableSlots(
      new Date(todayYear, todayMonth, todayDate)
    );
    return todaySlots.length === 0;
  };

  // Auto-select tomorrow if today has no slots and not yet selected
  useEffect(() => {
    if (open && !selectedDate && todayHasNoSlots()) {
      const tomorrow = new Date(todayYear, todayMonth, todayDate + 1);
      if (
        tomorrow.getFullYear() === currentMonth.getFullYear() &&
        tomorrow.getMonth() === currentMonth.getMonth()
      ) {
        setSelectedDate(tomorrow.getDate());
      }
    }
  }, [open, currentMonth]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          maxWidth: '500px',
          m: 2,
        },
      }}
    >
      <Box sx={{ backgroundColor: 'white' }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 3,
            backgroundColor: '#D4EAE8',
            borderRadius: '16px 16px 0 0',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontFamily: 'var(--font-inter)',
              fontWeight: 700,
              color: '#1F2937',
              fontSize: '20px',
            }}
          >
            Select Date & Time
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              color: '#037166',
              width: 32,
              height: 32,
            }}
          >
            <CloseIcon sx={{ fontSize: '24px' }} />
          </IconButton>
        </Box>

        {/* Calendar Section */}
        <Box sx={{ p: 3 }}>
          {/* Month Navigation */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'var(--font-inter)',
                fontWeight: 700,
                color: '#1F2937',
                fontSize: '18px',
              }}
            >
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}{' '}
              <ChevronRightIcon
                sx={{
                  display: 'inline',
                  color: '#037166',
                  fontSize: '20px',
                }}
              />
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                onClick={handlePrevMonth}
                size="small"
                sx={{
                  backgroundColor: '#F3F4F6',
                  width: 36,
                  height: 36,
                  '&:hover': { backgroundColor: '#E5E7EB' },
                }}
              >
                <ChevronLeftIcon
                  sx={{
                    color: '#037166',
                    fontSize: '20px',
                  }}
                />
              </IconButton>
              <IconButton
                onClick={handleNextMonth}
                size="small"
                sx={{
                  backgroundColor: '#F3F4F6',
                  width: 36,
                  height: 36,
                  '&:hover': { backgroundColor: '#E5E7EB' },
                }}
              >
                <ChevronRightIcon
                  sx={{
                    color: '#037166',
                    fontSize: '20px',
                  }}
                />
              </IconButton>
            </Box>
          </Box>

          {/* Day Names */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 1.5,
              mb: 2,
            }}
          >
            {dayNames.map((day) => (
              <Typography
                key={day}
                sx={{
                  fontFamily: 'var(--font-inter)',
                  fontWeight: 600,
                  color: '#9CA3AF',
                  textAlign: 'center',
                  fontSize: '12px',
                }}
              >
                {day}
              </Typography>
            ))}
          </Box>

          {/* Calendar Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 1.5,
              mb: 4,
            }}
          >
            {days.map((day, index) => {
              const disabled = isDateDisabled(day);
              const isTodayDate = isToday(day);
              const isTomorrowDate = isTomorrow(day);
              const isSelected = day === selectedDate;

              // 🔥 If today has no slots, show grey. Otherwise, show light green
              const hasTodayNoSlots = todayHasNoSlots();
              const shouldBeGrey = isTodayDate && hasTodayNoSlots;
              const shouldBeGreen = isTomorrowDate && hasTodayNoSlots && !isSelected;

              return (
                <Box
                  key={index}
                  onClick={() => !disabled && day && setSelectedDate(day)}
                  sx={{
                    height: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: disabled ? 'default' : day ? 'pointer' : 'default',
                    borderRadius: '8px',
                    backgroundColor: isSelected
                      ? '#C2E0DD'
                      : shouldBeGrey
                      ? '#D1D5DB'
                      : shouldBeGreen
                      ? '#C8E6C9'
                      : isTodayDate
                      ? '#E0F2F1'
                      : 'transparent',
                    opacity: disabled ? 0.3 : 1,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor:
                        !disabled && day && !isSelected ? '#F3F4F6' : undefined,
                    },
                  }}
                >
                  {day && (
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-inter)',
                        fontWeight: isSelected || isTodayDate || isTomorrowDate ? 700 : 400,
                        color:
                          isSelected || isTodayDate || isTomorrowDate
                            ? shouldBeGrey
                              ? '#6B7280'
                              : '#037166'
                            : '#1F2937',
                        fontSize: '16px',
                      }}
                    >
                      {day}
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Box>

          {/* Available Time Section */}
          <Box
            sx={{
              backgroundColor: '#D4EAE8',
              p: 3,
              borderRadius: '12px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'var(--font-inter)',
                  fontWeight: 700,
                  color: '#1F2937',
                  fontSize: '16px',
                }}
              >
                Available Time
              </Typography>

              {selectedTime && (
                <Box
                  sx={{
                    backgroundColor: '#037166',
                    color: 'white',
                    px: 3,
                    py: 1,
                    borderRadius: '8px',
                    fontFamily: 'var(--font-inter)',
                    fontWeight: 600,
                    fontSize: '16px',
                  }}
                >
                  {selectedTime}
                </Box>
              )}
            </Box>

            {selectedDate ? (
              <>
                {availableTimes.length > 0 ? (
                  <>
                    {/* Time Slots - Horizontal Scrollable */}
                    <Box
                      ref={scrollContainerRef}
                      sx={{
                        display: 'flex',
                        gap: 1.5,
                        overflowX: 'auto',
                        overflowY: 'hidden',
                        pb: 1,
                        mb: 2,
                        '&::-webkit-scrollbar': {
                          height: '4px',
                        },
                        '&::-webkit-scrollbar-track': {
                          backgroundColor: 'rgba(0, 0, 0, 0.1)',
                          borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                          backgroundColor: '#037166',
                          borderRadius: '4px',
                          '&:hover': {
                            backgroundColor: '#025951',
                          },
                        },
                      }}
                    >
                      {availableTimes.map((slot) => (
                        <Button
                          key={slot.label}
                          onClick={() => setSelectedTime(slot.label)}
                          sx={{
                            minWidth: '90px',
                            height: '40px',
                            borderRadius: '8px',
                            backgroundColor:
                              selectedTime === slot.label ? '#037166' : 'white',
                            color:
                              selectedTime === slot.label ? 'white' : '#1F2937',
                            fontFamily: 'var(--font-inter)',
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '14px',
                            border:
                              selectedTime === slot.label
                                ? 'none'
                                : '1px solid #E5E7EB',
                            transition: 'all 0.2s ease',
                            flexShrink: 0,
                            '&:hover': {
                              backgroundColor:
                                selectedTime === slot.label
                                  ? '#025951'
                                  : '#F3F4F6',
                            },
                          }}
                        >
                          {slot.label}
                        </Button>
                      ))}
                    </Box>

                    {/* Info Text for Today */}
                    {isToday(selectedDate) && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          backgroundColor: 'rgba(3, 113, 102, 0.1)',
                          px: 2,
                          py: 1,
                          borderRadius: '6px',
                          mb: 2,
                        }}
                      >
                        <InfoIcon
                          sx={{
                            fontSize: '14px',
                            color: '#037166',
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          sx={{
                            fontFamily: 'var(--font-inter)',
                            fontSize: '11px',
                            color: '#037166',
                            fontWeight: 500,
                          }}
                        >
                          Minimum 3 hours advance booking required
                        </Typography>
                      </Box>
                    )}
                  </>
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      backgroundColor: 'rgba(3, 113, 102, 0.1)',
                      px: 2,
                      py: 2,
                      borderRadius: '6px',
                      mb: 2,
                    }}
                  >
                    <InfoIcon
                      sx={{
                        fontSize: '16px',
                        color: '#037166',
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '13px',
                        color: '#037166',
                        fontWeight: 500,
                      }}
                    >
                      No slots available for this date
                    </Typography>
                  </Box>
                )}

                {/* Confirm Button */}
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleConfirm}
                  disabled={!selectedDate || !selectedTime}
                  sx={{
                    mt: 2,
                    height: '48px',
                    borderRadius: '8px',
                    backgroundColor: '#037166',
                    color: 'white',
                    fontFamily: 'var(--font-inter)',
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#025951',
                    },
                    '&:disabled': {
                      backgroundColor: '#D1D5DB',
                      color: '#9CA3AF',
                      cursor: 'not-allowed',
                    },
                  }}
                >
                  Confirm Time
                </Button>
              </>
            ) : (
              <Typography
                sx={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '13px',
                  color: '#6B7280',
                  textAlign: 'center',
                  py: 2,
                }}
              >
                Please select a date to see available time slots
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
