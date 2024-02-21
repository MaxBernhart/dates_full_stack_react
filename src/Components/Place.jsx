export default function Place({loc, url}){


if(loc != null){
    return(
        <div>
            <h3>{loc.name}</h3>
            <img src={url} alt="" />
            <p>Rating: {loc.rating}</p>
            <p>Price Level: {loc.price_level}</p>
        </div>
    );
}
else{
    <h1>Test</h1>
}


}