import {useState} from 'react'
import QuizList from '../components/QuizList'
import quizes from './../dummy/fake.json'
export default function Player(){
    return(
        
           <div>
            <div className="p-20  grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-8">
               
                {quizes.map((quiz)=>(
                    
                    <QuizList quiz={quiz} key={quiz.id} />
                    
                ))}
            </div>
        </div>
    )
}