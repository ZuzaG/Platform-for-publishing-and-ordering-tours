# Platform for publishing and ordering tours

The platform is divided into two sections: the Customer section, where you can order any tour, and the admin section, which allows you to add a new tour, edit an existing tour, or delete any tour.

### Customer section

It is intended for the user who is the client. The available tours are displayed in the middle. How can you use it:

- choose a trip by entering the number of ordered tickets in the appropriate fields of the form and clicking 'add to the order'. It's connected with:
  - data validation
  - adding an order to the panel on the right
  - updating the price for the whole
- confirm the order by entering your name and email address into the order field and clicking 'order'. It's connected with:
  - data validation
  - sending the order to the database (API launched using JSON Server)
  - clearing the basket.

### Admin section

The part is intended to manage the entire platform. Previously added tours are displayed in the main part (saved in the database). In a simple and intuitive way, you can:

- adding tours
- deleting tours
- modifying tours.

## 💿 Installation

The project uses [npm](https://www.npmjs.com/). Having it installed, type into the terminal: `npm run start`. For the application to work properly, JSON Server must also be started, so type into the second terminal: `json-server --watch ./data/excursions.json`.

- Customer section

  ```bash
    http://localhost:8080/index.html
  ```

- Admin section

  ```bash
    http://localhost:8080/admin.html
  ```

- API

  ```bash
    http://localost:3000
  ```

## 💡 Technologies

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Webpack](https://img.shields.io/badge/Webpack-8DD6F9?style=for-the-badge&logo=Webpack&logoColor=white)
![Babel](https://img.shields.io/badge/Babel-F9DC3E?style=for-the-badge&logo=babel&logoColor=white)
