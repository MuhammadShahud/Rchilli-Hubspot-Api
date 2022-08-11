import "./App.css";

import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import gif from "./code2.gif";
import gif2 from "./loader.gif"

const Button = styled.button`
  /* Insert your favorite CSS code to style a button */
`;

function App() {
  const hiddenFileInput = React.useRef(null);
  const [gifScreen, setGifScreen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fileUpload, setFileUpload] = useState(null);
  const [error, setError] = useState(false);
  const [loader, setLoader] = useState(false)

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
      rChilliCall(base64File);
    };
    event.preventDefault();
  };

  const rChilliCall = async (finalFile) => {
    console.log("finalFile", finalFile);

    const obj = {
      name: fileUpload.name,
      file: finalFile,
    };
    console.log("fileUpload", obj);
    await axios
      .post("http://192.168.0.175:4000/elastech/rchilli", obj)
      .then((res) => {
        console.log("res", res);
        const response = res.data.ResumeParserData;
        const stateTest = response.Address[0].State;
        let state ; 
        if(stateTest === "Alabama" || stateTest === "Alaska" ||stateTest === "Arizona" ||stateTest === "Arkansas" ||
        stateTest === "California" ||stateTest === "Colorado" ||stateTest === "Connecticut" ||stateTest === "Delaware" ||stateTest === "Florida" ||
        stateTest === "Georgia" ||stateTest === "Hawaii" ||stateTest === "Idaho" ||stateTest === "Illinois" ||stateTest === "Indiana" ||
        stateTest === "Iowa" ||stateTest === "Kansas" ||stateTest === "Kentucky" ||stateTest === "Louisiana" ||stateTest === "Maine" ||
        stateTest === "Maryland" ||stateTest === "Massachusetts" ||stateTest === "Michigan" ||stateTest === "Minnesota" ||stateTest === "Mississippi" ||
        stateTest === "Missouri" ||stateTest === "Montana" ||stateTest === "Nebraska" ||stateTest === "Nevada" ||stateTest === "New Hampshire" ||
        stateTest === "New Jersey" ||stateTest === "New Mexico" ||stateTest === "New York" ||stateTest === "North Carolina" ||stateTest === "Ohio" ||
        stateTest === "North Dakota" || stateTest === "Oklahoma" ||stateTest === "Oregon" || stateTest === "Pennsylvania" ||stateTest === "Rhode Island" ||
        stateTest === "South Carolina" || stateTest === "South Dakota" ||stateTest === "Tennessee" ||stateTest === "Texas" ||stateTest === "Utah" ||
        stateTest === "Vermont" ||stateTest === "Virginia" ||stateTest === "Washington" ||stateTest === "West Virginia" ||stateTest === "Wisconsin" ||
        stateTest === "Wyoming" ||stateTest === "British Columbia" ){
        
          state = stateTest
        }
        const country = response.Address[0].Country;
        const name = response.Name.FullName;
        const jobTitle = response.JobProfile;
        let linkedin;
        response.WebSite.forEach((e) => {
          // e.Type === "Linkedin"? linkedin = e.Url : null
          if (e.Type === "Linkedin") {
            linkedin = e.Url;
          }
        });
        const mobileNum = response.PhoneNumber[0].FormattedNumber;
        let education;
        response.SegregatedQualification.forEach((e) => {
          let edu = e.Degree.NormalizeDegree.split(" ");
          console.log('edu',edu);
          if (
            edu[0] === "BS" ||
            edu[0] === "Bachelor" ||
            edu[0] === "Bachelors" ||
            edu[0] === "Bachelor's" ||
            edu[0] === "bachelor's" ||
            edu[0] === "bachelors" ||
            edu[0] === "bachelor"
          ) {
            !education ? (education = "BS") : (education = `${education}\nBS`);
            console.log('education==>',education);
          }
          if (
            (edu[0] === "MS" ||
              edu[0] === "Master" ||
              edu[0] === "Masters" ||
              edu[0] === "Master's" ||
              edu[0] === "master's") ||
            edu[0] === "Mphil" ||
            edu[0] === "mphill" ||
            edu[0] === "masters" ||
            edu[0] === "master"
          ) {
            !education ? (education = "MS") : (education = `${education}\nMS`);
          }
          if (
            edu[0] === "Doctorate" ||
            edu[0] === "PhD" ||
            edu[0] === "PHD" ||
            edu[0] === "phd" ||
            edu[0] === "doctorate"
          ) {
            !education
              ? (education = "PhD")
              : (education = `${education}\nPhD`);
          }
        });
        const role = response.JobProfile;
        const techSkills = response.SkillKeywords.split(",");
        let Technology;
        techSkills.forEach((e) => {
          !Technology
            ? (Technology = `-${e}\n`)
            : (Technology = `${Technology}-${e}\n`);
        });
        console.log(
          "Rchillli",
          state,
          country,
          name,
          jobTitle,
          linkedin,
          mobileNum,
          education,
          role,
          Technology
        );
        hubspotCall(
          state,
          country,
          name,
          jobTitle,
          linkedin,
          mobileNum,
          education,
          role,
          Technology
        );
      })
      .catch((err) => {
        console.log("err", err);
        setGifScreen(false);
        setError(true);
        setSubmitted(true);
      });
  };

  const hubspotCall = async (
    state,
    country,
    name,
    jobTitle,
    linkedin,
    mobileNum,
    education,
    role,
    Technology
  ) => {
    console.log(
      "Hubspotttt",
      state,
      country,
      name,
      jobTitle,
      linkedin,
      mobileNum,
      education,
      role,
      Technology
    );
   const contact ={
      properties: [
        { property: "contact_state_region", value: state? state : null },
        { property: "country", value: country },
        { property: "firstname", value: name },
        { property: "jobtitle", value: jobTitle },
        { property: "linkedin_profile", value: linkedin },
        { property: "mobilephone", value: mobileNum },
        { property: "education", value: education },
        { property: "network_technology__other", value: Technology }
      ],
    };

    await axios
      .post("http://192.168.0.175:4000/elastech/hubspot",contact)
      .then((res) => {
        console.log("resHub", res);
        setGifScreen(false);
        setSubmitted(true);
      })
      .catch((err) => {
        console.log("err", err);
        setGifScreen(false);
        setError(true);
        setSubmitted(true);
      });
  };

  const reUpload = () => {
    if (error) {
      setError(false);
      setSubmitted(false);
    } else {
      setSubmitted(false);
    }
  };

  const handleChange = (event) => {
    setLoader(true)
    setFileUpload(event.target.files[0]);
   
    setTimeout(() => {
      setLoader(false)
    }, 1500);

    // props.handleFile(fileUploaded);
  };
  return !submitted ? (
    <>
      {gifScreen ? (
        <div className="gifDiv">
          <div className="gif">
            <img className="img" src={gif} />
          </div>
        </div>
      ) : null}

      <div
        className="App"
        style={gifScreen ? { opacity: "0.5" } : { opacity: "1" }}
      >
        <div className="imgDiv">
          <img
            className="img"
            src="https://getelastech.com/wp-content/webp-express/webp-images/uploads/2021/12/ELASTECH-01.png.webp"
          />
        </div>
       <div className="mainCon">
      {loader? <div className="imgLoading">
          <img
            className="img"
            src={gif2}
          />
        </div> : null}
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
      </div>
    </>
  ) : (
    <div
      className="App"
      style={gifScreen ? { opacity: "0.5" } : { opacity: "1" }}
    >
      <div className="imgDiv">
        <img
          className="img"
          src="https://getelastech.com/wp-content/webp-express/webp-images/uploads/2021/12/ELASTECH-01.png.webp"
        />
      </div>
      <div className="container" style={{ flexDirection: "column" }}>
        {error ? (
          <span>
            There is an error in creating contact. Click "Submit" to try again.
          </span>
        ) : (
          <span>
            Successfully created contact on Hubspot.Click "Submit" to add
            another résumé..
          </span>
        )}
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
