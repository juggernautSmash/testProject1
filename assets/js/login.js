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
        document.querySelectorAll('.signOut').classList.remove('hide')

        // User is signed in.
        let userObj = {
            displayName: user.displayName,
            email: user.email
            }

        //push user info to firestore
        usersDb.doc(user.email).set(userObj)
        //push email to localStorage
        localStorage.setItem('email', user.email)

    } else { // if signed out display sign in button and disable sign out button
        //document.getElementById('firebaseui-auth-container').style.display = 'block'
        document.querySelectorAll('.signOut').classList += 'hide'

        //Remove email from local storage
        localStorage.removeItem('email')
        localStorage.removeItem('myFood')
    }
})