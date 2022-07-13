currentShow = {};
currentDrink = [];
const showPicker = document.querySelector('#show-picker');
const showHeader = document.querySelector('#show-header');
const showHeart = document.querySelector('#show-heart');
const drinkPicker = document.querySelector('#drink-picker');
const drinkHeader = document.querySelector('#drink-header')
const drinkHeart = document.querySelector('#drink-heart');
const favoriteList = document.querySelector('#favorite-list')

const getShows = async () => {
    // make this no longer hardcoded, access all shows, get #, then random from that #
    const randID = Math.floor(Math.random()*1000);
    const req = await fetch(`https://api.tvmaze.com/shows/${randID}`);
    const res = await req.json();
    console.log(res)
    return res;
}

const getDrinks = async () => {
    const req = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/random.php`);
    const res = await req.json();
    console.log(res)
    return res;
}

const populateShowDisplay = async () => {
    const replaceTags = ['<p>',  '<b>', '</p>', '</b>', '<i>', '</i>', '<br />', '<br />']
    const showDisplay = document.querySelector('#show-display');
    const showDesc = document.querySelector('#show-desc')
    currentShow = await getShows();
    let editedDescription = currentShow.summary
    for(let i=0;i<replaceTags.length;i++)
    {
        editedDescription = editedDescription.replace(replaceTags[i], '')
    }
    // change to forEach
    showHeader.innerText = currentShow.name;
    showHeader.href = currentShow.url;
    showDesc.innerText = editedDescription;
    showHeart.innerHTML = '&#x2661';
    showHeart.style.color = 'white';
    showDisplay.style.visibility = 'visible';
}

const populateDrinkDisplay = async () => {
    const drinkDisplay = document.querySelector('#drink-display')
    const drinkIngredients = document.querySelector('#drink-ingredients')
    const drinkInstructions = document.querySelector('#drink-instructions')
    let drinkList = document.querySelector('#drink-list');
    currentDrink = await getDrinks();
    console.log(currentDrink)
    currentDrinkObj = currentDrink['drinks'][0];
    console.log(currentDrinkObj)
    drinkHeader.innerText = currentDrinkObj.strDrink;
    drinkHeader.href = currentDrinkObj.strDrinkThumb;
    drinkInstructions.innerText = currentDrinkObj.strInstructions;
    drinkHeart.innerHTML = '&#x2661';
    drinkHeart.style.color = 'white';
    drinkList.remove()
    drinkList = document.createElement('ul')
    drinkList.id = 'drink-list'
    drinkIngredients.append(drinkList)
    for(let i=1;i<15;i++)
    {
        if(currentDrinkObj[`strIngredient${i}`] !== null)
        {
            const newIngredient = document.createElement('li')
            newIngredient.innerText = currentDrinkObj[`strIngredient${i}`]
            drinkList.append(newIngredient)
        }
    }
    drinkDisplay.style.visibility = 'visible';
}

const populateFavoriteDisplay = async () => 
{
    const req = await fetch('http://localhost:3000/favorites');
    const res = await req.json();
    console.log(res)
    for(let i=0; i<res.length;i++)
    {
        const favorite = document.createElement('li');
        const favoriteLink = document.createElement('a');
        favoriteLink.innerText = res[i].name;
        favoriteLink.href = res[i].url;
        favoriteLink.className = 'fav-link';
        favoriteList.append(favorite);
        favorite.append(favoriteLink);
    }
}

const favoriteItem = async (heart, obj) => {
    heart.innerHTML = '&#x2764';
    heart.style.color = 'red';
    const req = await fetch('http://localhost:3000/favorites', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })
    const res = await req.json();
    console.log(res);
}

const unfavoriteItem = (heart, obj) => {
    heart.innerHTML = '&#x2661';
    heart.style.color = 'white';
}

showPicker.addEventListener('click', populateShowDisplay);
drinkPicker.addEventListener('click', populateDrinkDisplay);

showHeart.addEventListener('click', () =>
{
    favoriteItem(showHeart, currentShow)
});

drinkHeart.addEventListener('click', () =>
{
    favoriteItem(drinkHeart)
});

populateFavoriteDisplay();