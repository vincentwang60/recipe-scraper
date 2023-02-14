import styles from '../../styles/logo.module.css'
export default function Logo() {
    return (
        <div>
            <div className={styles.title} >Pantry</div>
            <div style={{paddingLeft: '6.5vw', fontSize: '1.8vw'}}className={styles.title}>to</div>
            <div style={{paddingLeft: '7.5vw'}} className={styles.title}>Table</div>
        </div>
    )
}