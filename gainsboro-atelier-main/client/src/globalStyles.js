import {createGlobalStyle} from 'styled-components';

const GlobalStyle = createGlobalStyle`
  /* colors */
  :root {
    --color-brand-100: #F0F4FF;
    --color-brand-200: #C6D9FE;
    --color-brand-300: #2A66DF;
    --color-brand-400: #1B50BA;
    --color-grey-050: #EBEBEB;
    --color-grey-100: #949494;
    --color-grey-200: #707070;
    --color-grey-300: #4D4D4D;
    --color-grey-400: #262626;
    --color-yellow-100: #ffc107;
    --space-div-xl: 1280px;
  }

  * {
    font-family: "Roboto", sans-serif;
    box-sizing: border-box;
  }

  body {
    color: var(--color-grey-400);
    margin: 0 auto;
    max-width: 1280px;
  }

  h1 {
    font-size: 4rem;
    font-weight: 700;
  }

  h2 {
    font-size: 2rem;
    font-weight: 500;
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 500;
  }

  h4 {
    font-size: 1.25rem;
    font-weight: 500;
  }

  h5 {
    font-size: 1.125rem;
    text-transform: uppercase;
  }

  h6 {
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    margin-top: 0px;
    margin-bottom: 12px;
  }

  p {
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    margin-top: 4px;
    margin-bottom: 12px;
  }

  input, textarea {
    font-size: 1rem;
    padding: 10px 24px 10px 10px;
    border: 1px solid var(--color-grey-100);
    margin-right: 12px;
    margin-bottom: 12px;
    border-radius: 4px;
  }

  small {
    font-size: .875rem;
    font-weight: 400;
  }

  strong {
    font-weight: 500;
  }

  button {
    background-color: white;
    border-radius: 4px;
    border: 2px solid var(--color-grey-100);
    color: var(--color-grey-200);
    padding: 10px 16px;
    font-weight: 500;
    font-size: 1rem;
  }

  button:hover {
    color: #1B50BA;
    border: 2px solid var(--color-brand-300);
    font-weight: 500px;
  }

  button:active {
    background-color: var(--color-brand-100);
  }

  .italics {
    font-style: italic;
  }

  .subdued {
    color: var(--color-grey-200);
  }
`;

export default GlobalStyle;