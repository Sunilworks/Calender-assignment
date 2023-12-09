import React, { useState, useEffect } from 'react';
import './calender.css'
import DatePicker from 'react-datepicker';
import moment from 'moment-timezone';
import 'react-datepicker/dist/react-datepicker.css';
import jsondata from '../data/mockdata.json';

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeZone, setTimeZone] = useState('UTC-0');
  const [timeSlots, setTimeSlots] = useState([]);
  const [currentDate] = useState(new Date());
  const [data, setData] = useState(null);
  const [startHour, setStartHour] = useState(8);
  const [endHour, setEndHour] = useState(23);


  // handle date change from Datepicker component
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // handle timezone change from dropdown menu
  const handleTimeZoneChange = (e) => {
    const currentTimeZone = e.target.value;
    setTimeZone(currentTimeZone);

    //changing working times based on timezones

    if(currentTimeZone === "UTC+9:30"){
      setStartHour(10);
      setEndHour(21);
    }
    else if(currentTimeZone === "UTC-8"){
      setStartHour(3);
      setEndHour(17);
    }else if(currentTimeZone === "UTC+5:30"){
      setStartHour(8);
      setEndHour(23);
    }
  };

  // changing to next week from next week button on top bar
  const goToNextWeek = () => {
    setSelectedDate(moment(selectedDate).add(1, 'week').toDate());
  };

  // changing to prev week from prev week button on top bar
  const goToPreviousWeek = () => {
    setSelectedDate(moment(selectedDate).subtract(1, 'week').toDate());
  };

  // Define a function to generate time slots with 30-minute intervals.
  const generateTimeSlots = () => {

    const timeSlots = [];
    let currentTime = moment().set({ hour: startHour, minute: 0, second: 0 });
    const endTime = moment().set({ hour: endHour, minute: 0, second: 0 });

    while (currentTime.isSameOrBefore(endTime)) {
      timeSlots.push(currentTime.format('HH:mm'));
      currentTime.add(30, 'minutes');
    }

    return timeSlots;
  };


  
  useEffect(() => {
    const filteredTimeSlots = generateTimeSlots();
    setTimeSlots(filteredTimeSlots);
    setData(jsondata);
  }, [timeZone]);

  return (
    <div>
      <div>
        {/* Top Bar */}
        <div className='top-bar'>
          <button onClick={goToPreviousWeek}>Previous Week</button>
          <DatePicker selected={selectedDate} onChange={handleDateChange} dateFormat="yyyy-MMM-dd" className='datepicker' />
          <button onClick={goToNextWeek} className=''>Next Week</button>
        </div>

        {/* Drop Down List */}
        <div className='dropdown-list '>
          <h3 className=' text-lg font-semibold'>Timezone :</h3>
          <select value={timeZone} onChange={handleTimeZoneChange} >
            <option value="UTC+5:30">[UTC+5:30] India Standard Time</option>
            <option value="UTC+9:30">[UTC+9:30] Australia Standard Time</option>
            <option value="UTC-8">[UTC-8] Pacific Standard Time</option>
          </select>
        </div>

      </div>

      <div>

        <div className="main-content">

          <div className='flex flex-col items-start justify-start'>
            {Array.from({ length: 7 }).map((_, dayIndex) => {
              const currentDateForDay = moment(selectedDate).add(dayIndex, 'days');
              const isPast = currentDateForDay < currentDate;

              return (
                // div that contains day and date on left and times with checkboxes on right
                <div className='flex w-[100%]' key={dayIndex}>

                  <div className="day-header">
                    <h2>{moment(currentDateForDay).format('ddd')}</h2>
                    <p>{moment(currentDateForDay).format('MMM D')}</p>
                  </div>

                  {/* check if the date is passed or is weekend if not then shows checkboxes */}
                  <div className="times-checkboxes-container">
                    {isPast ? (
                      <label className="past-label">Past</label>
                    ) : currentDateForDay.format('d') >= 6 || currentDateForDay.format('d') < 1  ? (
                      <label className="weekend-label">Weekend</label>
                    ) : (
                      timeSlots.map((time, index) => {


                        const timeSlotId = `time-slot-${index}-${dayIndex}`;


                        const currentDateForDayFormatted = moment(currentDateForDay).format('YYYY-MM-DD');

                        // check if the checkbox data is there in mockjson data to check the box by default , returns true or false
                        const isChecked = data.some((item) => {
                          const dateMatches = moment(item.Date).isSame(currentDateForDayFormatted, 'day');
                          const timeMatches = item.Time === time;
                          return dateMatches && timeMatches;
                        });

                        return (
                          // return checkboxes with times day
                          <div key={index} className='m-2'>
                            <div>
                              <input type="checkbox" id={timeSlotId} defaultChecked={isChecked} className='checkbox'/>
                              <label htmlFor={timeSlotId}>{time}</label>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                </div>
              );

            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
