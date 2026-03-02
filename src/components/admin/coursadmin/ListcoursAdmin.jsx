import React, { useState, useEffect } from 'react'
import {getcours} from '../../../services/courservice' ;
import { CircularProgress } from '@mui/material';
import AffichecoursAdmin from './AffichecoursAdmin';


const ListcoursAdmin = () => {
    const [cours,setCours]=useState([])
    const [isPending,setIsPending] = useState(true)
    const [error , setError] = useState(null)

    const handlGetCours= async  ()=> {
        try {
        const res = await getcours();
        setCours(res.data)

    }catch (error){
        console.log(error)
    }finally{
        setIsPending(false)
    }
}
useEffect (
    ()=>{
        handlGetCours()
    },[]
)



  return (
    <div>
        {isPending ? (
            <div>
                 <CircularProgress color="primary" size={20} />
            </div>

        )
        : error ? (
            <div>
                Erreur dans le chargement
            </div>

        )
        : (
            <div>
                <h1><center> Liste des cours </center></h1>
                <AffichecoursAdmin
                cours = {cours}/>
            </div>
        )
    }
    </div>
  )
}

export default ListcoursAdmin
