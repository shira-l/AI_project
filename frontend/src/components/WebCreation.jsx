import React, { useState } from 'react';
import MultipleSelectChip from './MultipleSelectChip'
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { SketchPicker } from "react-color";
import download from "downloadjs";

export default function WebCreation(props) {
    const { businessDetails } = props;
    const [selectedSections, setSelectedSections] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [color, setColor] = useState();
    const [blob, setBlob] = useState()
    const [isCreate, setISCreate] = useState(false)
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
            const htmlBlob = await response.blob();
            setBlob(htmlBlob);
            setISCreate(true)
            if (!response.ok) {
                console.error(response.error);
            }
        }

        catch (error) {
            console.error(error);
        };
    }

    const removeColor=()=>{
        let updateColors=selectedColors.pop()
        selectedColors(updateColors)
    }
    const handleChangeSections = (event) => {
        const { target: { value }, } = event;
        setSelectedSections(typeof value === 'string' ? value.split(',') : value,);
    };
    return (<>
        <div style={{ display: 'flex', flexDirection: "column", alignItems: "center", justifyContent: "space-around", height: "600px" }}>
            <p>Let's create the first website for your business</p>
            <MultipleSelectChip handleChange={handleChangeSections} selectedOptions={selectedSections} />
            <SketchPicker
                color={color}
                onChange={(updatedColor) => setColor(updatedColor.hex)}
            />
            <button onClick={() => { setSelectedColors(colors => [...colors, color]) }}>Add Color</button>
            <div style={{ height: "auto" }}>
                <span>Your colors: </span>
                {selectedColors.map(color => (<span style={{ width: "20px", height: "10px", backgroundColor: ` ${color}`, marginRight: "7px" ,padding:"2px"}}>{color}</span>))}
                {selectedColors.length && <IconButton aria-label="delete" onClick={removeColor} >
                    <DeleteIcon />
                </IconButton>}</div>
        </div>

        <button onClick={creatWebPage}>Create</button>
        {isCreate && <div> <button><a href="http://localhost:3001/landingPage.html"
            target="_blank"> Preview </a></button>
            <button onClick={() => download(blob, "webPage.html")}> download html</button></div>}


    </>)
}