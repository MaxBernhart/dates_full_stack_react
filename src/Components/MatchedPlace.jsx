export default function MatchedPlace({loc, url}){


if(loc != null){
    return(
        <div>
            <h3>{loc.name}</h3>
            <img src={url} alt="" />
            <p>Rating: {loc.rating}</p>
            <p>Price Level: {loc.price}</p>
        </div>
    );
}
else{
    <h1>Error</h1>
}
}