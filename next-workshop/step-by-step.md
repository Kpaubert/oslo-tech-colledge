# Step by step guide

Here is a step by step guide on how to implement the solution.

## Step 1 - Using Git to clone the project

Firstly, you will need to _clone_ (store locally) the project locally. Although this is not strictly necessary, it is recommended so that you can jump between branches going forward.

### Cloning the project

In order to clone the project, first make sure that you have Git installed on your computer. If you don't have Git installed, go to <a href="https://git-scm.com/">this page</a> and download it.

When you have Git installed, open a terminal, navigate to the directory in which you want to store the project, and run the following command:

```bash
> git clone https://github.com/netlight/oslo-tech-colledge.git
```

## Step 2 - Running the project

Now that you have the project stored locally on your machine, you will be able to run it.

### How to run the project

To run the project locally, you need a Javascript runtime. This is a piece of software your computer needs in order to treat Javascript more or less like a binary executable. NodeJS is the most common Javascript runtime, and can be downloaded <a href="https://nodejs.org/en/download">here</a>.

When installing, make sure to add the download to your computer's path. This allows you to execute the downloaded executable from the terminal without specifying the absolute path. As an example, for Windows you can then write:

- `npm {command}`

instead of

- `C:\Users\{username}\AppData\Roaming\npm.exe {command}`

```bash
> cd next-workshop
> npm install # or the shorthand 'npm i'
> npm run dev
```

When writing `npm run dev`, a process in the console will start, executing your program. This process will also listen to changes in your code, so when you make changes, the website will update.

## Step 3 - Create a component

Before implementing the solution, it can be smart to take a look at [this document](next-intro.md) to get an understanding some NextJS fundamentals.

### Task A: Add a title component

The website currently looks like any other boilerplate NextJS project. We would like more or less a blank slate. Find the file named `page.tsx` and remove all the markup within the `main` element, and remove the style on the `main` element.

Your task is to create a Title component which takes a string parameter (`prop`). The value of the parameter can be anything, e.g. `<Your name>'s cookbook`.

<details>
<summary>Example solution  Task A</summary>

```jsx
/* app/components/Title.tsx */

interface TitleProps {
  text: string;
}

export default function Title({ text }: TitleProps) {
  return (
    <div>
      <h1>{text}</h1>
    </div>
  );
}
```

```jsx
/* app/page.tsx */

import Title from './components/Title';

export default function Home() {
  const text = 'TechCollEDGE cookbook';

  return (
    <main>
      <Title title={text}></Title>
    </main>
  );
}
```

</details>

## Step 4: Adding some states

Inside `page.tsx`, we want two additional components. We need one component where the user can input ingredients, and one that communicates with the OpenAI API. These will need to communicate in some way, since what we send to the API depends on the user input.

To start, we'll add two states to the `page.tsx` file. It needs to store the string we should pass to the API, and a list of ingredients (array of strings).

### Task B: Add the states

<details>
<summary>Example solution  Task B</summary>

```jsx
/* app/page.tsx */

import Title from './components/Title';

export default function Home() {
  const text = 'TechCollEDGE cookbook';

  const [recipeString, setRecipeString] = useState(''); // string type is inferred
  const [ingredients, setIngredients] = useState<string[]>([]); // or useState<Array<string>>([])

  return (
    <main>
      <Title title={text}></Title>
    </main>
  );
}
```

</details>

Now we have some reactive variables, and should make use of them. We'll start by making a component where the user can input ingredients. Start by creating a file called `Ingredients.tsx` inside the `components` folder.

### Task C: Create the component with a form, input and button to submit

<details>
<summary>Example solution  Task C</summary>

```jsx
/* app/components/Ingredients.tsx */

'use client';

import { useState } from 'react';

export default function Ingredients() {
  const [userInput, setUserInput] = useState('');

  return (
    <div>
      <form>
        <input
          name='ingredient'
          type='text'
          placeholder='Enter ingredient'
          autoComplete='off'
          value={userInput}
        />
        <button type='submit'>Add</button>
      </form>
    </div>
  );
}
```

</details>

