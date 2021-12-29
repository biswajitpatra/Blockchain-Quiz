import {useState} from 'react'
export default function QuizList({quiz:{image,title,rewards,start_time,end_time,question}}){
    return (
      
        <div>
        <div className="h-3/6 w-1/2 rounded overflow-hidden shadow-lg">
          <img src={image} className="h-full w-full"></img>
          </div>
          <div>
            <h1 className="font-bold">{title.substr(0, 50)}</h1>
            <h3><spam>Reward: </spam>{rewards}$</h3>
            <p ><span className="text-lime-600">Start Time:  </span>{start_time}</p>
            <p><span className="text-red-600">End Time: </span>{end_time}</p>
            <div><span>Questions: </span>{question}</div>
          </div>
      </div>
        
    )    
}