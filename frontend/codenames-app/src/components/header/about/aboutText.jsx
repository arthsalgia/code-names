import './aboutText.css';

export default function AboutText() {
  return (
    <div className="about-text">
      <div className='about-text-header'>
        <div className="title">Hello there!</div>
        <div className="subtitle">Welcome to my page</div>
      </div>

      <div className='body'>
        <p>I'm Arth Salgia.</p>
        <p>Thank you for visiting my page! This is a little website I created to learn React.</p>
        <p>
          I "borrowed" 👀 the game idea from <a href='https://codenames.com'>codenames.com</a> a
          game I liked playing with my friends. Now that we're all in college we can't and  
          I felt like recreating it. <br/>Mr. codenames.com, please don't be mad at me 🙏
        </p>
      </div>

      <div className='sub-para'>
        <span>Find me on:</span>
        <a href='https://github.com/arthsalgia'>Github</a>
        <a href='https://www.linkedin.com/in/arthsalgia/'>LinkedIn</a>
        <span>· I love sharks so I went with the fish theme 🐟</span>
      </div>
    </div>
  );
}