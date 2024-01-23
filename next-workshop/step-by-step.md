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

<details>
<summary>How to run the project</summary> 
To run the project locally, you need a Javascript runtime. This is a piece of software your computer needs in order to treat Javascript more or less like a binary executable. NodeJS is the common Javascript runtime, and can be downloaded <a href="https://nodejs.org/en/download">here</a>.

```bash
> cd next-workshop
> npm install # or the shorthand 'npm i'
> npm run dev
```

</details>

## Step 3 - Implementing the solution

Before implementing the solution, it can be smart to take a look at [this document](next-intro.md) to get an understanding some NextJS fundamentals.

### Task A: Add a title component

The website currently looks like any other boilerplate NextJS project. We would like more or less a blank slate. Find the file named `page.tsx` and remove all the markup within the `main` element, and remove the style on the `main` element.

Your task is to create a Title component which takes a string parameter (`prop`). The value of the parameter can be anything, e.g. `<Your name>'s cookbook`.

<details>
<summary>Example solution  Task A</summary>

```jsx
interface TitleProps {
  text: string;
}

export default function ({ text }: TitleProps) {
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

```jsx
/* app/page.tsx */

export default function Home() {
  return (
    <main>
      <h1>Your name</h1>
    </main>
  );
}
```

</details>
