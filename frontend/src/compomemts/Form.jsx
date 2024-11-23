import {saveAs} from 'file-saver' 
export default function Form(){
    function  blobToSaveAs(fileName, blob) {
        try {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          if (link.download !== undefined) { // feature detection
            link.setAttribute('href', url);
            link.textContent="for dowload";
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
          }
        } catch (e) {
          console.error('BlobToSaveAs error', e);
        }
      }
    const displayPDF=async()=>{
        try {
            const response = await fetch('http://localhost:3001/getCharacterizationFile', {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            console.log(data.file.data)
            // const blob = new Blob([exportText], { type: 'text/plain' });
            // blobToSaveAs("myFile",blob)
            const pdfBlob = new Blob([data.file.data], { type: 'application/pdf' });
            //להורדה מידית
           // saveAs(pdfBlob, 'generatedDocument.pdf')
           //ליצירת קישור להורדה
           blobToSaveAs("generatedDocument.pdf",pdfBlob)

            if (!response.ok) {
                throw new Error(data.error);
            }
            return data;
        } catch (error) {
            throw error;
        };
    }
    return(<>
    <button onClick={displayPDF}>display my PDF</button>
    </>)
}