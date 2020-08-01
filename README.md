This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Front-End test for OLSoftware


## Description

In this project you will find the fronend test performed for OLSoftware.
The test consists of layout and functionality of two main components.

### Home - Login Page

In this component the user will be able to log in to the platform using email and password, verifying with google or registering if they have the PIN.
All the users passwords are hashed using SHA256 with a random SLAT variable (REACT_APP_PIN_SALT).

### Dashboard - Users table Page

In this component the user will be able to view the table with the information of all the users. 
He will be able to filter in the same table or also in a filter panel to the right of the screen.
If the user is an administrator ("administrador"), he can create, modify, delete users or export the table in PDF/CSV format.

If a user is going to be created, modified or deleted from this screen; Cloud functions will be used to avoid compromising data.
You can see the cloud funcions in this repository: [Cloud Funciotns](https://github.com/smoralesusma/firebase-functions.git)

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
