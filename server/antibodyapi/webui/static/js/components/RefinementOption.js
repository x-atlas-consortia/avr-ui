import React, {useRef, useEffect} from 'react';

/**
 * Displays a checkbox w/ a label that replaces the default data type string.
 * @param {object} props
 */
const RefinementOption = (props) => {
  const labelRef = useRef(null)

  const fetchData = async () => {
    const res = await fetch(`https://ontology.api.hubmapconsortium.org/celltypes/${props.label.replace('CL:', '')}`)
    if (res.ok) {
      const result = await res.json()
      if (Array.isArray(result) && result.length) {
        labelRef.current.setAttribute('title', result[0].cell_type.name)
      }
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div
      role="checkbox"
      onChange={() => {}}
      className={props.bemBlocks
        .option()
        .state({ selected: props.active })
        .mix(props.bemBlocks.container('item'))}
      tabIndex={0}
      aria-checked={props.active}
      checked={props.active}
    >
        <input
          type="checkbox"
          onChange={() => {}}
          onClick={(...args) => {
            return props.onClick(...args);
          }}
          checked={props.active}
          className="sk-item-list-option__checkbox"
        />
        <span className={props.bemBlocks.option('text')} ref={labelRef} title={props.label}>
          {props.label}
        </span>
     
      <div className={props.bemBlocks.option('count')}>{props.count}</div>
    </div>
  );
};

export default RefinementOption