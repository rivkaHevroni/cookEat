function GetRecipeElement(recipe){
    var recipeElement = document.createElement('recipe');
    var id = document.createElement('p');
    var image = document.createElement('IMG');
    var recipeTitle = document.createElement('p');
    var breakLine = document.createElement('br');
    recipeTitle.innerHTML=recipe.recipeTitle;
    id.innerHTML = recipe.id;
    image.src = recipe.picture;
    recipeTitle.style.textAlign="center";
    image.style.marginLeft="auto";
    image.style.marginRight="auto";
    image.style.display="block";
    image.style.width="90%";
    image.style.height= "180px";
    id.style.display="none";
    recipeElement.appendChild(id);
    recipeElement.appendChild(image);
    recipeElement.appendChild(recipeTitle);
    recipeElement.appendChild(breakLine);
    
    return recipeElement;
}

function moreDetailsEvent(id, recipes){
    var i;
    for(i=0; i<recipes.length; i++){
        if(id == recipes[i]._id){
            var modalHeader = document.createElement('div');
            modalHeader.setAttribute("class", "modal-header");
            var image1 = document.createElement('IMG');
            image1.src=recipes[i].Picture;
            image1.setAttribute("class", "card-img-top");
            modalHeader.appendChild(image1);
        }
    }
}

function PrintRecipes(recipes){

    var numOfRecipe = 0;
    var numOfRows = Math.ceil((recipes.length)/4, 0);
    var table = document.createElement('table');
    for(var i=0; i<numOfRows; i++){
        var row = table.insertRow(i);
        for(var j=0; j<4; j++){
           if(numOfRecipe<recipes.length){
                var cell = row.insertCell(j);
                cell.style.border="solid white 20px";
                cell.style.backgroundColor="#F5F5F5";
                cell.appendChild(GetRecipeElement(recipes[numOfRecipe]));
                var saveButton = document.createElement('BUTTON');
                saveButton.innerHTML="מחק";
                saveButton.setAttribute("class", "btn btn-danger");
                saveButton.setAttribute("id", recipes[numOfRecipe].id);
                saveButton.onclick = ev => deleteRecipe(ev.target.id);
                var sp1 = document.createElement('span');
                sp1.setAttribute("class", "glyphicon glyphicon-minus-sign");
                saveButton.appendChild(sp1);
                cell.appendChild(saveButton);
                var moreDetails = document.createElement('BUTTON');
                moreDetails.setAttribute("class", "btn btn-danger");
                moreDetails.innerHTML = "לפרטים נוספים ";
                moreDetails.setAttribute("id", recipes[numOfRecipe].id);
                //moreDetails.setAttribute("id", "5");
                moreDetails.onclick = function(ev) {
                    moreDetailsOnClick(recipes, ev.target.id)
                }; 
                var sp2 = document.createElement('span');
                sp2.setAttribute("class", "glyphicon glyphicon-plus")
                moreDetails.appendChild(sp2);
                cell.appendChild(moreDetails);
                //var demo = document.getElementById(recipes[i]._id);
           }
           else{
                var cell = row.insertCell(j);
                var image = document.createElement('IMG');
                image.src="http://www.allwhitebackground.com/images/2/2270.jpg";
                image.style.width="90%";
                image.style.height= "180px";
                cell.appendChild(image);
           }
           cell.style.padding="0";
           cell.style.width="400px";
           cell.style.verticalAlign="top";
           cell.style.position="relative";
           saveButton.style.position="absolute";
           saveButton.style.bottom="1px";
           saveButton.style.left="1px";
           saveButton.style.borderRadius="5px";
           saveButton.style.padding="3px";
           saveButton.style.color="white";
           saveButton.style.fontWeight="bold";
           moreDetails.style.position="absolute";
           moreDetails.style.bottom="1px";
           moreDetails.style.left="50px";
           moreDetails.style.borderRadius="5px";
           moreDetails.style.fontWeight="bold";
           moreDetails.style.padding="3px";
           numOfRecipe++;
        }
    }
    return table;
}

function deleteRecipe(recipeId) {
    var userId = localStorage.getItem("userName");

    var removeRecipeRequest = {
        UserId: userId, 
        RecipeId: recipeId
    };

    fetch("http://localhost/Api/UserProfile/RemoveRecipe", {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(removeRecipeRequest)
    }).
    then(() => {
        alert("המתכון הוסר בהצלחה!");
        window.location.href = "http://localhost/PersonalArea.html";
    });
}

function moreDetailsOnClick(recipes, id){
    var recipeDetails = recipes.find(function(recipe) {
        return recipe.id === id;
      });

    document.getElementById('recipe-modal').style.display = "block"; // Make the modal visble
    document.getElementById("recipe-image").src= recipeDetails.picture;
    document.getElementById("recipe-title").innerHTML = recipeDetails.recipeTitle;
    document.getElementById("time").innerHTML = recipeDetails.preparationTime;
    document.getElementById("recipe-link").href = recipeDetails.link;
    document.getElementById("recipe-link").target ="_blank";
    document.getElementById("recipe-link").innerHTML = "למעבר למתכון המלא לחץ כאן";
    if(recipeDetails.numberOfDishes != 0){
        document.getElementById("numOfDis").innerHTML = recipeDetails.numberOfDishes;
        document.getElementsByClassName("space").innerHTML = "  ";
        document.getElementById("dishes").innerHTML = "&nbsp מנות";
    }
    var recipeIngrediantsDiv = document.getElementById("recipe-ingrediants");
    recipeIngrediantsDiv.innerHTML = null;
    recipeDetails.ingredientsList.forEach(ingredient => {
        var ingredientRow = document.createElement("tr");

        var ingredientAmountColumn = document.createElement("td");
        var amount = ingredient.quantity.amount;
        if (amount != 0)
        {
            ingredientAmountColumn.className = "amount";
            ingredientAmountColumn.innerHTML = amount;
        }
        ingredientRow.appendChild(ingredientAmountColumn);

        var ingredientNameColumn = document.createElement("td");
        ingredientNameColumn.innerHTML = "&nbsp" + ingredient.name;
        ingredientRow.appendChild(ingredientNameColumn);

        recipeIngrediantsDiv.appendChild(ingredientRow);
    });
}

var userName = localStorage.getItem("userName");
if (userName == null) {
    window.location.href = "http://localhost/Authentication.html";
}
else {
    var getUserSavedRecipesRequest = {UserId: userName};
    fetch("http://localhost/Api/UserProfile/UserRecipes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify(getUserSavedRecipesRequest)
        }).
        then(response => response.json()).
        then(getUserSavedRecipesResponse => document.getElementById('ronen').appendChild(PrintRecipes(getUserSavedRecipesResponse.recipes)));
}

document.getElementById("logoffBut").addEventListener('click', (clickEvent) => {
    clickEvent.preventDefault();
    localStorage.removeItem("userName");
    window.location.href = "http://localhost/index.html";
})

document.getElementById("homePageBut").addEventListener('click', (clickEvent) => {
    clickEvent.preventDefault();
    window.location.href = "http://localhost/index.html";
})