That covers some of the functionality we need, but the components are not yet connected in a meaningful way. We want to store the ingredients in the parent component (`page.tsx`), since the state should be available for the GPT-component we're creating later. We'll head back to `page.tsx` and make it have a two-way binding with `Ingredients.tsx`.

The form inside `Ingredients.tsx` will fire off an event of the type `FormEvent`. Since we have a named input called `ingredient`, we can extend the `FormEvent` type to include this input variable. There are more ways to do this, and here is one of them:

```jsx
type IngredientForm = {
  target: {
    ingredient: {
      value: string,
    },
  },
} & FormEvent;
```

Add this piece of code in the root scope of `page.tsx` (outside the exported function).

Next, add a function that takes an event of the type `IngredientForm` as a parameter. The function should do the following:

- Prevent the default form event behaviour
- Return early if the ingredient value does not exist on the `event.target` object
- Create a string variable of the input with both sides trimmed (no whitespace on either side)
- Return early if the ingredient is already listed or if the input is empty ('')
- Add the ingredient to the ingredient list

### Task D: Implement the function called `addIngredient`

<details>
<summary>Example solution  Task D</summary>

```jsx
/* app/page.tsx */
type IngredientForm = {
  target: {
    ingredient: {
      value: string,
    },
  },
} & FormEvent;
/* 
export default function Home() {
...
*/
const addIngredient = (event: IngredientForm) => {
  event.preventDefault();
  if (!event.target.ingredient) return;
  const val = event.target.ingredient.value.trim();
  if (ingredients.includes(val) || val === '') return;
  setIngredients((ingredients) => [...ingredients, val]);
};

/*
return (
  <main>...</main>
)
*/
```

</details>

Lastly in this step, we'll add a function for removing ingredients from the ingredient list. This functions takes a string parameter equalling the name of the ingredient we want to remove.

### Task E: Implement the function called `removeIngredient`

<details>
<summary>Example solution  Task E</summary>

```jsx
/* app/page.tsx */

/* 
const addIngredient = (event: IngredientForm) => {
  ...
};
*/
const removeIngredient = (ingredient: string) => {
  setIngredients(() => ingredients.filter((ing) => ing !== ingredient));
};
/* 
return (
  <main>...</main>
)
*/
```

</details>

## Step 5: Connecting the dots

As you can see, there is functionality in the app that is not used. The task ahead is to connect the different parts. Firstly, we'll head back into `Ingredients.tsx` and allow it to take some parameters (props) from its parent component. We want to add the following props:

- Ingredients (of type `Array<string>`)
- Function to add ingredients (of type `FormEventHandler`)
- Function to remove ingredients (of type `Function`)

To do this, we'll add an interface in `Ingredients.tsx` and add it as a parameter of the export function.

### Task F: Allow props in `Ingredients.tsx`

<details>
<summary>Example solution  Task F</summary>

```jsx
/* app/components/Ingredients.tsx */

'use client';

import { FormEventHandler, useState } from 'react';

interface IngredientsProps {
  ingredients: Array<string>;
  addIngredient: FormEventHandler;
  removeIngredient: Function;
}

export default function Ingredients({
  ingredients,
  addIngredient,
  removeIngredient,
}: IngredientsProps) {
  /*
  ...
  */
}
```

</details>

Of course, we need to add the `Ingredients` component to the `page` component. We'll add it after the `Title` component:

```jsx
/* app/page.tsx */

/* ... */
return (
  <main>
    <Title text={text}></Title>
    <Ingredients
      ingredients={ingredients}
      addIngredient={addIngredient}
      removeIngredient={removeIngredient}
    ></Ingredients>
  </main>
);
/* ... */
```

And just like that, the props are available inside the `Ingredients` component. Next is to bind up the props and create functionality for binding the components.

Just above the form element, we want to list the ingredients that are already submitted. With each of them, we want a way to remove that particular ingredient as well. This can be done with a button and an `onClick` event handler.

The form element needs to add the current user input as an ingredient if submitted. This can be done through a `onSubmit` handler.

The input element needs an `onChange` handler to change the value of the `userInput` variable (through `setUserInput`).

### Task G: Implement the aforementioned functionality

<details>
<summary>Example solution  Task G</summary>

