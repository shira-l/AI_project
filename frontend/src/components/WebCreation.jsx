import React, { useState } from 'react';
import MultipleSelectChip from './MultipleSelectChip'
import { SketchPicker } from "react-color";


export default function WebCreation(props) {
    const { businessDetails } = props;
    const [selectedSections, setSelectedSections] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [color, setColor] = useState("lightblue");

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

    const handleChangeSections = (event) => {
        const { target: { value }, } = event;
        setSelectedSections(typeof value === 'string' ? value.split(',') : value,);
    };
    return (<>
        <div style={{ display: 'flex', flexDirection:"column",alignItems:"center",}}>
            <MultipleSelectChip handleChange={handleChangeSections} selectedOptions={selectedSections} />
         <SketchPicker
            color={color}
            onChange={(updatedColor) => setColor(updatedColor.hex)}
        />
        <button onClick={() => { setSelectedColors(colors => [...colors, color]); console.log(selectedColors) }}>Add Color</button>
</div>
       
        <button onClick={creatWebPage}>Create</button>
       <button><a href="http://localhost:3001/landingPage.html"
            target="_blank"> Preview </a></button>
       
    </>)
}