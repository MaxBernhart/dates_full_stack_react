import { useState } from "react";
import { useAuth} from '../AuthContext';


export default function ConnectionDisplay({connection, name}){

    const { setConnection } = useAuth();

    function connect(){
        setConnection(connection.idconnections)
    }

    if(name == connection.username1){
        return(
            <div>
                <h3>{connection.username2}</h3>
                <button onClick={connect}><p>Choose Connection</p></button>
            </div>
        );
    }else{
        return(
            <div>
                <h3>{connection.username1}</h3>
                <button onClick={connect}><p>Choose Connection</p></button>
            </div>
        );
    }


}