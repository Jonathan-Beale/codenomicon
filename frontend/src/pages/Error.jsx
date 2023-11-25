import styles from '../css/Error.module.css';

function Error() {

    return (
        <>
        <div className={styles.errorBox}>
            <div className={styles.errorTitle}>
                <div className={styles.errorMessage}><h2>ERROR</h2></div>
            </div>
            <div className={styles.messageBox}>
                <div className={styles.msg}>
                    This page does not exist!</div>
            </div>
        </div>
        </>
    );
  }
  
  export default Error;
  