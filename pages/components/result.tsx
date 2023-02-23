import styles from '../../styles/result.module.css'
import{useEffect, useState} from 'react'
import {AiOutlineClockCircle, AiOutlineLink} from 'react-icons/ai'

export default function Result(props: {result: Recipe}) {
    let [image, setImage] = useState(<div></div>)

    let ingredientComponents: JSX.Element[] = []
    let count = 0
    for (let item of props.result.ingredients) {
        count += 1
        ingredientComponents.push(
            <ul key = {count} className={styles.ingredient}>
                <li style={{paddingRight: '10px', marginTop: '3px', fontWeight: '300'}} className='text'>{item.amount} {item.unit} {item.name}</li>
            </ul>
        )
    }

    useEffect(()=> {
        async function getImage() {
            const response = await fetch("/api/getWoksOfLifeImage?url="+props.result._id);
            return response.json()
        }
        getImage().then((data)=>{
            setImage(<img className={styles.image} src={data.imageSrc} />)
        })
    }, [props.result])
    
    return (
        <div className={styles.container}>
            <div className={styles.containerFlair}>
                <div className={styles.containerOutline}>
                    <div className={styles.imageContainer}>
                        {image}
                    </div>
                    <div className={styles.mainContainer}>
                        <div className={styles.title}>{props.result.title}</div>
                        <div className={styles.info}>
                            <div className={styles.time}>
                                <AiOutlineClockCircle className={styles.icon} size='20px' color='#FFFEEB'/>
                                <div style={{marginTop: '3px'}} className='text'>Cook Time: {props.result.time}</div>
                            </div>
                            <div className={styles.link}>
                                <AiOutlineLink className={styles.icon} size='20px' color='#FFFEEB'/>
                                <div style={{marginTop: '3px', textDecoration: 'underline'}} className='text'>{props.result._id}</div>
                            </div>
                        </div>
                        <div style={{paddingTop: '10px'}}className='text'>Ingredients:</div>
                        <div className={styles.ingredientContainer}>
                            {ingredientComponents}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}