import { saveAs } from 'file-saver';
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

export default function Form() {
  const [selectedNodeKey, setSelectedNodeKey] = useState('type of business');
  const [displayButtons, setDisplayButtons] = useState(false)
  const [displayWebCreation, setDisplayWebCreation] = useState(false);
  const [businessDetails, setBusinessDetails] = useState({});
  const [blob, setBlob] = useState(null)
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      name: '',
      email: '',
      companyType: selectedNodeKey,
      description: '',
      purpose: '',
      about: ''
    }
  })



  const optionsOfCompaniesTypes = [
    "Restaurant/Catering",
    "Store",
    "Guesthouse",
    "Real Estate Company",
    "Delivery",
    "Startup"
  ]
  // function blobToSaveAs(fileName, blob) {
  //   try {
  //     const url = window.URL.createObjectURL(blob);
  //     const link = document.createElement('a');
  //     if (link.download !== undefined) { // feature detection
  //       link.setAttribute('href', url);
  //       link.textContent = "for dowload";
  //       link.setAttribute('download', fileName);
  //       document.body.appendChild(link);
  //     }
  //   } catch (e) {
  //     console.error('BlobToSaveAs error', e);
  //   }
  // }
  const generateCharacterizationFile = async (details) => {
    try {
      setBusinessDetails(details)
      const response = await fetch('http://localhost:3001/createCharacterizationFile', {
        method: 'POST',
        body: JSON.stringify(details),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const pdfBlob = await response.blob();
      console.log("pdfBlob")
      console.log(pdfBlob)
      setBlob(pdfBlob);
      setDisplayButtons(true);
      if (!response.ok) {
        throw new Error(data.error);
      }
    } catch (error) {
      throw error;
    };
  }

  return (<form onSubmit={handleSubmit(generateCharacterizationFile)}>

    <FormControl sx={{ m: 1, width: '22ch' }} variant="standard">
      <TextField name="name"
        label="name" type="text" variant="standard"
        {...register("name", {
          required: "Please enter your name.",
          pattern: {
            value: /^[a-z\u0590-\u05fe]+$/i,
            message: "Please enter only alphabetic characters."
          }
        })}
        helperText={errors.name ? errors.name.message : ''} />
    </FormControl>

    <FormControl sx={{ m: 1, width: '22ch' }} variant="standard">
      <TextField name="email"
        label="email" type="text" variant="standard"
        {...register("email", {
          required: "please enter your email",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'please enter a valid email'
          }
        })}
        helperText={errors.email ? errors.email?.message : ''} />
    </FormControl>
    <br />

    <FormControl sx={{ m: 1, minWidth: 300 }}>
      <InputLabel id="demo-simple-select-required-label">{selectedNodeKey}</InputLabel>
      <Select
        labelId="demo-simple-select-required-label"
        id="demo-simple-select-required"
        onChange={(e) => { setSelectedNodeKey(e.target.value) }}
        label={selectedNodeKey}
        {...register("companyType", { required: "required" })}
      >
        <MenuItem value="">
          <em>{selectedNodeKey}</em>
        </MenuItem>
        {optionsOfCompaniesTypes.map((el, i) => (<MenuItem key={i} value={el}>{el}
        </MenuItem>))}
      </Select>
      <FormHelperText>{errors[selectedNodeKey] ? errors[selectedNodeKey].message : ''}</FormHelperText>
    </FormControl>

    <br />
    <div style={{ display: 'flex', justifyContent: 'space-around', width: 800, marginTop: 50 }}>
      <textarea style={{ resize: 'none', padding: 12 }} rows={7} placeholder='description' cols={30}
        {...register("description")} />

      <textarea style={{ resize: 'none', padding: 12 }} rows={7} placeholder='purpose' cols={30}
        {...register("purpose")} />

      <textarea style={{ resize: 'none', padding: 12 }} placeholder='about' cols={30}
        rows={7}
        {...register("about")} />
    </div>
    <button type='submit'>SEND</button>
    {displayButtons && <div>
      {console.log("Blob")}
      {console.log(blob)}
      <button onClick={() => download(blob, "SpecificationFile.pdf")}>download PDF</button>
      <button onClick={() => { setDisplayWebCreation(!displayWebCreation) }}>create website home page for your business</button>
    </div>}
    {displayWebCreation && <WebCreation businessDetails={businessDetails} />}
  </form>)
 }






















