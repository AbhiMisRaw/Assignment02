let lastSummaryId = 1;
let lastMajorId = 1;
console.log("script is working!!!");


// For collecting summary from web-pages 

const summaryBtn = document.querySelector(".collectSummary");
const summaryPlace = document.querySelector(".summaryPlace");


summaryBtn.addEventListener('click' , async()=>{

  mPointsPlace.style.display = 'none' ;
  summaryPlace.style.display = 'block' ;
  
  let [tab] = await chrome.tabs.query({active:true,currentWindow:true});

  
    lastSummaryId = tab.id ;
    console.log(tab.id);
  chrome.scripting.executeScript({
    target:{tabId:tab.id},
    function:showSummary
  }).then( results => {

    for (let {frameId, result} of results) {
      console.log(`Frame ${frameId} result:`, result);
    }

    let summaryResult = results[0].result;

    let i = 0 ;
    // console.log(results);
    // summaryPlace.innerText = results[0].result;
    setTimeout(typeWriter, 1000);
    function typeWriter() {
      if (i < summaryResult.length) {
        summaryPlace.innerHTML += summaryResult.charAt(i);
        i++;
        setTimeout(typeWriter, 50);
      }
    }
  });
  
  
});


// Query selector for extracting major points

const mPointsBtn = document.querySelector(".majorPoints");
const mPointsPlace = document.querySelector(".majorPointsPlace");


// for extracting Major Points

mPointsBtn.addEventListener('click' , async()=>{

  summaryPlace.style.display = 'none' ;
  mPointsPlace.style.display = 'block' ;
  

  let [tab] = await chrome.tabs.query({active:true,currentWindow:true});
  
    lastMajorId = tab.id ;
    console.log(tab.id);
  chrome.scripting.executeScript({
    target:{tabId:tab.id},
    function:collectMajorPoints
  }).then( results => {

    console.log(results[0].result);
    let keyWordsFinal = results[0].result ;
     let strResult = "";
     for (let result of keyWordsFinal) {
        //console.log(`Frame ${frameId} result:`, result);
         strResult +=  "<h4># <i>" + result+ "</i></h4>"
     }
     mPointsPlace.innerHTML = strResult;

  });


});


async function collectMajorPoints(){
  // major points
  
  const keywordFinal = [];
  const  callingApi = async (str) => {
    
    const apiUrl = "https://api.edenai.run/v2/text/keyword_extraction";
    const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYjU2ODJmODctZjI0ZC00ZTdhLWI1MjktNmE3ZTdmZGE1ZGVmIiwidHlwZSI6ImFwaV90b2tlbiJ9.IDi0zXT5EtXmfLfqNIR-3QdtpfczdLKQ_CCGBlH5zlY";
    const requestData = {
      providers : "ibm",
      text : str,
      language : "en",
    };
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
  };
  await fetch(apiUrl, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
       console.log(data.ibm.items + " Data is recived");
      // resultFinal += data.ibm.items;
      // console.log(resultFinal+"Yoooo inside api fun");
      for(let i of data.ibm.items){
        keywordFinal.push(i.keyword);
       
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  let str = "";
  let x ="";
  let obje = document.querySelectorAll("p");
  for (let i = 0; i < obje.length; i++) {
      str+= obje[i].innerText;
      console.log("Calling Keyword API function");
  }
  
  await callingApi(str);

  console.log(keywordFinal +" Yooooooooo  outside API function ");
  return keywordFinal;

}



async function showSummary(){
  
  let resultFinal = "" ;
  const  callingApi = async (str) => {
    
    const apiUrl = "https://api.edenai.run/v2/text/summarize";
  const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYjU2ODJmODctZjI0ZC00ZTdhLWI1MjktNmE3ZTdmZGE1ZGVmIiwidHlwZSI6ImFwaV90b2tlbiJ9.IDi0zXT5EtXmfLfqNIR-3QdtpfczdLKQ_CCGBlH5zlY";
  
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      output_sentences: 3,
      providers: "openai",
      text: str,
      language: "en",
    }),
  };
  await fetch(apiUrl, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
     resultFinal += data.openai.result;
     console.log(resultFinal+"Yoooo inside api fun");
    })
    .catch((error) => {
      console.error(error);
    });
  }

  let str ;
  let x ="";
  let obje = document.querySelectorAll("p");
  for (let i = 0; i < obje.length; i++) {
      str+= obje[i].innerText;
      console.log("Calling API function");
  }
  
  await callingApi(str);
  //resultFinal += "The YouTube algorithm is a complex set of rules and data that determines how your videos are ranked in YouTubes search results. Its been used for over 10 years and has evolved over time to help YouTube users find the content theyre looking for.The YouTube algorithm works by identifying what type of content you have and then matching it with other users who have similar content.For example, if you post a video about how to cook chicken breast, that video will show up alongside videos from other people with similar interests who also post videos about cooking chicken breast."
  console.log(resultFinal +" Yooooooooo  outside API function ");
  return resultFinal;
}

