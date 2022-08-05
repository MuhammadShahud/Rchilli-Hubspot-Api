import "./App.css";

import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import gif from "./code2.gif";

const Button = styled.button`
  /* Insert your favorite CSS code to style a button */
`;

function App() {
  const hiddenFileInput = React.useRef(null);
  const [gifScreen, setGifScreen] = useState(false);
  const [submitted, setSubmitted] = useState(false)
  const [fileUpload, setFileUpload] = useState(null);
  const [rChilliResponse, setRChilliResponse] = useState();
  const [contact, setContact] = useState({
    properties: 
      [
        { property: 'contact_state_region', value: ""},
      { property: 'country', value: "" },
      { property: 'firstname', value: "" },
      { property: 'jobtitle', value: "" },
      { property: 'linkedin_profile', value: "" },
      { property: 'mobilephone', value: "" },
      { property: 'network_technology__other', value: "" },

         ] 
  
  });
  const [error, setError] = useState(false)

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleUpload = (event) => {
    setGifScreen(true);
    let base64File;

    let reader = new FileReader();
    reader.readAsDataURL(fileUpload);

    reader.onload = () => {
      const readerResult = reader.result;
      const array = readerResult.split("base64,");
      console.log("array", array);
      base64File = array[1];

      console.log("working", base64File);
      rChilliCall(base64File);
    };
    event.preventDefault();
  };

  const rChilliCall = async (finalFile) => {
    const newObj = {
      filedata: finalFile,
      filename: fileUpload.name,
      userkey: "GB3AIJZV",
      version: "8.0.0",
      subuserid: "Muhammad Shahud",
    };

    await axios.post(
        "https://rest.rchilli.com/RChilliParser/Rchilli/parseResumeBinary",
        newObj,
        {
          headers: {
            'content-type': 'application/json'
          }
        }
      ).then((res)=>{
        console.log("res",res);
        const response = res.data.ResumeParserData
        setRChilliResponse(res.data.ResumeParserData)
        const state = response.Address[0].State;
        const country = response.Address[0].Country;
        const name = response.Name.FullName;
        const jobTitle = response.JobProfile;
        let linkedin;
        response.WebSite.forEach(e => {
          // e.Type === "Linkedin"? linkedin = e.Url : null
          if(e.Type === "Linkedin"){
            linkedin = e.Url
          }
        }
        );
        const mobileNum = response.PhoneNumber[0].FormattedNumber;
        const education = [];
        response.SegregatedQualification.forEach(e => {
          let edu = e.Degree.NormalizeDegree + " from " + e.Institution.Name;
          education.push(edu);
        });
        const role = response.JobProfile;
        const techSkills = response.SkillKeywords.split(",");
        let Technology;
        techSkills.forEach(e => {
          !Technology? Technology = `-${e}\n` : Technology = `${Technology}-${e}\n`
        });
        console.log("Rchillli", state,country,name,jobTitle,linkedin,mobileNum,education,role,Technology)
        hubspotCall(state,country,name,jobTitle,linkedin,mobileNum,education,role,Technology)       
        console.log("rChilliResponse",rChilliResponse)
      

      }).catch((err)=>{
console.log('err',err);
setGifScreen(false);
setError(true);
setSubmitted(true);
      });
  };



const hubspotCall = async (state,country,name,jobTitle,linkedin,mobileNum,education,role,Technology) =>{
 console.log("Hubspotttt",state,country,name,jobTitle,linkedin,mobileNum,education,role,Technology);
  setContact(
    {
      properties: 
        [ { property: 'contact_state_region', value: state},
          { property: 'country', value: country },
          { property: 'firstname', value: name },
          { property: 'jobtitle', value: jobTitle },
          { property: 'linkedin_profile', value: linkedin },
          { property: 'mobilephone', value: mobileNum },
          { property: 'network_technology__other', value: Technology },
           ] 
    
    }
    )

    await axios.post(
      "https://api.hubapi.com/contacts/v1/contact/",
      contact,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer pat-na1-ad4b7e00-01fe-4734-ab9f-6b9704843b2e',
        }
      }
    ).then((res)=>{
      console.log("resHub",res);
      setGifScreen(false)
      setSubmitted(true);
    }).catch((err)=>{
      console.log('err',err);
      setGifScreen(false);
      setError(true);
      setSubmitted(true);

            });




}


  const reUpload = ()=>{
    if(error){
      setError(false)
      setSubmitted(false)
    }else{
    setSubmitted(false);
    }
  }

  const handleChange = (event) => {
    setFileUpload(event.target.files[0]);

    // props.handleFile(fileUploaded);
  };
  return !submitted? (
    <>

     { gifScreen? <div className="gifDiv">
        <div className="gif">
          <img className="img" src={gif} />
        </div>
      </div>: null}


      <div className="App" style={gifScreen?{opacity : "0.5"}:{opacity:"1"}}>
        <div className="imgDiv">
          <img
            className="img"
            src="https://getelastech.com/wp-content/webp-express/webp-images/uploads/2021/12/ELASTECH-01.png.webp"
          />
        </div>
        <div className="container">
          <Button id="upload-button" onClick={handleClick}>
            Upload a file
          </Button>
          <input
            type="file"
            ref={hiddenFileInput}
            onChange={handleChange}
            style={{ display: "none" }}
          />
          <button
            id="upload-button"
            onClick={handleUpload}
            style={{ backgroundColor: "#3b0c02" }}
          >
            Submit
          </button>
        </div>
      </div>


    </>
  ) : (
    <div className="App" style={gifScreen?{opacity : "0.5"}:{opacity:"1"}}>
        <div className="imgDiv">
          <img
            className="img"
            src="https://getelastech.com/wp-content/webp-express/webp-images/uploads/2021/12/ELASTECH-01.png.webp"
          />
        </div>
        <div className="container" style={{flexDirection : "column"}}>
         {error? <span>
          There is an error in creating contact. Click "Submit" to try again.
          </span> : <span>
            Successfully created contact on Hubspot.Click "Submit" to add another résumé..
          </span>}
          <button
            id="upload-button"
            onClick={reUpload}
            style={{ backgroundColor: "#3b0c02" }}
          >
            Submit
          </button>
        </div>
      </div>
  );
}

export default App;

