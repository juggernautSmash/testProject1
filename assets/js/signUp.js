

document.getElementById('reg').addEventListener('click', e => {
    const firstName = document.getElementById('firstName').value
    const lastName = document.getElementById('lastName').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const passConfirm = document.getElementById('passConfirm').value
    console.log(firstName)

    auth.createUserWithEmailAndPassword(email, password)
        .then(user => {
            console.log('login successful from signOut.js')
            console.log(user)
            console.log(`generating user from from signOut.js`)
            usersDb.doc(email).set({
                displayName: `${firstName} ${lastName}`,
                email: email,
                myFood: [],
                myRecipes: [],
                allergies: []
            })
        })
        .catch(e => {
            console.log('an error has occured from signOut.js')
            console.log(e.message)
        });
})