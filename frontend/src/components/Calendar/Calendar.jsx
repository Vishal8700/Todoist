import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function Calendar({ tasks, meetings, onSelectSlot, onSelectEvent }) {
  const events = [
    ...tasks.map(task => ({
      id: task.id,
      title: task.title,
      start: new Date(task.dueDate),
      end: new Date(task.dueDate),
      allDay: true,
      type: 'task',
    })),
    ...meetings.map(meeting => ({
      id: meeting.id,
      title: meeting.title,
      start: new Date(meeting.startTime),
      end: new Date(meeting.endTime),
      type: 'meeting',
    })),
  ];

  return (
    <div className="calendar-container">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectSlot={onSelectSlot}
        onSelectEvent={onSelectEvent}
        selectable
        views={['month', 'week', 'day', 'agenda']}
        eventPropGetter={(event) => ({
          className: `event-${event.type}`,
        })}
      />
    </div>
  );
}

export default Calendar;