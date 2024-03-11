document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', () => compose_email('usual'));
  document.querySelector('#mail-archive').addEventListener('click', () => use_archive('To'));
  document.querySelector('#mail-unarchive').addEventListener('click', () => use_archive('From'))
  document.querySelector('#mail-reply').addEventListener('click', () => compose_email('reply'));


  // By default, load the inbox
  load_mailbox('inbox');
});


function view_email(email_id) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#mail-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#mail-archive').style.display = 'none';
  document.querySelector('#mail-unarchive').style.display = 'none';
  document.querySelector('#mail-reply').style.display = 'block';

  archive_button = document.querySelector('#mail-archive');
  unarchive_button = document.querySelector('#mail-archive');

  fetch(`http://127.0.0.1:8000/emails/${email_id}`)
  .then(response => response.json())
  .then(data => {
    document.querySelector('#mail-id').innerHTML = data.id;
    document.querySelector('#mail-subject').innerHTML = data.subject;
    document.querySelector('#mail-from').innerHTML = `From ${data.sender}`;
    document.querySelector('#mail-to').innerHTML = `To ${data.recipients}`;
    document.querySelector('#mail-body').innerHTML = data.body;
    document.querySelector('#mail-time').innerHTML = data.timestamp;
    if (data["archived"] == false) {
      document.querySelector('#mail-archive').style.display = 'block';
    }
    else {
      document.querySelector('#mail-unarchive').style.display = 'block';
    }
  })

  fetch(`http://127.0.0.1:8000/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true,
    })
  })
  .then(response => response)
  .then(result => {
  })
  
  return false;
}


function use_archive(option) {
  let email_id = document.querySelector('#mail-id').innerHTML;
  let new_state;

  if (option == "To") {
    new_state = true;

  }
  else if (option == "From") {
    new_state = false;
  };

  fetch(`http://127.0.0.1:8000/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: new_state,
    })
  })
  .then(response => response)
  .then(result => {
    load_mailbox("inbox");
  })

  return false;

}


function compose_email(option) {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#mail-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#mail-archive').style.display = 'none';
  document.querySelector('#mail-unarchive').style.display = 'none';
  document.querySelector('#mail-reply').style.display = 'none';

  // Clear out composition fields
  compose_recipients = document.querySelector('#compose-recipients')
  compose_subject = document.querySelector('#compose-subject')
  compose_body = document.querySelector('#compose-body')

  if (option == 'reply') {
    let subject = document.querySelector('#mail-subject').innerHTML;
    let from = document.querySelector('#mail-from').innerHTML.slice(5);

    compose_recipients.value = from;
    
    if (subject.slice(0, 3) == 'Re:') {
      compose_subject.value = subject;
    }
    else {
      compose_subject.value = `Re: ${subject}`;
    }

    compose_body.value = `On ${document.querySelector('#mail-time').innerHTML} ${from} wrote: "${document.querySelector('#mail-body').innerHTML}"`;
  }
  else {
    compose_recipients.value = '';
    compose_subject.value = '';
    compose_body.value = '';
  }


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
          alert("Email sent successfully.")
          load_mailbox('inbox');
        }
        else {
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
  document.querySelector('#mail-archive').style.display = 'none';
  document.querySelector('#mail-unarchive').style.display = 'none';
  document.querySelector('#mail-reply').style.display = 'none';
  // Show the mailbox name 
  emails_view.innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  // Empty from old lists


  fetch(`http://127.0.0.1:8000/emails/${mailbox}`)

  .then(response => response.json())
  .then(data => {
    if (data.length == ""){
      alert(1);
    }
    else {
      ul = document.createElement('ul');
        data.forEach(email => {
          li = document.createElement('li');
          if (mailbox == "inbox" || mailbox == "archive") {
            li.innerHTML = `<a href="javascript:view_email(${email.id})">From ${email.sender}: ${email.subject}</a>`;
          }
          else if (mailbox == "sent") {
            li.innerHTML = `<a href="javascript:view_email(${email.id})">To ${email.recipients}: ${email.subject}</a>`;
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

