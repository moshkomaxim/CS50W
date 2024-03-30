document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox());
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox();
});

let counter = 0;
const load_posts = 10;

window.onscroll = () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      load_mailbox();
  }
};


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


function load_mailbox() {
  main_view = document.querySelector('#main-view');
  // Show the mailbox and hide other views
  main_view.style.display = 'block';
  document.querySelector('#mail-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  // Show the mailbox name 
  // Empty from old lists


  fetch(`http://127.0.0.1:8000/get_posts?start=${counter}&load=${load_posts}`)

  .then(response => response.json())
  .then(data => {
    if (data.length == ""){
      alert(1);
      console.log(data);
    }
    else {
      for (let i = 0; i < data.posts.length; i++) {
        post_id = counter;
        add_post(data.posts[i], post_id);
      }
    }
  })  
  
  .catch(error => {
    console.log("Error: ", error);
})
return false;
}


function add_post(post, post_num) {
  div = document.createElement('div');
  div.classList.add("post");
  div.id = post_num;

  title = document.createElement('h6');
  title.innerHTML = post.title;

  text = document.createElement('p');
  text.innerHTML = post.text;

  time = document.createElement('p');
  time.innerHTML = post.timestamp.full;

  like_svg = `<svg class="like_image" width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.7 4C18.87 4 21 6.98 21 9.76C21 15.39 12.16 20 12 20C11.84 20 3 15.39 3 9.76C3 6.98 5.13 4 8.3 4C10.12 4 11.31 4.91 12 5.71C12.69 4.91 13.88 4 15.7 4Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  `;

  like_body = document.createElement("div");
  like_body.classList.add("like_body");
  like_body.innerHTML = like_svg;
  like_body.addEventListener('click', change_like.bind(this, div.id), false);

  if (post.user_liked) {
    tmp = like_body.querySelector("svg");
    tmp.style.fill = "#e74c3c";
    tmp.classList.add("active");
  }

    like_counter = document.createElement('p');
    like_counter.classList.add("like_counter");
    like_counter.dataset.id = post.id;
    like_counter.innerHTML = post.likes.length;

    like_counter_div = document.createElement("div");
    like_counter_div.append(like_counter);

    like = document.createElement("div");
    like.append(like_body, like_counter_div);

    link = document.createElement('a');
    link.innerHTML = "Comment";

    div.append(title, text, time, like, link);
    main_view.append(div);
    console.log(`post ${div.id}created`);
    
    document.querySelector('#main-view').append(div);
    
    counter++;
}


function change_like(div_id) {
  like_body = document.getElementById(`${div_id}`).querySelector('svg');
  like_counter = document.getElementById(`${div_id}`).querySelector('.like_counter');
  let change;

  if (like_body.classList.contains("active")) {
    like_body.style.fill = "white";
    like_body.classList.remove("active");
    new_value = parseInt(like_counter.innerHTML) - 1;
    change = "dislike";
  }
  else {
    like_body.style.fill = "#e74c3c";
    like_body.classList.add("active");
    new_value = parseInt(like_counter.innerHTML) + 1;
    change = "like";
  }

  fetch('/like_post', {
    method: 'POST',
    body: JSON.stringify({
      id: like_counter.dataset.id,
      change: change,
    })
  })
  .then(response => {
    like_counter.innerHTML = new_value;
  })
  .catch(error => {
    console.log("Error: ", error);
  })
  return false;
}
