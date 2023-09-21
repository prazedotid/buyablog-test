import * as React from 'react'

type Hook = (fn: () => void, inputs: unknown[]) => void

const useFirstUpdate: Hook = (fn, inputs) => {
  const firstUpdate = React.useRef(true)

  React.useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    fn()
  }, inputs)
};

export default useFirstUpdate