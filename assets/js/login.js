console.log('login.js is linked')

// FirebaseUI config.
const uiConfig = {
    signInSuccessUrl: './profile.html',
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
    ]
}

// Initialize the FirebaseUI Widget using Firebase.
const ui = new firebaseui.auth.AuthUI(firebase.auth())
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig)

firebase.auth().onAuthStateChanged(user => {
    if (user) { // If signed in, disable sign in button and enable sign out button
        //document.getElementById('firebaseui-auth-container').style.display = 'none'
        document.getElementById('signOut').classList.remove('hide')
        document.getElementById('signOutm').classList.remove('hide')

        //Check if the user exists
        //let exists = false
        usersDb.doc(user.email).get().then( r => {
            if( r.exists ){//If the user exists
                //push email to localStorage
                localStorage.setItem('email', r.data().email)
                localStorage.setItem('myFood', r.data().myFood)
                localStorage.setItem('myRecipes'), r.data().myRecipes
            } else {// if the user does not exist, most likely  new user
                //Create a user profile in firestore 
                let userObj = {
                    displayName: user.displayName,
                    email: user.email
                    }
                usersDb.doc(user.email).set(userObj)
            }
        })
    } else { // if signed out display sign in button and disable sign out button
        //document.getElementById('firebaseui-auth-container').style.display = 'block'
        document.getElementById('signOut').classList += 'hide'
        document.getElementById('signOutm').classList += 'hide'

        //Remove email from local storage
        localStorage.removeItem('email')
        localStorage.removeItem('myFood')
    }
})

// Add sign off button
document.getElementsByClassName('signOut').addEventListener('click', e => {
    firebase.auth().signOut()
  })