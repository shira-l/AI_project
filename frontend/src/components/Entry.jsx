
import { useForm } from "react-hook-form";
import WebCreation from './WebCreation';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import download from "downloadjs";
import Form from "./Form";

export default function Entry() {
    const [viewForm, setViewForm] = useState(false)
    return (<>
        {!viewForm ?
            <div>
                <h1>Wellcome to To Make Business!</h1>
                <p>
                    Dreaming of starting a business?<br/>
                    Do you already have one, but it's not profitable?<br/>
                    Let us help you increase your sales!
                </p>
                <button onClick={() => setViewForm(true)} >Let's do it!</button>
            </div>
            : <Form />}
    </>)
}