'use client'

import { ReactNode, useId, useState } from 'react'
import BaseDatePicker from '@prazedotid/tailwind-datepicker-react'
import { IOptions } from '@prazedotid/tailwind-datepicker-react/types/Options'

interface DatePickerProps {
  children?: ReactNode;
  onChange: (date: Date | null) => void;
  placeholder?: string;
}

export default function DatePicker({onChange, placeholder}: DatePickerProps) {
  const id = useId()
  const [show, setShow] = useState<boolean>(false)
  const datePickerOptions: IOptions = {
    autoHide: true,
    todayBtn: true,
    clearBtn: true,
    defaultDate: null,
    inputPlaceholderProp: placeholder,
    inputDateFormatProp: {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    },
    theme: {
      background: '',
      todayBtn: '',
      clearBtn: '',
      icons: '',
      text: '',
      disabledText: '',
      input: '',
      inputIcon: '',
      selected: '',
    },
  }

  // useEffect(() => {
  //   window.addEventListener('click', (e: Event) => {
  //     const target = e.target as HTMLElement
  //
  //     if (document.getElementById(id)?.contains(target)) {
  //       return
  //     }
  //
  //     if (target.tagName.toLowerCase() === 'button' && target.innerHTML === 'Clear') {
  //       onChange(null)
  //     }
  //
  //     setShow(false)
  //   })
  // }, [setShow])

  function onStateChange(val: any) {
    onChange(val)
  }

  return (
    <div id={id}>
      <BaseDatePicker onChange={onStateChange} show={show} setShow={(state) => setShow(state)}
                      options={datePickerOptions}/>
    </div>
  )
}