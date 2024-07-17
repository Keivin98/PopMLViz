import React, { useState } from 'react';
import './switch.css';

const Switch = ({ id = 'switch', disabled = false, theme = 'one', name = 'switch', labelLeft, labelRight, onChange }) => {
    const [checked, setChecked] = useState(false);

    const handleOnChanged = (e) => {
        setChecked(e.target.checked);
        if (onChange) {
            onChange(e);
        }
    };

    return (
        <div className={`input-switch${disabled ? ' disabled' : ''} style-switch-${theme}`}>
            {labelLeft ? <label htmlFor={name}>{labelLeft}</label> : null}
            <input
                type="checkbox"
                id={name}
                name={name}
                checked={onChange ? checked : checked}
                disabled={disabled}
                onChange={handleOnChanged}
            />
            <label htmlFor={name}></label>
            {labelRight ? <label htmlFor={name}>{labelRight}</label> : null}
        </div>
    );
};

export default Switch;
