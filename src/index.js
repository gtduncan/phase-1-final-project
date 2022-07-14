let currentShow = {};
let favorites = [];
let currentDrink = [];
let showHeartFav = false;
let drinkHeartFav = false;
const showPicker = document.querySelector('#show-picker');
const showHeader = document.querySelector('#show-header');
const showHeart = document.querySelector('#show-heart');
const drinkPicker = document.querySelector('#drink-picker');
const drinkHeader = document.querySelector('#drink-header')
const drinkHeart = document.querySelector('#drink-heart');
const showFavoriteList = document.querySelector('#show-favorite-list')
const drinkFavoriteList = document.querySelector('#drink-favorite-list')
const showFavoritesHeader = document.querySelector('#show-favorites')
const drinkFavoritesHeader = document.querySelector('#drink-favorites')



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
    currentShow.id = ''
    let editedDescription = currentShow.summary
    replaceTags.forEach(element => editedDescription = editedDescription.replace(element, ''))
    showHeader.innerText = currentShow.name;
    showHeader.href = currentShow.url;
    showDesc.innerText = editedDescription;
    showHeart.innerHTML = '&#x2661';
    showHeart.style.color = 'white';
    showDisplay.style.visibility = 'visible';
    showHeartFav = false;
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
    drinkHeartFav = false;
}

const populateFavoriteDisplay = async () => 
{
    showFavoriteList.innerHTML = ''
    drinkFavoriteList.innerHTML = ''
    const req = await fetch('http://localhost:3000/favorites');
    const res = await req.json();
    console.log(res)
    for(let i=0; i<res.length;i++)
    {
        if(!res[i]['idDrink'])
        {
            const favorite = document.createElement('li');
            const favoriteLink = document.createElement('a');
            favoriteLink.innerText = res[i].name;
            favoriteLink.href = res[i].url;
            favoriteLink.className = 'fav-link';
            favoriteLink.target = "blank";
            showFavoriteList.append(favorite);
            favorite.append(favoriteLink);
        }
        else if(res[i]['idDrink'])
        {
            const favorite = document.createElement('li');
            const favoriteLink = document.createElement('a');
            favoriteLink.innerText = res[i].strDrink;
            favoriteLink.href = res[i].strDrinkThumb;
            favoriteLink.className = 'fav-link';
            favoriteLink.target = "blank";
            drinkFavoriteList.append(favorite);
            favorite.append(favoriteLink);
        }
    }
}

const favoriteShow = async (heart, obj) => {
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
    const favorite = document.createElement('li');
    const favoriteLink = document.createElement('a');
    favoriteLink.innerText = res.name;
    favoriteLink.href = res.url;
    favoriteLink.className = 'fav-link';
    favoriteLink.target = "blank";
    showFavoriteList.append(favorite);
    favorite.append(favoriteLink);
    favorites.push(res)
    showHeartFav = true;
}

const favoriteDrink = async (heart, obj) => {
    heart.innerHTML = '&#x2764';
    heart.style.color = 'red';
    const req = await fetch('http://localhost:3000/favorites', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj['drinks'][0])
    })
    const res = await req.json();
    console.log(res);
    const favorite = document.createElement('li');
    const favoriteLink = document.createElement('a');
    favoriteLink.innerText = res.strDrink;
    favoriteLink.href = res.strDrinkThumb;
    favoriteLink.className = 'fav-link';
    favoriteLink.target = "blank";
    drinkFavoriteList.append(favorite);
    favorite.append(favoriteLink);
    favorites.push(res);
    drinkHeartFav = true;
}

const unfavoriteItem = async (heart) => {
    heart.innerHTML = '&#x2661';
    heart.style.color = 'white';
    const req = await fetch(`http://localhost:3000/favorites/${favorites[favorites.length-1].id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
         })
    const res = await req.json()
    console.log(res)
    populateFavoriteDisplay();
}

showPicker.addEventListener('click', populateShowDisplay);
drinkPicker.addEventListener('click', populateDrinkDisplay);

showHeart.addEventListener('click', () =>
{
    if(showHeartFav == false)
    {
        favoriteShow(showHeart, currentShow)
        
    }
    else if(showHeartFav == true)
    {
        unfavoriteItem(showHeart, showHeartFav)
        showHeartFav=false;
    }
});

drinkHeart.addEventListener('click', () =>
{
    if(drinkHeartFav == false)
    {
        favoriteDrink(drinkHeart, currentDrink)
    }
    else if(drinkHeartFav == true)
    {
        unfavoriteItem(drinkHeart, drinkHeartFav)
        drinkHeartFav=false;
    }
});

populateFavoriteDisplay();