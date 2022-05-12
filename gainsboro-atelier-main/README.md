

# Setup
1. Create a file `config.js` file. Make sure to add it to your `.gitignore`
2. Create a cloudinary token (for image uploading)
3. Below is the need format for the `config.js` file. `Token` refers to the API token.
  ```
  module.exports = {
    cloudinaryInfo: {
      cloud_name: '',
      api_key: '',
      api_secret: ''
    },
    token: ''
  }
  ```
4. Run the following commands in your terminal: `npm install`, `npm run server-dev`, `npm run react-dev`
5. open `http://localhost:3000/` in the browser.


# Overview
The single API call is made in the `App` component

**Image gallery: ** Displays product images and includes and an expanded view interactions to zoom into a selected image.
**Product information: ** Displays a star rating, product category, title, price
**Style selector: ** Interactive thumbnails for each style of the product. Selecting a style will change change the related images and available sizes.
**Add to cart: **Two dropdowns that allow the user to select the size and quantity of the item to add to their cart. The options available within these dropdowns will vary based on the selected product style.

