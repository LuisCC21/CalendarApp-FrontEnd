import { useEffect, useState } from 'react'
import { Calendar } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import {
  NavBar,
  CalendarEvent,
  CalendarModal,
  FabAddNew,
  FabDelete,
} from '../index'
import { localizer, getMessagesES } from '../../helpers'
import { useUiStore, useCalendarStore, useAuthStore } from '../../hooks'

export const CalendarPage = () => {
  const { openDateModal } = useUiStore()
  const { user } = useAuthStore()
  const { events, setActiveEvent, startLoadingEvent } = useCalendarStore()

  const [lastView, setLastView] = useState(
    localStorage.getItem('lastView') || 'week'
  )

  const eventSyleGetter = (event, start, end, isSelected) => {
    //console.log(event,start,end,isSelected);

    const isMyEvent =
      user.payload?.uid === event.user?.uid ||
      user.payload?.uid === event.user?._id
    console.log(isMyEvent)

    const style = {
      backgroundColor: isMyEvent ? '#347CF7' : '#465660',
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white',
    }
    return {
      style,
    }
  }

  const onDobleClick = (event) => {
    // console.log({onDobleClick:event})
    openDateModal()
  }
  const onSelect = (event) => {
    setActiveEvent(event)
  }

  const onViewChanged = (event) => {
    localStorage.setItem('lastView', event)
    setLastView(event)
  }

  useEffect(() => {
    startLoadingEvent()
  }, [])

  return (
    <>
      <NavBar />

      <Calendar
        culture='es'
        localizer={localizer}
        events={events}
        defaultView={lastView}
        startAccessor='start'
        endAccessor='end'
        style={{ height: 'calc(100vh - 80px)' }}
        messages={getMessagesES()}
        eventPropGetter={eventSyleGetter}
        components={{
          event: CalendarEvent,
        }}
        onDoubleClickEvent={onDobleClick}
        onSelectEvent={onSelect}
        onView={onViewChanged}
      />

      <CalendarModal />

      <FabAddNew />

      <FabDelete />
    </>
  )
}
