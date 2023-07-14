import { useEffect, useState } from "react";

const useQuery = (url) => {

    //State
    const [method, setMethod] = useState("GET");
    const [upload, setUpload] = useState(null);
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    //Function
    const setRequest = (mtd, upload) => {
        setUpload(upload);
        setMethod(mtd);
    }

    //Effect
    useEffect(() => {
        //Create an abortion controller to abort the request in case
        //there is a problem when the request in made
        const abortCont = new AbortController();

        upload && upload.recipes && setData(upload.recipes);
   
        //Send a request to the server
        fetch(url,{
            method: method,
            body: upload,
            signal: abortCont.signal})
        .then(res => {
                if(!res.ok){
                    throw Error("Data could not be fetched");
                }
                return res.json();
            })
        .then(data => {
                //Check if we got an error 
                if(data.msg){
                    throw Error(data.msg);
                }
                setData(data);
                setIsLoading(false);
                setError(null);
            })
        .catch(err => {
                //Convert error code to error message
                setIsLoading(false);
                if(err.name === "AbortError"){
                    console.log("Fetch aborted to prevent memory leak.");
                }else if(err.message === "no_file"){
                    setError("File could not be read.");
                }else if(err.message === "file_empty"){
                    setError("The file is empty.");
                }else if(err.message === "recipe_remove_file_fail"){
                    setError("The image could not be removed.");
                }else if(err.message === "recipe_remove_fail"){
                    setError("The recipe could not be removed.");
                }else{
                    setError(err.message);
                }
            })
        return () => abortCont.abort();
        
    }, [url, method, upload]);

    return {data, isLoading, error, setRequest};
}

export default useQuery;
