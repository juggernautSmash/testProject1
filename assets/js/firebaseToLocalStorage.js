


if (localStorage.getItem('email')) {
  let email = localStorage.getItem('email')
} else {
  alert('Not signed in')
}

// On Click of Button
document.querySelector('#click-button').addEventListener('click', e => {

  //  Store User Data from Firebase to localStorage
  usersDb.collection('testDb').doc(email)
    .get()
    .then(x => {
      localStorage.setItem('myFood', JSON.stringify(x.data().myFood))
      localStorage.setItem('myRecipe', JSON.stringify(x.data().myRecipe))
    })

})
