import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from '@fullcalendar/interaction' // a plugin!

export default function Calendar({onDateSelect}) {
  const onSelect = (date) => {
    onDateSelect(date);
  }


  return (
    <FullCalendar
      plugins={[ dayGridPlugin, interactionPlugin ]}
      initialView="dayGridMonth"
      events={[
        { title: 'Event 1', date: '2024-09-06' },
        { title: 'Event 2', date: '2022-01-05' },
        { title: 'Event 3', date: '2022-01-10' },
      ]}
      eventColor='#FF8C8C'
      eventDisplay='background'
      weekends={false}
      validRange={() => {
        return {
          start: new Date(),
          end: new Date(new Date().setDate(new Date().getDate() + 60))
        }
      }}
      selectable={true}
      select={onSelect}
    />
  )
}