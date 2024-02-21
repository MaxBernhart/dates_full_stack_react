import { useAuth } from '../AuthContext';
import { useState } from 'react';
import MatchedPlace from './MatchedPlace';

export default function MatchDisplay(){
    const { token, id, connectionId } = useAuth();
    const [matches, setMatches] = useState([]);
    const [complete, setComplete] = useState(false);
    const [increment, setIncrement] = useState(0);

    async function getLikes(){
        const response = await fetch('http://localhost:5000/matches?connection='+connectionId, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if(response.ok) {
          const data = await response.json();
          findMatches(data);
          setComplete(true);
        }
        else{
          console.log(response);
          setComplete(true);
          console.error('Matches search failed');
        }
      }

    function findMatches(likes){
        console.log(likes.matches);
        for(let i = 0; i < likes.matches.length; i++){
            for(let k = 0; k < likes.matches.length; k++){
                if(likes.matches[i].reference == likes.matches[k].reference && likes.matches[i].user != likes.matches[k].user){
                    let check = true;
                    for(let n = 0; n <matches.length; n++){
                        if(likes.matches[i].reference == matches[n].reference){
                            check = false;
                        }
                    }
                    if(check){
                        let match = likes.matches[i];
                        let newMatches = matches;
                        newMatches.push(match);
                        setMatches(newMatches);
                    }
                }
            }
        }
    }

    function next(){
        let n = increment;
        n = n+1;
        if(n < matches.length){
            setIncrement(n);
        }
    }

    function previous(){
        let n = increment;
        if(n !=0){
            n = n - 1;
            setIncrement(n);
        }
    }

    if(!complete){
        return(
            <div>
                <button onClick={getLikes}>Find my matches</button>
            </div>
        );
    }else{
        return(
            <div className='container'>
                <div className='center'>
                    <MatchedPlace loc = {matches[increment]} url = {matches[increment].url}/>
                    <button onClick={next}><p>Next</p></button>
                    <button onClick={previous}><p>Previous</p></button>
                </div>
            </div>
        );
    }

}