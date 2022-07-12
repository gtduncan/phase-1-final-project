currentShow = {};
const showPicker = document.querySelector('#show-picker');
const showHeader = document.querySelector('#show-header');
const showHeart = document.querySelector('#show-heart')

const getShows = async () => {
    // make this no longer hardcoded, access all shows, get #, then random from that #
    const randID = Math.floor(Math.random()*1000);
    const req = await fetch(`https://api.tvmaze.com/shows/${randID}`);
    const res = await req.json();
    console.log(res)
    return res;
}

const populateShowDisplay = async () => {
    const replaceTags = ['<p>',  '<b>', '</p>', '</b>', '<i>', '</i>', '< /br>', '< /br>']
    const showDisplay = document.querySelector('#show-display');
    const infoContainer = document.querySelector('#info-container');
    const showDesc = document.querySelector('#show-desc')
    let currentShow = await getShows();
    let editedDescription = currentShow.summary
    for(let i=0;i<replaceTags.length;i++)
    {
        editedDescription = editedDescription.replace(replaceTags[i], '')
    }
    showHeader.innerText = currentShow.name;
    showHeader.href = currentShow.url;
    showDesc.innerText = editedDescription;
    showHeart.innerHTML = '&#x2661';
    showHeart.style.color = 'white';
    infoContainer.style.visibility = 'visible';
    showDisplay.style.visibility = 'visible';
}

const favoriteItem = () => {
    showHeart.innerHTML = '&#x2764';
    showHeart.style.color = 'red';
}

const unfavoriteItem = () => {
    showHeart.innerHTML = '&#x2661';
    showHeart.style.color = 'white';
}

showPicker.addEventListener('click', populateShowDisplay);
showHeart.addEventListener('click', () =>
{
    favoriteItem()
});

