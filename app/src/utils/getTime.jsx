export const getTime = (string) => {
    
    //Get the number from the string 
    let time = parseFloat(String(string).replace(/[^\d\.]*/g, '')) || 0;
    //Get the time unit from the string
    const unit = String(string).replace(/[\d\.\ ]*/g, '');
    //Check if the time is in hours and convert it in to minutes
    if(unit.toLowerCase() === "hours") {time = time * 60;}

    return time;
}
