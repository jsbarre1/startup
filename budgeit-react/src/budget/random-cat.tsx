export const getRandomCat = async () => {
  const headers = new Headers({
    "Content-Type": "application/json",
    "x-api-key": "live_wRumiHWxnmFYQTriqX2ik2YKouEtllWxlXbL8JcN4BzEiFNfq5JvMYjptABscThJ"
  });
  
  const requestOptions = {
    method: 'GET',
    headers: headers,
    redirect: 'follow' as const
  };
  
  try {
    const response = await fetch("https://api.thecatapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=1", requestOptions);
    const data = await response.json();
    
    // The response is an array with one object, so we get the first item and extract the url
    if (data && data.length > 0) {
      return data[0].url;
    }
    
    throw new Error("No cat image found in the response");
  } catch (error) {
    console.error('Error fetching cat image:', error);
    return null; // or throw an error, depending on how you want to handle errors
  }
};