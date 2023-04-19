import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import calendarApi from '../../api/calendarApi'
import { convertEventToDateEvents } from '../helpers'

import {
  onSetActiveEvent,
  onAddNewEvent,
  onUpdateEvent,
  onDeleteEvent,
  onLoadEvents,
} from '../store'

export const useCalendarStore = () => {
  const { events, activeEvent } = useSelector((state) => state.calendar)
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const setActiveEvent = (calendarEvent) => {
    dispatch(onSetActiveEvent(calendarEvent))
  }

  const startSavingEvent = async (calendarEvent) => {
    //TODO: LLegar al backend

    //todo bien

    try {
      if (calendarEvent?.id) {
        //Actualizando evento
        await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent)

        dispatch(onUpdateEvent({ ...calendarEvent, user }))
        return
      }

      //Creando evento
      const { data } = await calendarApi.post('/events', calendarEvent)
      dispatch(
        onAddNewEvent({ ...calendarEvent, id: data?.evento.id, user: user })
      )
    } catch (error) {
      console.log(error)
      Swal.fire('Error al guardar', error.response?.data?.msg, 'error')
    }
  }

  const startDeleteEvent = async () => {
    //TODO: llegar al backed

    try {
      await calendarApi.delete(`/events/${activeEvent.id}`)
      dispatch(onDeleteEvent())
    } catch (error) {
      console.log(error)
      Swal.fire('Error al eliminar', error.response?.data?.msg, 'error')
    }
  }

  const startLoadingEvent = async () => {
    try {
      const { data } = await calendarApi.get('/events')
      const events = convertEventToDateEvents(data?.msg)

      dispatch(onLoadEvents(events))
    } catch (error) {
      console.log(error)
    }
  }
  return {
    //*Propiedades
    events,
    activeEvent,
    hasEventSelected: !!activeEvent,

    //*Metodos
    setActiveEvent,
    startSavingEvent,
    startDeleteEvent,
    startLoadingEvent,
  }
}
