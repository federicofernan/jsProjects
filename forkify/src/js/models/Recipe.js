import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id
    }

    async getRecipe() {
        try{
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?&rId=${this.id}`);

            this.publisher = res.data.recipe.publisher;
            this.ingredients = res.data.recipe.ingredients;
            this.source_url = res.data.recipe.source_url;
            this.image_url = res.data.recipe.image_url;
            this.title = res.data.recipe.title;
            this.social_rank = res.data.recipe.social_rank;
            this.publisher_url = res.data.recipe.publisher_url;
        }
        catch(error) {
            console.log(error)
            alert(`Something went wrong :( ${error}`);
        };
    }

    calculateTime() {
        //Rough estimation of the cooking time
        // 15 min for each 3 ingredients
        const numIngredients = this.ingredients.length;
        const periods = Math.ceil(numIngredients / 3);
        this.timeToCook = periods * 15;
    }
    calculateServings() {
        //Assume every recipe is for 4 servings
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map(element => {
            // Uniform the units
            let ingredient = element.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });
            // Remove Parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
            // Parse Ingredients into count, unit and ingredients
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIngredient;
            if (unitIndex > -1) {
                //Unit found
                const arrCount = arrIng.slice(0, unitIndex);
                let count;
                if (arrIng.length === 1) {
                    count = eval(arrIng[0].replace('-','+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                };

                objIngredient = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };

            } else if(parseInt(arrIng[0],10)) {
                //No unit found but the first element is a number
                objIngredient = {
                    count: parseInt(arrIng[0],10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                };
            } else if (unitIndex === -1) {
                //No unit found
                objIngredient = {
                    count: 1,
                    unit: '',
                    ingredient
                };
            };
            return objIngredient;
        });
        this.ingredients = newIngredients;
    }

    updateServings (type) {
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        // Calculate ingredients
        this.ingredients.forEach(ing => {
           ing.count *= (newServings / this.servings);
        });
        this.servings = newServings;
    }

}