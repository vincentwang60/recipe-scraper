import {AiOutlineSearch} from 'react-icons/ai'
import styles from '../../styles/search.module.css'
export default function Search() {
    return (
        <div className={styles.container}>
            <AiOutlineSearch size='1.5vw' color='#272D2D'/>
            <div className={styles.text}>
                Type in what's in your pantry
            </div>
        </div>
    )
}