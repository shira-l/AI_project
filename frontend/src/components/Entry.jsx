
import React, { useState } from 'react';
import Form from "./Form";

export default function Entry() {
    const [viewForm, setViewForm] = useState(false)
    return (<>
        {!viewForm ?
            <div>
                <h1>Wellcome to To Make Business!</h1>
                <p style={{ fontSize: "24px" }}>
                    Dreaming of starting a business?<br />
                    Do you already have one, but it's not profitable?<br />
                    <b>Let us help you increase your sales!</b>
                </p>
                <button onClick={() => setViewForm(true)} >Let's do it!</button>
            </div>
            : <Form />}
    </>)
}