```jsx
/* app/components/Ingredients.tsx */

/* ... */
return (
  <div>
    {ingredients.map((ingredient) => {
      return (
        <div key={ingredient}>
          <span>{ingredient}</span>
          <button onClick={() => removeIngredient(ingredient)}>Remove</button>
        </div>
      );
    })}
    <form
      onSubmit={(e) => {
        addIngredient(e);
        setUserInput(() => '');
      }}
    >
      <input
        name='ingredient'
        type='text'
        placeholder='Enter ingredient'
        autoComplete='off'
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      />
      <button type='submit'>Add</button>
    </form>
  </div>
);
/* ... */
```

</details>

With all this in place, the user can add and remove ingredients from a list. The next step is to hook this up with ChatGPT and make it fully functioning!

## Step 6: Creating the assistant

The assistant is what makes the application interesting, and it's time implement it. We will provide some code to take care of the API calls, and your job is to request new recipes and list the answers.

Use the following code as a template for the file `RecipeGTP.tsx`:

```jsx
/* app/components/RecipeGPT.tsx */

'use client';

import { useChat } from 'ai/react';
import { useEffect } from 'react';

interface RecipeGPTProps {
  recipe: string;
}

export default function RecipeGPT({ recipe }: RecipeGPTProps) {
  const { messages, setInput, handleSubmit } = useChat({
    initialMessages: [
      {
        id: '-1',
        role: 'system',
        content:
          'You are a recipe assistant. You create recipes with the ingredients that the user provides. You assume the user has access to salt, pepper, water, and other standard kitchen supplies. You also assume the user has standard kitchen utensils.',
      },
    ],
  });

  useEffect(() => {
    setInput(() => recipe);
  }, [recipe]);

  return (
    /*
    <Your code here>
    */
  )
}
```

Much like in the `Ingredients` component, we want to list the messages, as well as submitting the recipe through a form. It can be helpful looking at <a href="https://www.npmjs.com/package/ai">the package used</a> to see the documentation.

### Task H: Implement the visuals of `RecipeGPT`

<details>
<summary>Example solution Task H</summary>

```jsx
/* app/components/RecipeGPT.tsx */

/* ... */
return (
  <div>
    {messages.map(
      (m) =>
        m.role !== 'system' && (
          <div
            key={m.id}
            style={{ whiteSpace: 'pre-wrap' }}
          >
            {m.role}: {m.content}
          </div>
        )
    )}

    <form onSubmit={handleSubmit}>
      <button type='submit'>Ask for recipe</button>
    </form>
  </div>
);
/* ... */
```

</details>

### Creating an endpoint

Upon submitting the messages, a post request is sent to `localhost:3000/api/chat`, which we have not yet created. Create a file called `route.ts` in the path `app/api/chat` and fill it with the following code:

```ts
/* app/api/chat/route.ts */

import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextRequest } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages,
  });
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
```

This is an endpoint on the server which the website will request upon clicking submit. The client sends the messages that have been exchanged so far, and OpenAI's ChatGPT will stream a reply back to the user.

## Step 7: Finishing and fine tuning

Now that we have a finished product, we can let it live on as is, or try to improve on it. In the next lesson, you will learn how to style the website using TailwindCSS, which can make it look a lot better than it currently does.

Here are some ideas if you want to improve on the solution we've made today.

### Tuning the initial prompt

In the file `app/components/RecipeGPT.tsx`, you see a message object in the `intialMessages` array. The `content` of this message is the initial prompt of the chatbot, and can be changed to alter its behaviour. If you for instance want it to be more aware of allergies, or only suggest meals restricted to certain dietary choices, you can adjust it.

This way, you can also change the chatbot to have a completely different frame of mind. You can for instance say that the user's input are different historical events, and that the chatbot should compare or find similarities between them. There are few practical limits.

A cool resource to check out is <a href="https://learnprompting.org/docs/category/-basics">LearnPrompting</a>. Here you can learn about basic prompt patterns, and more advanced prompt hacking techniques.

You can also check out how Alan D. Thompson made Snapchat's My AI tell him its prompt <a href="https://lifearchitect.ai/snapchat">here</a>. This can also be of inspiration for your own prompts.
