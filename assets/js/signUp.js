

document.getElementById('reg').addEventListener('click', e => {
    const firstName = document.getElementById('firstName').value
    const lastName = document.getElementById('lastName').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const passConfirm = document.getElementById('passConfirm').value
    console.log(firstName)

    auth.createUserWithEmailAndPassword(email, password)
        .then(user => {
            console.log('login successful')
            console.log(r)
            usersDb.doc(email).set({
                displayName: user.displayName,
                email: user.email,
                myFood: [],
                myRecipes: [],
                allergies: []
            })
        })
        .catch(e => {
            console.log('an error has occured')
            console.log(e.message)
        });

})