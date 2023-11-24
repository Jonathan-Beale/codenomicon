import '../css/Error.css';

function Error() {

    return (
        <>
        <div className="error-box">
            <div className="error-title">
                <div className="error-message"><h2>ERROR</h2></div>
            </div>
            <div className="message-box">
                <div className="msg">
                    This page does not exist!</div>
            </div>
        </div>
        </>
    );
  }
  
  export default Error;
  