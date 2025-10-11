import React, { useEffect, useState } from 'react'

const List = () => {

  const[list,setList] = useState([])

  const fetchList = async () =>{

  }

  useEffect(()=>{
    fetchList()
  },[])

  return (
    <div>
        
    </div>
  )
}

export default List