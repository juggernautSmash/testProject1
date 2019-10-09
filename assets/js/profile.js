console.log('profile.js is linked')
console.log('getting email info in localStorae')
let email = localStorage.getItem('email')
console.log(`email is ${email}`)
//let userIngredients = []

const generateMyRecipeCard = ({id, title, img, url}) => {//Generate recipe card on the DOM based on selected FETCH 
    //console.log(`running generateRecipeCard`)
    let recipeCard = document.createElement('div')
    recipeCard.id = id
    recipeCard.className = 'row'
    recipeCard.innerHTML = `
    <div class="row">
    <div class="col s12 m6">
        <div class="card">
            <div class="card-image">
                <a href='${url}' target='_blank'>
                <img src="${img}">
                </a>
            <!-- <span class="card-title recipe-title">${title}</span> -->
            <a class="btn-floating halfway-fab waves-effect waves-light activator red">
                <i class="material-icons">clear</i>
            </a>
            </div>
            <div class="card-content blue-grey darken-4">
                <a href='${url}' target='_blank'>
                    <p class="recipe-title">${title}</p>
                </a>
            </div>
            <div class="card-reveal blue-grey darken-4 ">
                <span class="card-title grey-text text-lighten-4">Remove Recipe?
                    <i class="material-icons right">close</i>
                </span>
                <button class="waves-effect waves-light red btn deleteRecipe">YES</button>
                <button class="waves-effect waves-red blue-grey darken btn">NO</button>
            </div>
        </div>
    </div>
</div>
    `
    document.getElementById('myRecipes').append(recipeCard)
}// end generateMyRecipeCard

const addIngredientToDOM = ingredient => {//Creates an entry under ingredients with checkbox
    let foodDiv = document.createElement('li')
    foodDiv.id = ingredient
    foodDiv.innerHTML = `
        <div class="chip">
            ${ingredient}
            <i data-food='${ingredient}' class="close material-icons">close</i>
        </div>
    `
    document.getElementById('ingredientsList').append(foodDiv)
} //end addIngredientToDOM

const getProfile = () => {
    // email = localStorage.getItem('email')
    console.log('running getProfile')

    usersDb.doc(email).get()
    .then(data => {

        //Update Personal Info card
        document.getElementById('name').textContent = data.data().displayName
        document.getElementById('email').textContent = data.data().email

        //Update My Ingredients
        // console.log('food is...')
        // console.log(typeof(data.data().myFood))
        // console.log(data.data().myFood)
        data.data().myFood.forEach(food => {
            addIngredientToDOM(food)
        })
        //document.getElementById('ingredientsList').textContent = data.data().myFood

        //Update My Recipes
        data.data().myRecipes.forEach( recipe => {
            generateMyRecipeCard(recipe)
        })
    })
    .catch( e => {
        console.log('an error has occured')
        console.log(e)
    }) 
} // end getProfile

const addToLocalStorage = (key, value) =>{
    console.log(`running addToLocalStorage`)
    if(localStorage.getItem(key) === null){
        console.log(`${key} does not exist`)
    } else {
        console.log(`key is ${key}`)
        //Get the value in localStorage   
        let keyValue = JSON.parse(localStorage.getItem(key))
        //Push the new value in the data retrieved from localStroge
        keyValue.push(value)
        //Push the updated value to localStorage
        localStorage.setItem(key,JSON.stringify(keyValue))
    }
}//end addToLocalStorage

const removeFromLocalStorage = (key, value) => {
    console.log(`running removeFromLocalStorage`)
    if(localStorage.getItem(key) === null){
        console.log(`${key} does not exist`)
    } else {
        console.log(`key is ${key}`)   
        let keyValue = JSON.parse(localStorage.getItem(key)) //
        keyValue.splice(keyValue.indexOf(value), 1)
        localStorage.setItem(key,JSON.stringify(keyValue))
    }
} //end removeFromLocalStorage

document.getElementById('addItem').addEventListener('click', e => {// Add button action
    console.log(`add button is pressed`)
    e.preventDefault()

    //take value in the text field
    let ingredient = document.getElementById('foodItem').value

    if(ingredient === ''){//handler if no ingredients text
        swal("Please input an ingredient")
    } else if(JSON.parse(localStorage.getItem('myFood')).indexOf(ingredient) >= 0 ){//if ingredient is already in the list
        swal(`${ingredient} is already in your list`)
    } else{// if ingredient is not in the list
        //userIngredients.push(ingredient)
        addIngredientToDOM(ingredient)

        // add food ingredient to firestore
        usersDb.doc(email).update({
            myFood: firebase.firestore.FieldValue.arrayUnion(ingredient)
        })

        // add food ingredient to localStorage
        addToLocalStorage('myFood', ingredient)
    }// end else if

    // Clear the text field
    document.getElementById('foodItem').value = ''

})//end ADD button action

document.addEventListener('click', ({target}) => {
    if(target.className === 'close material-icons'){// Remove a food item
        console.log(`X was pressed with dataset ${target.dataset.food}`)
        // Remove from firestore
        usersDb.doc(email).update({
            myFood: firebase.firestore.FieldValue.arrayRemove(target.dataset.food)
        })
        // Remove from localStorage
        removeFromLocalStorage('myFood', target.dataset.food )
    }// end if

    if(target.className === 'waves-effect waves-light red btn deleteRecipe'){
        console.log(`YES button was clicked`)
        removeRecipeFromLocalStorage(target.dataset.id)
    }

})// end event listener

const removeRecipeFromFirebase = (recipeId) => {
    console.log(`recipeId is ${recipeId}`)
    usersDb.doc(email).get()
    .then( data => {
        // get the array from firebase
        let myRecipes = data.data().myRecipes
        console.log('myRecipes is...')
        console.log(myRecipes)

        //find the index of the recipe in the array
        let myRecipeIndex = myRecipes.findIndex( recipe => recipe.id === recipeId)   
        console.log(`recipe index is ${myRecipeIndex}`)

        //remove the recipe in the array
        myRecipes.splice(myRecipeIndex, 1)  
    })
}

const removeRecipeFromLocalStorage = (recipeId) => {
    console.log(`running removeRecipeFromLocalStorage`)
    let storedRecipes = JSON.parse(localStorage.getItem('myRecipes'))
    let myRecipeIndex = storedRecipes.findIndex( recipe => recipe.id === recipeId)  
    storedRecipes.splice(myRecipeIndex,1)

    localStorage.setItem('myRecipes', storedRecipes)

    document.getElementById(recipeId).remove()
}

//wait 5 seconds before getProfile
setTimeout( getProfile, 5000)