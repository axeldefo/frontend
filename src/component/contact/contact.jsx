import React from 'react'
import './contact.css'
import { useRef,  useState} from 'react';
import emailjs from '@emailjs/browser';

const Contact= () => {
  const form = useRef();
  const [messageSent, setMessageSent] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_basxeip', 'template_w4006tn', form.current, 'nUSVQMjuyR2MgADXx')
      .then((result) => {
          console.log(result.text);
          setMessageSent(true); 
          setTimeout(() => setMessageSent(false), 2000);
      }, (error) => {
          console.log(error.text);
      });
      
      e.target.reset();
      <p>Message envoyé !</p>
  };
  return (
    <section id="contact">
      <h1 className='cont'>Me Contacter</h1>

      <div className="container contact_container">
        <form ref = {form} onSubmit={sendEmail}>
          <input type="text" name ="nom" placeholder='Votre nom complet' required/>
          <input type="text" name ="email" placeholder='Votre adresse mail' required/>
          <input type="text" name ="objet" placeholder="L'objet de votre message" required/>
          <textarea className='champ' name="message" id="" cols="30" rows="10" placeholder='Votre message'></textarea>
          <button type='submit'className='primary-btn'>Envoyer un message</button>
        </form>

        <span className='copyr'>
          © 2024 Kxng, Tous droits réservés.
          </span>
      </div>
      {messageSent && 
        <div className="message_sent">
        <p>Message envoyé !</p>
      </div>
      }
    </section>
  )
}

export default Contact