import { addHours, differenceInSeconds } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { useUiStore } from '../../hooks/useUiStore';
import Modal from 'react-modal'
import DatePicker,{registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import es from 'date-fns/locale/es';

import { useCalendarStore } from '../../hooks';
registerLocale('es', es)



const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  Modal.setAppElement('#root');

export const CalendarModal = () => {
    const {isDateModalOpen,closeDateModal}=useUiStore();
    const {activeEvent,startSavingEvent}=useCalendarStore();

    const [formSubmitted, setFormSubmitted] = useState(false);
   
    
    

    const [formValue, setformValue] = useState({
      title:'',
      notes:'',
      start:new Date(),
      end: addHours(new Date(),2),

    });

   const tittleClass= useMemo(() => {
       
          if(!formSubmitted ) return '';

          return(formValue.title.length>0) ? '' : 'is-invalid';


    }, [formValue.title, formSubmitted])

    
    useEffect(() => {
      if(activeEvent!==null){
        setformValue({
          ...activeEvent
        })
      }
      
    }, [activeEvent])
    
    
    

    const onInputChanged=({target})=>{
        setformValue({
          ...formValue,
          [target.name]:target.value
        })

    }

    const onCloseModal =()=>{
        //console.log('cerrando modal');
        closeDateModal()
        //toggleDateModal()
        
       
    }

    const onDateChange=(event,changing)=>{
        setformValue({
          ...formValue,
          [changing]:event
        })
        
      
    }

    const onSubmit= async (event)=>{
      event.preventDefault();
      setFormSubmitted(true);
      const difference = differenceInSeconds(formValue.end,formValue.start);

      if(isNaN(difference) || difference <=0){
        Swal.fire('Fechas incorrectas', 'Revisar las fechas ingresadas', 'error')
        return;
      }

      if(formValue.title.length<=0) return;
      
     await startSavingEvent(formValue);
      closeDateModal();

      setFormSubmitted(false);
      console.log(formValue)
    }
   
  return (
   <Modal
        isOpen={isDateModalOpen}
        onRequestClose={onCloseModal}
        style={customStyles}
        className="modal"
        overlayClassName={"modal-fondo"}
        closeTimeoutMS={200}
    
   >
       <h1> Nuevo evento </h1>
     <hr />
      <form className="container" onSubmit={onSubmit}>

        <div className="form-group mb-2">
            <label>Fecha y hora inicio</label>
            <DatePicker selected={formValue.start} onChange={(event)=>{onDateChange(event,'start')}}  dateFormat="Pp" showTimeSelect locale="es" timeCaption='Hora'/>
        </div>

        <div className="form-group mb-2">
            <label>Fecha y hora fin</label>
            <DatePicker minDate={formValue.start} selected={formValue.end} onChange={(event)=>{onDateChange(event,'end')}}  dateFormat={"Pp"} showTimeSelect locale="es" timeCaption='Hora'/>
        </div>

        <hr />
        <div className="form-group mb-2">
            <label>Titulo y notas</label>
            <input 
                type="text" 
                className={`form-control ${tittleClass}`}
                placeholder="Título del evento"
                name="title"
                onChange={onInputChanged} 
                value={formValue.title}
                autoComplete="off"
            />
            <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
        </div>

        <div className="form-group mb-2">
            <textarea 
                type="text" 
                className="form-control"
                placeholder="Notas"
                onChange={onInputChanged} 
                value={formValue.notes}
                rows="5"
                name="notes"
            ></textarea>
            <small id="emailHelp" className="form-text text-muted">Información adicional</small>
        </div>

        <button
            type="submit"
            className="btn btn-outline-primary btn-block"
           
        >
            <i className="far fa-save"></i>
            <span> Guardar</span>
        </button>

    </form>
  </Modal>

  )
}
