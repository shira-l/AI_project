import React from 'react';
import MultipleSelectChip from './MultipleSelectChip'
export default function WebCreation(props) {
    const{businessDetails}=props;
    return (<>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <MultipleSelectChip type={"options"} />
            <MultipleSelectChip type={"colors"} />
        </div>
        <button>Create</button>
    </>)
}