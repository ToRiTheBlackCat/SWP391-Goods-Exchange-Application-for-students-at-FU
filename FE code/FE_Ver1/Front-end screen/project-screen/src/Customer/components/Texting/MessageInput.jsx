import { useState } from 'react';
import styles from '../../styles/MessageInput.module.css';

export default function MessageInput({addMessage}) {
  const [message, setMessage] = useState('')

  function addAMessage(){
    addMessage({
      message
  })
    setMessage('');
  }

  return(
    <div className={styles.textContainer}>
      <textarea
      className={styles.textarea}
      rows={6}
      placeholder='Write something...'
      value={message}
      onChange={e => setMessage(e.target.value)}
      ></textarea>
      <button onClick={() => addAMessage()}
      className={styles.button}
      >
        Enter
      </button>
    </div>
  )
}