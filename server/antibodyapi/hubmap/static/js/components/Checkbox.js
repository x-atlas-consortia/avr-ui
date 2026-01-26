import React from 'react';

function Checkbox(props) {
  const label = props.label;
  const elt = props.element;
  const handleChange = props.handleChange;
  const isChecked = props.isChecked;

  const handleToggle = (event) => {
    handleChange(elt, event.target.checked);
  }

  const isCheckedCheck = () => {
    return isChecked(elt);
  }

  return (
    <div>
      <input
      className='form-check-input'
       type="checkbox"
             id={`${elt}_checkbox_id`}
             onChange={handleToggle}
             checked={isCheckedCheck()}
      /> &nbsp;
      {label}
    </div>
  );
};

export {Checkbox};
