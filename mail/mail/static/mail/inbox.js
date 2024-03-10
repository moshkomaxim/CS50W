document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});


function view_email(email_id) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#mail-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  fetch(`http://127.0.0.1:8000/emails/${email_id}`)

  .then(response => response.json())
  .then(data => {
    console.log(data)
    document.querySelector('#mail-subject').innerHTML = data.subject;
    document.querySelector('#mail-from').innerHTML = `From ${data.sender}`;
    document.querySelector('#mail-to').innerHTML = `To ${data.recipients}`;
    document.querySelector('#mail-body').innerHTML = data.body;
    document.querySelector('#mail-time').innerHTML = data.timestamp;
  })

  return false;
}



function compose_email() {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#mail-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  compose_recipients = document.querySelector('#compose-recipients')
  compose_subject = document.querySelector('#compose-subject')
  compose_body = document.querySelector('#compose-body')

  compose_recipients.value = '';
  compose_subject.value = '';
  compose_body.value = '';

  document.querySelector('#compose-form').onsubmit = function() {
    if (compose_subject.value == "" || compose_body.value == "")
      if (!confirm("Do you wan't to send an email without subject or body?"))
      {
        return false;
      }

    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: compose_recipients.value,
        subject: compose_subject.value,
        body: compose_body.value
      })
    })
    .then(response => response.json())
    .then(result => {
        if (result["message"] == "Email sent successfully.") {
          console.log(result)
          console.log(result["message"])
          alert("Email sent successfully.")
          load_mailbox('inbox');
        }
        else {
          console.log(result)
          alert(result["error"])
        }
      })
    return false;
  };

  return false;
}


function load_mailbox(mailbox) {
  emails_view = document.querySelector('#emails-view');
  // Show the mailbox and hide other views
  emails_view.style.display = 'block';
  document.querySelector('#mail-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  // Show the mailbox name 
  emails_view.innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  // Empty from old lists


  fetch(`http://127.0.0.1:8000/emails/${mailbox}`)

  .then(response => response.json())
  .then(data => {
    if (data.length == ""){
      alert(1);
      console.log(data);
    }
    else {
      ul = document.createElement('ul');
        data.forEach(email => {
          li = document.createElement('li');
          if (mailbox == "inbox" || mailbox == "archive") {
            li.innerHTML = `<a href="javascript:view_email(${email.id})">From ${email.sender}: ${email.subject}</a>`;
          }
          else if (mailbox == "sent") {
            li.innerHTML = `<a href="emails/${email.id}">To ${email.recipients}: ${email.subject}</a>`;
          }
          
        ul.append(li);
        });
        emails_view.append(ul);
    }
  })
  
  .catch(error => {
    console.log("Error: ", error);
})
return false;
}

