import React, { useState } from 'react';
import MultipleSelectChip from './MultipleSelectChip'
import Button from '@mui/material/Button';


export default function WebCreation(props) {
    const { businessDetails } = props;
    const [selectedSections, setSelectedSections] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);

    const creatWebPage = async () => {
        const body = {
            ...businessDetails,
            colors: selectedColors,
            sections: selectedSections
        }
        try {
            const response = await fetch('http://localhost:3001/getWebPage', {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                console.error(response.error);
            }
        }

        catch (error) {
            console.error(error);
        };
    }

    const handleChangeColors = (event) => {
        const { target: { value }, } = event;
        setSelectedColors(typeof value === 'string' ? value.split(',') : value,);
    }

    const handleChangeSections = (event) => {
        const { target: { value }, } = event;
        setSelectedSections(typeof value === 'string' ? value.split(',') : value,);
    };
    return (<>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <MultipleSelectChip type={"Sections"} handleChange={handleChangeSections} selectedOptions={selectedSections} />
            <MultipleSelectChip type={"Colors"} handleChange={handleChangeColors} selectedOptions={selectedColors} />
        </div>
        <button onClick={creatWebPage}>Create</button>
       <button><a href="http://localhost:3001/landingPage.html"
            target="_blank"> Preview </a></button>
       
    </>)
}